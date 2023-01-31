import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Modal, CloseButton, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from '@reducers';

const AddRole = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();

	const { access_token } = useSelector((state) => state.auth.data);

	const [modalShow, setModalShow] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isInvalid, setIsInvalid] = useState(false);

	const paramsTable = params['*'].split('/')[0];

	return (
		<React.Fragment>
			<Button
				data-test-id="new"
				onClick={() => {
					setModalShow(true);
				}}
				title="New role"
				className="text-capitalize tango-green-button"
			>
				+ {t('global:new.translation')} {paramsTable.slice(0, -1)}
			</Button>
			<Modal size="md" centered data-test-id="new-role-modal" show={modalShow}>
				<Modal.Header style={{ borderBottom: '0 none' }}>
					<Modal.Title
						id="contained-modal-title-vcenter"
						className="text-capitalize"
						style={{ color: 'var(--tango-color-pink' }}
					>
						{t('global:create-new-role.translation')}
					</Modal.Title>
					<CloseButton onClick={() => setModalShow(false)} />
				</Modal.Header>
				<Modal.Body>
					<Form.Group data-test-id="role-name" controlId="role-name">
						<Form.Label style={{ fontSize: '.9rem', color: 'var(--tango-color-gray)' }}>
							{t('global:role-name.translation')}
						</Form.Label>
						<Form.Control
							type="text"
							size="sm"
							isInvalid={isInvalid}
							onChange={(event) => {
								setIsInvalid(false);
								setName(event.currentTarget.value);
							}}
						/>
						<Form.Control.Feedback type="invalid">{t('global:enter-role.translation')}</Form.Control.Feedback>
					</Form.Group>
					<Form.Group data-test-id="description" controlId="description" className="mt-3">
						<Form.Label style={{ fontSize: '.9rem', color: 'var(--tango-color-gray)' }}>
							{t('global:description.translation')}
						</Form.Label>
						<Form.Control
							as="textarea"
							rows="3"
							size="sm"
							onChange={(event) => {
								setDescription(event.currentTarget.value);
							}}
						/>
					</Form.Group>
					<Container fluid className="mt-2">
						<Button
							data-test-id="submit"
							size="sm"
							className="me-2 tango-green-button"
							onClick={() => {
								if (name) {
									const url = `${process.env.API_URL}/user-role`;
									const config = {
										method: 'POST',
										headers: {
											Accept: 'application/json',
											'Content-Type': 'application/json',
											authorization: `Bearer ${access_token}`
										},
										body: JSON.stringify({
											role_name: name,
											description: description
										})
									};

									return fetch(url, config)
										.then((response) => response.json())
										.then((response) => {
											const notification = {
												title: 'New Role',
												message: 'Role created successfully.',
												show: true,
												type: 'success'
											};

											if (!response.success) {
												notification.message = response.message;
												notification.type = 'danger';
											} else {
												const { role_id } = response.data[0];
												navigate(`/settings/application/roles/${role_id}/view`);
											}

											setModalShow(false);
											dispatch(showNotification(notification));

											return true;
										});
								} else {
									setIsInvalid(true);
								}
							}}
						>
							{t('global:ok.translation')}
						</Button>
						<Button
							variant="light"
							size="sm"
							onClick={() => setModalShow(false)}
							style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
						>
							{t('global:cancel.translation')}
						</Button>
					</Container>
				</Modal.Body>
			</Modal>
		</React.Fragment>
	);
};

export default AddRole;
