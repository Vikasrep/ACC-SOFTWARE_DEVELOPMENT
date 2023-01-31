import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTangoFields, getTablePermissions, updateTablePermission, showNotification } from '@reducers';
import { Container } from 'react-bootstrap';
import { PageHeader, DataTable, Loader, UserDropDown } from '@components/core';

const Access = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();

	const { tablePermissions, fields } = useSelector((state) => state);

	const [isLoading, setIsLoading] = useState(true);
	const [columns, setColumns] = useState();
	const [rows, setRows] = useState();

	const tableName = params.table;

	// fetch table & fields
	useEffect(() => {
		dispatch(getTablePermissions(tableName));
		dispatch(getTangoFields('vuser_role_permissions_test'));
	}, [dispatch, tableName]);

	//set columns
	useEffect(() => {
		if (fields.data && tablePermissions.data) {
			if (tablePermissions.data.length === 0) {
				setColumns([]);
			} else {
				const keys = Object.keys(tablePermissions.data[0]);
				const cols = keys
					.filter(
						(key) =>
							[
								'_rid_',
								'table',
								'id',
								'is_active',
								'date_created',
								'created_by',
								'date_modified',
								'modified_by',
								'fields',
								'edit_field_properties',
								'save_common_reports'
							].indexOf(key) === -1
					)
					.map((key) => {
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
	}, [fields.data, tablePermissions]);

	// set rows
	useEffect(() => {
		if (tablePermissions?.data) {
			const { data } = tablePermissions;
			setRows(data);
		}
	}, [tablePermissions]);

	// set is-loading
	useEffect(() => {
		if (columns && rows) setIsLoading(false);
	}, [columns, rows]);

	const handleChange = (row, status) => {
		if (
			status.column.name === 'View' ||
			status.column.name === 'Modify' ||
			status.column.name === 'Add' ||
			status.column.name === 'Delete'
		) {
			let { role_id, table, view, modify, add, role_name, delete_records } = row[status.indexes[0]];

			dispatch(
				updateTablePermission({
					role_id: role_id,
					table: table,
					add: add,
					view: view,
					modify: modify,
					delete_records: delete_records,
					is_active: true
				})
			).then((res) => {
				const notification = {
					title: `${role_name} Update`,
					message: `${status.column.name} Updated`,
					show: true,
					type: 'success'
				};
				if (!res.success) {
					notification.message = 'Update failed. Please try again.';
					notification.type = 'danger';
				}
				dispatch(showNotification(notification));
				dispatch(getTablePermissions(tableName));
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
					{tablePermissions.action === 'tablePermissions/fetching' && <Loader />}
					<DataTable
						style={{
							height: '68vh',
							boxShadow: '2px 4px 8px 1px rgba(0, 0, 0, 0.14)',
							borderRadius: '10px',
							border: '1px solid #DFDFDF'
						}}
						columns={columns}
						rows={rows}
						onRowsChange={handleChange}
						columnActions={[
							{
								id: 'view',
								action: (row) => {
									navigate(`/settings/application/roles/${row.role_id}/view`);
								}
							}
						]}
						columnOptions={{
							resizable: true,
							sortable: false,
							disabled: true
						}}
					/>
				</Container>
			)}
		</React.Fragment>
	);
};

export default Access;
