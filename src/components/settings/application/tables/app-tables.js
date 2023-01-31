import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { PageHeader, DataTable, Loader, UserDropDown } from '@components/core';
import { getTangoFields, getAllTangoTables } from '@reducers';
import AddTable from './add-table';

const AppTables = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { fields, tables } = useSelector((state) => state);

	const [columns, setColumns] = useState([]);
	const [metadata, setMetadata] = useState();
	const [pagination, setPagination] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [sortColumns, setSortColumns] = useState();
	const [rows, setRows] = useState();

	useEffect(() => {
		dispatch(getAllTangoTables());
		dispatch(getTangoFields('tango59_table_list'));
	}, [dispatch]);

	const fieldsFilterData = (key) => {
		if (!key) return null;

		const { property_name, label, field_type, order, is_searchable } = key;
		return {
			key: property_name,
			field_type,
			label,
			order,
			is_searchable
		};
	};

	// set rows, metadata, pagination, sort-columns
	useEffect(() => {
		if (tables.data) {
			const { data, metadata, fields } = tables;
			const { sort_column, sort_direction } = metadata || {};
			const sortColumns = sort_column ? [{ columnKey: sort_column, direction: sort_direction }] : [];
			const cols = fields ? fields.map(fieldsFilterData) : [];

			setColumns(cols.filter((col) => col).sort((a, b) => (a.order > b.order ? 1 : b.order > a.order ? -1 : 0)));
			setRows(data);
			setMetadata(metadata);
			setPagination(metadata);
			setSortColumns(sortColumns);
		}
	}, [tables]);

	// set is-loading
	useEffect(() => {
		if (
			fields.action === 'fields/fetched' &&
			tables.action === 'tables/fetched' &&
			columns &&
			pagination &&
			rows &&
			sortColumns
		) {
			setIsLoading(false);
		}
	}, [columns, fields, pagination, tables, rows, sortColumns]);

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id="tables">
					{tables.action === 'tables/fetching' && <Loader />}
					<DataTable
						style={{
							height: '68vh',
							boxShadow: '2px 4px 8px 1px rgba(0, 0, 0, 0.14)',
							borderRadius: '10px',
							border: '1px solid #DFDFDF'
						}}
						actions={<AddTable />}
						columnActions={[
							{
								id: 'view',
								action: (row) => {
									navigate(`${location.pathname}/${row.api_route}`);
								}
							}
						]}
						onFetch={(meta) => {
							dispatch(getAllTangoTables(meta));
						}}
						rows={rows}
						columns={columns}
						columnOptions={{
							resizable: true,
							sortable: true,
							disabled: true
						}}
						pagination={pagination}
						sortColumns={sortColumns}
						toolbar={{
							search: {
								column: metadata.search_column,
								text: metadata.search_text,
								func: (text, column) => {
									const meta = { ...metadata };

									meta['search_text'] = text;
									meta['search_column'] = column;

									window.sessionStorage.setItem('tables-metadata', JSON.stringify(meta));

									dispatch(getAllTangoTables(meta));
								},
								options: columns.filter((item) => item.is_searchable)
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

							dispatch(getAllTangoTables(meta));
						}}
					/>
				</Container>
			)}
		</React.Fragment>
	);
};

export default AppTables;
