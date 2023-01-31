import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFieldsTable, getTangoFields } from '@reducers';
import { Container } from 'react-bootstrap';
import { PageHeader, DataTable, Loader, UserDropDown } from '@components/core';
import { headerLabel } from '@utilities';
import AddField from './add-field';

const Fields = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const { fieldsTable, fields } = useSelector((state) => state);

	const [isLoading, setIsLoading] = useState(true);
	const [columns, setColumns] = useState();
	const [rows, setRows] = useState();
	const [pagination, setPagination] = useState();
	const [metadata, setMetadata] = useState();
	const [sortColumns, setSortColumns] = useState();

	const tableName = params.table;

	// fetch table & fields data for dropdown
	useEffect(() => {
		dispatch(getFieldsTable(tableName));
		dispatch(getTangoFields(tableName));
	}, [dispatch, tableName]);

	//set columns
	useEffect(() => {
		if (fieldsTable.data) {
			if (fieldsTable.data.length === 0) {
				setColumns([]);
			} else {
				const keys = Object.keys(fieldsTable.data[0]);

				const cols = keys
					.filter(
						(key) =>
							[
								'choices',
								'_rid_',
								'total_rows',
								'date_created',
								'date_modified',
								'record_owner',
								'last_modified_by',
								'related_table_id',
								'required',
								'table_name',
								'property_name',
								'is_active',
								'original_table',
								'description',
								'look_up',
								'mode',
								'unique',
								'original_property_name',
								'is_function',
								'is_searchable',
								'choice_list',
								'order',
								'default_value',
								'default_today',
								'num_lines',
								'decimal_places',
								'maxlength',
								'width',
								'bold',
								'does_total',
								'does_average',
								'allow_new_choices',
								'blank_is_zero',
								'exact',
								'formula',
								'nowrap',
								'currency_format',
								'format',
								'currency_symbol',
								'fieldhelp'
							].indexOf(key) === -1
					)
					.map((key) => ({
						key,
						label: headerLabel(key),
						field_type: headerLabel(key.field_type)
					}));
				setColumns(cols.filter((col) => col));
			}
		}
	}, [fieldsTable]);

	// set rows, metadata, pagination, sort-columns
	useEffect(() => {
		if (fieldsTable.data) {
			const { data, metadata } = fieldsTable;
			const { sort_column, sort_direction } = metadata || {};
			const sortColumns = sort_column ? [{ columnKey: sort_column, direction: sort_direction }] : [];

			setRows(data);
			setMetadata(metadata);
			setPagination(metadata);
			setSortColumns(sortColumns);
		}
	}, [fieldsTable]);

	// set is-loading
	useEffect(() => {
		if (
			fieldsTable.action === 'fieldsTable/fetched' &&
			fields.action === 'fields/fetched' &&
			columns &&
			pagination &&
			rows &&
			sortColumns
		) {
			setIsLoading(false);
		}
	}, [columns, fieldsTable, fields, pagination, rows, sortColumns]);

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id={tableName}>
					{fieldsTable.action === 'fieldsTable/fetching' && <Loader />}
					<DataTable
						style={{
							height: '68vh',
							boxShadow: '2px 4px 8px 1px rgba(0, 0, 0, 0.14)',
							borderRadius: '10px',
							border: '1px solid #DFDFDF'
						}}
						columns={columns}
						rows={rows}
						pagination={pagination}
						sortColumns={sortColumns}
						actions={<AddField />}
						columnActions={[
							{
								id: 'edit',
								action: (row) => {
									navigate(`${pathname}/${row.field_id}`);
								}
							},
							{
								id: 'key',
								action: (row) => {
									console.log(row);
								}
							},
							{
								id: 'delete',
								action: (row) => {
									console.log(row);
								}
							}
						]}
						columnOptions={{
							resizable: true,
							sortable: true,
							disabled: true
						}}
						onRowSelect={(rows) => {
							console.log(rows);
						}}
						onFetch={(meta) => {
							dispatch(getFieldsTable(tableName, meta));
						}}
						toolbar={{
							search: {
								column: metadata.search_column,
								text: metadata.search_text,
								func: (text, column) => {
									const meta = { ...metadata };

									meta['search_text'] = text;
									meta['search_column'] = column;

									window.sessionStorage.setItem('tables-metadata', JSON.stringify(meta));

									dispatch(getFieldsTable(tableName, meta));
								},
								options: columns
							},
							showdropdown: {
								text: metadata.search_text,
								func: (text) => {
									const meta = { ...metadata };
									meta['search_text'] = text;
									meta['search_column'] = 'field_type';

									window.sessionStorage.setItem('tables-metadata', JSON.stringify(meta));
									dispatch(getFieldsTable(tableName, meta));
								},

								options: fields.data
							}
						}}
						onSortColumnsChange={(columns) => {
							const meta = { ...metadata };

							if (columns.length === 0) {
								delete meta['sort_column'];
								delete meta['sort_direction'];
							} else {
								meta['sort_column'] = columns[0].columnKey;
								meta['sort_direction'] = columns[0].direction;
							}

							window.sessionStorage.setItem('tables-metadata', JSON.stringify(meta));

							dispatch(getFieldsTable(tableName, meta));
						}}
					/>
				</Container>
			)}
		</React.Fragment>
	);
};

export default Fields;
