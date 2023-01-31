import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTables, getTangoFields, getRoles, updateUser, showNotification } from '@reducers';
import { Container } from 'react-bootstrap';
import { PageHeader, DataTable, Loader, UserDropDown } from '@components/core';
import AddUser from './add-user';

const Users = () => {
	const dispatch = useDispatch();

	const { tables, fields } = useSelector((state) => state);

	const [isLoading, setIsLoading] = useState(true);
	const [columns, setColumns] = useState();
	const [rows, setRows] = useState();
	const [pagination, setPagination] = useState();
	const [metadata, setMetadata] = useState();
	const [sortColumns, setSortColumns] = useState();

	const tableName = 'users';

	// fetch table & fields
	useEffect(() => {
		dispatch(getTables(tableName));
		dispatch(getTangoFields('vmanage_users_list'));
		dispatch(getRoles('user-roles'));
	}, [dispatch]);

	//set columns
	useEffect(() => {
		if (fields.data && tables.data) {
			if (tables.data.length === 0) {
				setColumns([]);
			} else {
				const keys = Object.keys(tables.data[0]);
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
	}, [fields.data, tables.data]);

	// set rows, metadata, pagination, sort-columns
	useEffect(() => {
		if (tables.data) {
			const { data, metadata } = tables;
			const { sort_column, sort_direction } = metadata || {};
			const sortColumns = sort_column ? [{ columnKey: sort_column, direction: sort_direction }] : [];

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

	const onChangeRow = (row, status) => {
		if (status.column.name === 'Role') {
			let { name, role, user_id } = row[status.indexes[0]];
			dispatch(updateUser({ user_id, role_id: Number(role) })).then((res) => {
				const notification = {
					title: `${name} User Update`,
					message: 'User Updated',
					show: true,
					type: 'success'
				};
				if (!res.success) {
					notification.message = res.message;
					notification.type = 'danger';
				}
				dispatch(showNotification(notification));
				dispatch(getTables(tableName));
			});
		}
	};

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id={tableName}>
					{tables.action === 'tables/fetching' && <Loader />}
					<DataTable
						style={{
							height: '68vh',
							boxShadow: '2px 4px 8px 1px rgba(0, 0, 0, 0.14)',
							borderRadius: '10px',
							border: '1px solid #DFDFDF'
						}}
						actions={<AddUser />}
						columns={columns}
						rows={rows}
						pagination={pagination}
						onRowsChange={onChangeRow}
						sortColumns={sortColumns}
						columnOptions={{
							resizable: true,
							sortable: true,
							disabled: true
						}}
						onFetch={(meta) => {
							dispatch(getTables(tableName, meta));
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

									dispatch(getTables(tableName, meta));
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

							window.sessionStorage.setItem('tables-metadata', JSON.stringify(meta));

							dispatch(getTables(tableName, meta));
						}}
					/>
				</Container>
			)}
		</React.Fragment>
	);
};

export default Users;
