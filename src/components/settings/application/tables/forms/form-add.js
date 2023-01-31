import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification, getForms } from '@reducers';
import { useNavigate, useParams } from 'react-router-dom';

const FormAdd = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const params = useParams();

	const { data } = useSelector((state) => state.auth);
	const { access_token } = data;

	const [ModalShow, setModalShow] = useState(false);
	const [formAdd, setformAdd] = useState('');

	const tableName = params.table;

	const addData = async () => {
		if (formAdd) {
			const url = `${process.env.API_URL}/form/${tableName}`;
			const config = {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({ name: formAdd })
			};

			await fetch(url, config)
				.then((response) => response.json())
				.then((response) => {
					const notification = {
						title: t('global:form-created.translation'),
						message: t('global:form-success.translation'),
						show: true,
						type: 'success'
					};

					if (!response.success) {
						notification.message = t('global:form-failure.translation');
						notification.type = 'danger';
					} else {
						const { form_id } = response.data[0];
						dispatch(getForms(tableName));
						navigate(`/settings/application/tables/${tableName}/forms/${form_id}/edit`);
					}

					setformAdd('');
					setModalShow(false);
					dispatch(showNotification(notification));

					return true;
				});
		}
	};

	return (
		<React.Fragment>
			<Button
				data-test-id="new"
				size="sm"
				className="tango-green-button"
				onClick={() => {
					setModalShow(true);
				}}
			>
				+ {t('global:new.translation')}
			</Button>
			<Modal
				size="md"
				centered
				show={ModalShow}
				onHide={() => {
					setModalShow(false);
				}}
			>
				<Modal.Header closeButton style={{ borderBottom: '0 none' }}>
					<Modal.Title
						id="contained-modal-title-vcenter"
						className="text-capitalize"
						style={{ color: 'var(--tango-color-pink' }}
					>
						{t('global:create-new-form.translation')}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group as={Row} className="mb-3">
						<Form.Label column sm="12" style={{ fontSize: '.9rem', color: 'var(--tango-color-gray)' }}>
							{t('global:form-name.translation')}
						</Form.Label>
						<Col sm="12">
							<Row>
								<Col sm={12} className="mb-3">
									<Form.Control
										value={formAdd}
										size="sm"
										onChange={(e) => setformAdd(e.target.value)}
										type="text"
										autoFocus={true}
									/>
								</Col>
								<Col sm={12}>
									<Button onClick={addData} className="me-2 tango-green-button">
										{t('global:save.translation')}
									</Button>
									<Button
										variant="light"
										style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
										size="sm"
										onClick={() => {
											setModalShow(false);
										}}
									>
										{t('global:cancel.translation')}
									</Button>
								</Col>
							</Row>
						</Col>
					</Form.Group>
				</Modal.Body>
			</Modal>
		</React.Fragment>
	);
};

export default FormAdd;
