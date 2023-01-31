import React, { useEffect, useState } from 'react';
import { PageHeader, DataTable, Loader, UserDropDown } from '@components/core';
import { useDispatch, useSelector } from 'react-redux';
import { getTangoFields, getReportsAndCharts } from '@reducers';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AddReport from './add-report';

const ReportsAndCharts = () => {
	const { pathname } = useLocation();
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();

	const { fields, reportsAndCharts } = useSelector((state) => state);

	const [columns, setColumns] = useState();
	const [rows, setRows] = useState();
	const [pagination, setPagination] = useState();
	const [sortColumns, setSortColumns] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [metadata, setMetadata] = useState();

	const tableName = params.table;

	//fetch fields & reports and charts
	useEffect(() => {
		dispatch(getTangoFields('qb_query_list'));
		dispatch(getReportsAndCharts(tableName));
	}, [dispatch, tableName]);

	//set columns
	useEffect(() => {
		if (fields.data && reportsAndCharts.data) {
			if (reportsAndCharts.data.length === 0) {
				setColumns([]);
			} else {
				const keys = Object.keys(reportsAndCharts.data[0]);
				const cols = keys.map((key) => {
					const field = fields.data.find((field) => field.property_name === key);

					if (!field) return null;

					return {
						key,
						label: field.label,
						field_type: field.field_type
					};
				});

				setColumns(cols.filter((col) => col));
			}
		}
	}, [fields.data, reportsAndCharts.data]);

	// set rows, metadata, pagination, sort-columns
	useEffect(() => {
		if (reportsAndCharts.data) {
			const { data, metadata } = reportsAndCharts;
			const { sort_column, sort_direction } = metadata || {};
			const sortColumns = sort_column ? [{ columnKey: sort_column, direction: sort_direction }] : [];

			setRows(data);
			setMetadata(metadata);
			setPagination(metadata);
			setSortColumns(sortColumns);
		}
	}, [reportsAndCharts]);

	// set is-loading
	useEffect(() => {
		if (
			fields.action === 'fields/fetched' &&
			reportsAndCharts.action === 'reportsAndCharts/fetched' &&
			columns &&
			pagination &&
			rows &&
			sortColumns
		) {
			setIsLoading(false);
		}
	}, [columns, fields, pagination, reportsAndCharts, rows, sortColumns]);

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id={tableName}>
					{reportsAndCharts.action === 'reportsAndCharts/fetching' && <Loader />}
					<DataTable
						style={{
							height: '68vh',
							boxShadow: '2px 4px 8px 1px rgba(0, 0, 0, 0.14)',
							borderRadius: '10px',
							border: '1px solid #DFDFDF'
						}}
						actions={<AddReport />}
						columns={columns}
						rows={rows}
						pagination={pagination}
						sortColumns={sortColumns}
						columnActions={[
							{
								id: 'edit',
								action: (row) => {
									navigate(`${pathname}/${row.id}/edit`);
								}
							},
							{
								id: 'delete',
								action: () => {
									console.log('delete!!');
								}
							},
							{
								id: 'copy',
								action: () => {
									console.log('copy!!');
								}
							}
						]}
						columnOptions={{
							resizable: true,
							sortable: true,
							disabled: true
						}}
						onFetch={(meta) => {
							dispatch(getReportsAndCharts(tableName, meta));
						}}
						toolbar={{
							search: {
								column: metadata.search_column,
								text: metadata.search_text,
								func: (text, column) => {
									const meta = { ...metadata };

									meta['search_text'] = text;
									meta['search_column'] = column;

									window.sessionStorage.setItem('reports-and-charts-metadata', JSON.stringify(meta));

									dispatch(getReportsAndCharts(tableName, meta));
								},
								options: columns
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

							window.sessionStorage.setItem('reports-and-charts-metadata', JSON.stringify(meta));

							dispatch(getReportsAndCharts(tableName, meta));
						}}
					/>
				</Container>
			)}
		</React.Fragment>
	);
};

export default ReportsAndCharts;
