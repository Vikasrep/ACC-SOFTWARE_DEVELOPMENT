import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPermissions, getTangoFields, getTable } from '@reducers';
import { Container, Tabs, Tab, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, DataTable, Loader, Breadcrumb } from '@components/core';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@reducers';

const UserRolePermissions = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(true);
	const [breadcrumb, setBreadcrumb] = useState();
	const [columns, setColumns] = useState();
	const [rows, setRows] = useState();
	const [isInvalid, setIsInvalid] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState();
	const [disabled, setDisabled] = useState(false);

	const { access_token } = useSelector((state) => state.auth.data);
	const { permissions, fields, table } = useSelector((state) => state);
	const { data } = table;

	const tableName = 'user-roles';
	const paramsId = params.id;
	const basePath = '/settings/application/roles';

	// fetch permissions & fields
	useEffect(() => {
		dispatch(getTable('user-role', paramsId));
		dispatch(getPermissions(tableName, paramsId));
		dispatch(getTangoFields('user_role_permissions'));
	}, [dispatch, tableName, paramsId]);

	//set columns
	useEffect(() => {
		if (fields.data && permissions.data) {
			if (permissions.data.length === 0) {
				setColumns([]);
			} else {
				const keys = Object.keys(permissions.data[0]);
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
	}, [fields.data, permissions.data]);

	// set rows, metadata, pagination, sort-columns
	useEffect(() => {
		if (permissions.data) {
			const { data } = permissions;
			setRows(data);
		}
	}, [permissions]);

	// set is-loading
	useEffect(() => {
		if (
			table.action === 'table/fetched' &&
			fields.action === 'fields/fetched' &&
			permissions.action === 'permissions/fetched' &&
			columns &&
			rows
		) {
			setIsLoading(false);
		}
		const path = `${basePath}/${data?.role_name}`;

		setBreadcrumb(path);
	}, [columns, table, fields, permissions, rows, basePath, paramsId, data]);

	return (
		<React.Fragment>
			<PageHeader breadcrumb={<Breadcrumb path={breadcrumb || basePath} />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id={tableName}>
					<Tabs defaultActiveKey="permissions" id="uncontrolled-tab-example" className="mb-3">
						<Tab eventKey="permissions" title="Permissions">
							<DataTable
								style={{
									height: '68vh',
									boxShadow: '2px 4px 8px 1px rgba(0, 0, 0, 0.14)',
									borderRadius: '10px',
									border: '1px solid #DFDFDF'
								}}
								toolbar={{
									title: t('global:user-role-permissions.translation')
								}}
								columns={columns}
								rows={rows}
								columnActions={[
									{
										id: 'view',
										action: (row) => {
											navigate(`/settings/application/tables/${row.table.replaceAll(' ', '_').toLowerCase()}/access`);
										}
									}
								]}
								columnOptions={{
									resizable: true,
									sortable: false,
									disabled: true
								}}
							/>
						</Tab>
						<Tab eventKey="properties" title="Properties">
							<Container fluid>
								<Form.Group data-test-id="role-name" controlId="role-name">
									<Form.Label style={{ fontSize: '.8rem', fontWeight: 'bolder' }}>
										{t('global:role-name.translation')}
									</Form.Label>
									<Form.Control
										type="text"
										size="sm"
										isInvalid={isInvalid}
										defaultValue={data.role_name}
										onChange={(e) => {
											setName(e.target.value);
											setIsInvalid(false);
										}}
									/>
									<Form.Control.Feedback type="invalid">{t('global:enter-role.translation')}</Form.Control.Feedback>
								</Form.Group>

								<Form.Group data-test-id="description" controlId="description" className="mt-3">
									<Form.Label className="fw-bold" style={{ fontSize: '.8rem', fontWeight: 'bolder' }}>
										{t('global:description.translation')}
									</Form.Label>
									<Form.Control
										as="textarea"
										rows="3"
										size="sm"
										defaultValue={data.description}
										onChange={(e) => setDescription(e.target.value)}
									/>
								</Form.Group>
								<Container fluid className="mt-2">
									<Button
										data-test-id="save"
										className="me-2 tango-green-button"
										size="sm"
										disabled={disabled}
										onClick={() => {
											if (data) {
												setDisabled(true);

												const url = `${process.env.API_URL}/user-role`;
												const config = {
													method: 'PATCH',
													headers: {
														Accept: 'application/json',
														'Content-Type': 'application/json',
														authorization: `Bearer ${access_token}`
													},
													body: JSON.stringify({
														role_id: data.role_id,
														role_name: name,
														description: description
													})
												};
												return fetch(url, config)
													.then((response) => response.json())
													.then((response) => {
														const notification = {
															title: 'Edit Role',
															message: 'Role updated successfully.',
															show: true,
															type: 'success'
														};

														if (!response.success) {
															notification.message = response.message;
															notification.type = 'danger';
															setDisabled(false);
														} else {
															setDisabled(false);
														}

														dispatch(showNotification(notification));

														return true;
													});
											} else {
												setIsInvalid(true);
											}
										}}
									>
										{t('global:save.translation')}
									</Button>
									<Button
										data-test-id="cancel"
										variant="light"
										style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
										className="me-2"
										size="sm"
										onClick={() => {
											navigate(-1);
										}}
									>
										{t('global:cancel.translation')}
									</Button>
								</Container>
							</Container>
						</Tab>
					</Tabs>
				</Container>
			)}
		</React.Fragment>
	);
};

export default UserRolePermissions;
