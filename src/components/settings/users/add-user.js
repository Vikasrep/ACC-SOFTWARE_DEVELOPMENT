import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Form, InputGroup, Modal, Row, CloseButton } from 'react-bootstrap';
import { Icon } from '@components/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '@reducers';
import validator from 'validator';
import { useCallback } from 'react';
import { showNotification } from '@reducers';

const userList = [
	{
		email1: '',
		username: '',
		role_id: false,
		delete: false,
		random_id: Math.floor(Math.random() * 100000000000),
		is_active: true
	}
];

const addList = { email1: '', username: '', role_id: false, delete: true, is_active: true };
const InValidaObject = { index: '', valid: true, type: [] };

const AddUser = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const params = useParams();

	const roles = useSelector((state) => state.roles);
	const { access_token } = useSelector((state) => state.auth.data);

	const [list, setList] = useState(userList);
	const [modalShow, setModalShow] = useState(false);
	const [isInvalid, setIsInvalid] = useState(InValidaObject);

	const paramsTable = params['*'].split('/')[0];

	useEffect(() => {
		dispatch(getRoles('user-roles'));
	}, [dispatch]);

	useEffect(() => {
		setIsInvalid(InValidaObject);
		setList(userList);
	}, [modalShow]);

	const handleChange = () => {
		setList([...list, { ...addList, random_id: Math.floor(Math.random() * 100000000000) }]);
	};

	const removeUser = (random_id) => {
		const userListingArray = [...list];
		const finalArray = userListingArray.filter((data) => data.random_id !== random_id);
		setList(finalArray);
	};

	const SetInputData = useCallback(
		(e, index) => {
			const Name = e.target.name;
			const Value = e.target.value;
			const userListingArray = [...list];
			if (Name === 'email1') {
				userListingArray[index][Name] = Value;
				userListingArray[index]['username'] = Value;
			} else {
				userListingArray[index][Name] = Value;
			}
			setList(userListingArray);
		},
		[list]
	);

	return (
		<React.Fragment>
			<Button
				data-test-id="new"
				size="sm"
				onClick={() => {
					setModalShow(true);
				}}
				title="New user"
				className="text-capitalize tango-green-button"
			>
				+ {t('global:new.translation')} {paramsTable.slice(0, -1)}
			</Button>
			<Modal aria-labelledby="contained-modal-title-vcenter" centered show={modalShow} size="lg">
				<Modal.Header style={{ borderBottom: '0 none' }}>
					<Modal.Title className="text-capitalize" style={{ color: 'var(--tango-color-pink' }}>
						{t('global:add-new-user.translation')}
					</Modal.Title>
					<CloseButton onClick={() => setModalShow(false)} />
				</Modal.Header>
				<Modal.Body>
					<Container fluid>
						<Container fluid>
							{list.map((element, index) => (
								<Row key={element.random_id}>
									<Col>
										<Form.Label htmlFor="email" style={{ fontSize: '.9rem', color: 'var(--tango-color-gray)' }}>
											{t('global:enter-email-group.translation')}
										</Form.Label>
										<InputGroup className="mb-3">
											<InputGroup.Text>
												<Icon name="contact" style={{ fontSize: '15px' }} />
											</InputGroup.Text>
											<Form.Control
												size="sm"
												id="email"
												type="email"
												name="email1"
												isInvalid={isInvalid.index === element.random_id && isInvalid.type.includes('Email')}
												onChange={(event) => {
													setIsInvalid(false);
													SetInputData(event, index);
												}}
											/>
											<Form.Control.Feedback type="invalid">
												{t('global:invalid-email.translation')}
											</Form.Control.Feedback>
										</InputGroup>
									</Col>
									<Col>
										<Form.Label style={{ fontSize: '.9rem', color: 'var(--tango-color-gray)' }}>
											{t('global:roles.translation').slice(0, -1)}
										</Form.Label>
										<Form.Label className="text-danger">*</Form.Label>
										<Form.Select
											size="sm"
											isInvalid={isInvalid.index === element.random_id && isInvalid.type.includes('Role')}
											name="role_id"
											onChange={(event) => {
												setIsInvalid(false);
												SetInputData(event, index);
											}}
										>
											<option hidden value="">
												{t('global:select-role.translation')}
											</option>
											{roles.data && roles.data.length > 0 ? (
												roles.data.map((item) => (
													<option key={item.role_id} value={item.role_id}>
														{item.role_name}
													</option>
												))
											) : (
												<option value="">{t('global:role-not-found.translation')}</option>
											)}
										</Form.Select>
										<Form.Control.Feedback type="invalid">{t('global:choose-role.translation')}</Form.Control.Feedback>
									</Col>
									{element.delete && (
										<Col sm={1}>
											<Button
												size="sm"
												onClick={(e) => {
													e.preventDefault();
													removeUser(element.random_id);
												}}
												variant="danger"
											>
												<Icon name="close" />
											</Button>
										</Col>
									)}
								</Row>
							))}
						</Container>
						<Container>
							<Icon className="m-2" name="adduser" />
							<Button
								onClick={(e) => {
									e.preventDefault();
									handleChange();
								}}
								variant="link"
								style={{ color: 'var(--tango-color-light-green' }}
							>
								{t('global:add-multiple-users.translation')}
							</Button>
						</Container>
						<Container>
							<Form.Label className="text-wrap" style={{ fontSize: '.9rem', color: 'var(--tango-color-gray)' }}>
								{' '}
								{t('global:email-sent-to-user.translation')}{' '}
							</Form.Label>
						</Container>
					</Container>
				</Modal.Body>
				<Modal.Footer className="p-2 justify-content-start">
					<Button
						size="sm"
						className="tango-green-button"
						onClick={async () => {
							let data = true;
							for (let item of list) {
								if (!validator.isEmail(item.email1) || !item.role_id) {
									let type = [];
									if (!validator.isEmail(item.email1)) {
										type.push('Email');
									}
									if (!item.role_id) {
										type.push('Role');
									}
									setIsInvalid((prev) => ({ ...prev, index: item.random_id, valid: false, type }));
									data = false;
									break;
								}
							}
							if (data) {
								const url = `${process.env.API_URL}/users`;
								const config = {
									method: 'POST',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
										authorization: `Bearer ${access_token}`
									},
									body: JSON.stringify(list)
								};
								const url1 = `${process.env.API_URL}/setpassword`;
								return await fetch(url, config)
									.then((response) => response.json())
									.then(async (response) => {
										const notification = {
											title: 'New User',
											message: 'An email notification has been sent to the user.',
											show: true,
											type: 'success'
										};
										if (response.success) {
											for (let item of list) {
												const config1 = {
													method: 'POST',
													headers: {
														email: item.email1
													}
												};
												await fetch(url1, config1);
											}
										} else {
											notification.message = response.message;
											notification.type = 'danger';
										}
										setModalShow(false);
										dispatch(showNotification(notification));
										return true;
									});
							} else {
								return;
							}
						}}
					>
						{t('global:send.translation')}
					</Button>
					<Button
						size="sm"
						variant="light"
						onClick={() => setModalShow(false)}
						style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
					>
						{t('global:cancel.translation')}
					</Button>
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	);
};

export default AddUser;
