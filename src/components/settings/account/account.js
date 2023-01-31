import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification, UserProfileUpdate } from '@reducers';
import { Container, Form, Button, Tab, Row, Nav, Col, Card } from 'react-bootstrap';
import { PageHeader, Icon, UserDropDown } from '@components/core';
import ChangePassword from './change-password';
import { headerLabel } from '@utilities';

const Account = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { data } = useSelector((state) => state.auth);
	const { email1, first_name, last_name, user_id, access_token } = data;

	const [userDetails, setUserDetails] = useState({ first_name, last_name, user_id });

	const handleChange = (e) => {
		if (e.target.value) {
			setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		}
	};

	const changeSave = () => {
		dispatch(UserProfileUpdate(userDetails));
	};

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			<Container fluid data-test-id="account">
				<Tab.Container id="left-tabs-example" defaultActiveKey="first">
					<Row className="d-flex justify-content-center tab-container" style={{ marginTop: '3rem' }}>
						<Col md={12} xl={3} className="p-2">
							<Card className="h-100 w-100" style={{ borderRadius: '15px' }}>
								<Card.Body>
									<Nav variant="pills" className="flex-column">
										<Container className="d-flex justify-content-center align-items-center flex-column my-4">
											<Icon
												name="account-circle"
												style={{ fontSize: '50px', color: 'var(--tango-color-lighter-green)', marginBottom: '.25rem' }}
											/>
											<Form.Label style={{ fontSize: '22px', marginBottom: '.25rem' }}>
												{first_name} {last_name}
											</Form.Label>
											<Form.Label style={{ color: 'var(--tango-color-gray)', fontSize: 'small' }}>{email1}</Form.Label>
										</Container>
										<Nav.Item
											style={{
												cursor: 'pointer',
												fontSize: '14px'
											}}
										>
											<Nav.Link eventKey="first" className="mb-2">
												<Icon name="account" style={{ fontSize: '20px', marginRight: '.5rem' }} />{' '}
												{t('global:account.translation')}
											</Nav.Link>
										</Nav.Item>
										<Nav.Item
											style={{
												cursor: 'pointer',
												fontSize: '14px'
											}}
										>
											<Nav.Link eventKey="second">
												<Icon name="Lock" style={{ fontSize: '20px', marginRight: '.5rem' }} />{' '}
												{t('global:password.translation')}
											</Nav.Link>
										</Nav.Item>
									</Nav>
								</Card.Body>
							</Card>
						</Col>
						<Col md={12} xl={8} className="p-2">
							<Card className="h-100 w-100" style={{ borderRadius: '15px' }}>
								<Card.Body>
									<Tab.Content className="px-4">
										<Tab.Pane eventKey="first">
											<Container fluid data-test-id="user">
												<Container fluid className="d-flex flex-column my-4">
													<Form.Label style={{ fontSize: '20px', marginBottom: '.25rem' }}>
														{t('global:account-info.translation')}
													</Form.Label>
													<Form.Label style={{ color: 'var(--tango-color-gray', fontSize: 'small' }}>
														{t('global:update-account-info.translation')}
													</Form.Label>
												</Container>
												<Row>
													<Col>
														<Form.Group data-test-id="first-name" controlId="first_name" className="mt-3">
															<Form.Label>{headerLabel('first_name')}</Form.Label>
															<Form.Control
																size="sm"
																type="text"
																defaultValue={first_name}
																isInvalid={false}
																name="first_name"
																onChange={handleChange}
															/>
															<Form.Control.Feedback type="invalid">
																{t('global:required.translation')}
															</Form.Control.Feedback>
														</Form.Group>
													</Col>
													<Col>
														<Form.Group data-test-id="last-name" controlId="last_name" className="mt-3">
															<Form.Label>{headerLabel('last_name')}</Form.Label>
															<Form.Control
																size="sm"
																type="text"
																defaultValue={last_name}
																isInvalid={false}
																name="last_name"
																onChange={handleChange}
															/>
															<Form.Control.Feedback type="invalid">
																{t('global:required.translation')}
															</Form.Control.Feedback>
														</Form.Group>
													</Col>
												</Row>
												<Form.Group data-test-id="email" controlId="email" className="mt-3">
													<Form.Label>{headerLabel('email')}</Form.Label>
													<Form.Control
														size="sm"
														type="text"
														defaultValue={email1}
														disabled={true}
														isInvalid={false}
														onChange={(event) => event.currentTarget.value}
													/>
													<Form.Control.Feedback type="invalid">
														{t('global:required.translation')}
													</Form.Control.Feedback>
												</Form.Group>
												<Button
													size="sm"
													data-test-id="submit"
													onClick={changeSave}
													className="my-3 tango-green-button px-3 py-1"
												>
													{t('global:save.translation')}
												</Button>
											</Container>
										</Tab.Pane>
										<Tab.Pane eventKey="second">
											<Container fluid className="d-flex flex-column my-4">
												<Form.Label style={{ fontSize: '20px', marginBottom: '.25rem' }}>
													{t('global:password.translation')}
												</Form.Label>
												<Form.Label
													style={{
														color: 'var(--tango-color-gray',
														fontSize: 'small',
														marginBottom: '.5rem'
													}}
												>
													{t('global:update-password.translation')}
												</Form.Label>
											</Container>
											<ChangePassword
												className="mt-5"
												onSave={(oldPassword, newPassword) => {
													const payload = btoa(`${user_id}:${oldPassword}:${newPassword}`);
													const url = `${process.env.API_URL}/reset-password`;
													const config = {
														method: 'POST',
														headers: {
															isLoggedIn: true,
															payload,
															authorization: `Bearer ${access_token}`
														}
													};

													return fetch(url, config).then((response) => {
														const notification = {
															title: 'Change Password',
															message: 'Password changed successfully.',
															show: true,
															type: 'success'
														};

														if (!response.ok) {
															notification.message = 'Password change failed. Please try again.';
															notification.type = 'danger';
														}

														dispatch(showNotification(notification));

														return response.ok;
													});
												}}
											/>
										</Tab.Pane>
									</Tab.Content>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Tab.Container>
			</Container>
		</React.Fragment>
	);
};

export default Account;
