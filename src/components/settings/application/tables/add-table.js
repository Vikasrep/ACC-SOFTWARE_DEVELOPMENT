/* eslint-disable prefer-template */

import React, { useState } from 'react';
import { Container, Modal, CloseButton, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification, getAllTangoTables } from '@reducers';

const AddTable = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const { access_token } = useSelector((state) => state.auth.data);

	const [modalShow, setModalShow] = useState(false);
	const [name, setName] = useState('');
	const [isInvalid, setIsInvalid] = useState(false);

	return (
		<React.Fragment>
			<Button
				data-test-id="new"
				size="sm"
				onClick={() => {
					setModalShow(true);
				}}
				title="New table"
				className="text-capitalize tango-green-button"
			>
				+ {t('global:new.translation')}
			</Button>
			<Modal size="md" centered data-test-id="new-table-modal" show={modalShow}>
				<Modal.Header style={{ borderBottom: '0 none' }}>
					<Modal.Title
						id="contained-modal-title-vcenter"
						className="text-capitalize"
						style={{ color: 'var(--tango-color-pink' }}
					>
						{t('global:create-new-table.translation')}
					</Modal.Title>
					<CloseButton onClick={() => setModalShow(false)} />
				</Modal.Header>
				<Modal.Body>
					<Form.Group data-test-id="table-name" controlId="table-name">
						<Form.Label style={{ fontSize: '.9rem', color: 'var(--tango-color-gray)' }}>
							{t('global:table-name.translation')}
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
						<Form.Control.Feedback type="invalid">{t('global:required.translation')}</Form.Control.Feedback>
					</Form.Group>
					<Container fluid className="mt-2">
						<Button
							data-test-id="submit"
							size="md"
							className="me-2 tango-green-button"
							onClick={() => {
								if (name) {
									const url =
										`${process.env.API_URL}/table/create?` +
										new URLSearchParams({
											table_name: name
										});
									const config = {
										method: 'POST',
										headers: {
											Accept: 'application/json',
											'Content-Type': 'application/json',
											authorization: `Bearer ${access_token}`
										}
									};

									return fetch(url, config)
										.then((response) => response.json())
										.then((response) => {
											const notification = {
												title: 'New Table',
												message: 'Table created successfully.',
												show: true,
												type: 'success'
											};

											if (!response.success) {
												notification.message = response.message;
												notification.type = 'danger';
											}

											setModalShow(false);
											dispatch(showNotification(notification));
											dispatch(getAllTangoTables());

											return true;
										});
								} else {
									setIsInvalid(true);
								}
							}}
						>
							{t('global:create.translation')}
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

export default AddTable;
