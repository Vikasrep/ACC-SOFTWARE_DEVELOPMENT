import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Modal, CloseButton, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from '@reducers';
import { Icon } from '@components/core';

const DeleteField = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();

	const { access_token } = useSelector((state) => state.auth.data);
	const { field } = useSelector((state) => state);
	const { data } = field;

	const [modalShow, setModalShow] = useState(false);

	const paramsTable = params.table;
	const paramsId = params.id;

	return (
		<React.Fragment>
			<Button
				variant="link"
				size="sm"
				onClick={() => {
					setModalShow(true);
				}}
				style={{
					color: 'var(--tango-color-black)',
					textDecoration: 'none',
					padding: '5px 10px',
					fontSize: '14px'
				}}
			>
				<Icon name="close" style={{ color: 'var(--tango-color-error)', width: '1rem', marginRight: '5px' }} />
				{t('global:delete.translation')}
			</Button>
			<Modal size="md" centered data-test-id="new-role-modal" show={modalShow}>
				<Modal.Header style={{ borderBottom: '0 none' }}>
					<Modal.Title
						id="contained-modal-title-vcenter"
						className="text-capitalize"
						style={{ color: 'var(--tango-color-pink' }}
					>
						{t('global:delete-field.translation')}
					</Modal.Title>
					<CloseButton onClick={() => setModalShow(false)} />
				</Modal.Header>
				<Modal.Body>
					<Form.Label
						className="text-wrap"
						dangerouslySetInnerHTML={{
							__html: t('global:delete-field-confirmation.translation', { field: data?.label || '' })
						}}
					/>
					<Form.Label className="text-wrap">{t('global:delete-field-confirmation-note.translation')}</Form.Label>
					<Container fluid className="mt-2">
						<Button
							data-test-id="submit"
							size="sm"
							className="me-2 tango-green-button"
							onClick={() => {
								const url = `${process.env.API_URL}/v2/fields/${paramsTable}/${paramsId}`;
								const config = {
									method: 'DELETE',
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
											title: 'Field Type Deleted',
											message: 'Field deleted successfully.',
											show: true,
											type: 'success'
										};

										if (!response.success) {
											notification.message = response.message;
											notification.type = 'danger';
										}

										navigate(-1);
										dispatch(showNotification(notification));

										return true;
									});
							}}
						>
							{t('global:delete.translation')}
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

export default DeleteField;
