import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Modal, Row, CloseButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getFieldTypes, showNotification, getFieldsTable } from '@reducers';

const AddField = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const params = useParams();

	const fieldTypes = useSelector((state) => state.fieldTypes);
	const { access_token } = useSelector((state) => state.auth.data);
	const { data } = fieldTypes;

	const [modalShow, setModalShow] = useState(false);
	const [label, setLabel] = useState('');
	const [type, setType] = useState('');
	const [isInvalid, setIsInvalid] = useState(false);

	const paramsTable = params['*'].split('/')[0];

	useEffect(() => {
		dispatch(getFieldTypes());
	}, [dispatch]);

	return (
		<React.Fragment>
			<Button
				data-test-id="new"
				size="sm"
				onClick={() => {
					setModalShow(true);
				}}
				title="New field"
				className="text-capitalize tango-green-button"
			>
				+ {t('global:new.translation')}
			</Button>
			<Modal aria-labelledby="contained-modal-title-vcenter" centered show={modalShow} size="md">
				<Modal.Header style={{ borderBottom: '0 none' }}>
					<Modal.Title className="text-capitalize" style={{ color: 'var(--tango-color-pink' }}>
						{t('global:add-new-fields.translation')}
					</Modal.Title>
					<CloseButton onClick={() => setModalShow(false)} />
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col>
							<Form.Group data-test-id="field-label" controlId="field-label">
								<Form.Label style={{ fontSize: '.9rem', color: 'var(--tango-color-gray)' }}>
									{t('global:field-label.translation')}
								</Form.Label>
								<Form.Control
									type="text"
									size="sm"
									isInvalid={isInvalid}
									name="label"
									onChange={(e) => {
										setIsInvalid(false);
										setLabel(e.currentTarget.value);
									}}
								/>
								<Form.Control.Feedback type="invalid">{t('global:required.translation')}</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group data-test-id="type" controlId="type">
								<Form.Label style={{ fontSize: '.9rem', color: 'var(--tango-color-gray)' }}>
									{t('global:type.translation')}
								</Form.Label>
								<Form.Select
									size="sm"
									isInvalid={isInvalid}
									name="type"
									onChange={(e) => {
										setType(e.currentTarget.value);
										setIsInvalid(false);
									}}
								>
									<option value="0">{t('global:select-type.translation')}</option>
									{data &&
										data.map((type, index) => (
											<option key={index} value={type.property_name}>
												{type.display_name}
											</option>
										))}
								</Form.Select>
								<Form.Control.Feedback type="invalid">{t('global:required.translation')}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Container fluid className="mt-3">
						<Button
							data-test-id="submit"
							size="md"
							className="me-2 tango-green-button"
							onClick={() => {
								if (label && type) {
									const url = `${process.env.API_URL}/v2/fields/${paramsTable}`;
									const config = {
										method: 'POST',
										headers: {
											Accept: 'application/json',
											'Content-Type': 'application/json',
											authorization: `Bearer ${access_token}`
										},
										body: JSON.stringify({
											label: label,
											field_type: type
										})
									};

									return fetch(url, config)
										.then((response) => response.json())
										.then((response) => {
											const notification = {
												title: 'New Field',
												message: 'Field created successfully.',
												show: true,
												type: 'success'
											};

											if (!response.success) {
												notification.message = response.message;
												notification.type = 'danger';
											}

											setModalShow(false);
											dispatch(getFieldsTable(paramsTable));
											dispatch(showNotification(notification));

											return true;
										});
								} else {
									setIsInvalid(true);
								}
							}}
						>
							{t('global:add.translation')}
						</Button>
						<Button
							variant="light"
							size="md"
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

export default AddField;
