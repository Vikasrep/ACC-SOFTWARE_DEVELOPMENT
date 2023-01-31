import React, { useRef, useState } from 'react';
import { Col, Form, Button, Modal, Container, CloseButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@components/core';

const ReportsDropdownToolbar = ({ search }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const params = useParams();

	const [modalShow, setModalShow] = useState(false);

	const tableName = params['*'].split('/')[0];
	const refSearchText = useRef();
	let timeout;

	return (
		<React.Fragment>
			{search && (
				<Col className="d-flex">
					<Form.Group data-test-id="search" className="d-flex">
						<Form.Control
							data-test-id="search-input"
							type="text"
							ref={refSearchText}
							defaultValue={search.text}
							size="sm"
							className="me-2"
							placeholder={t('global:search-reports-and-charts.translation')}
							onChange={(event) => {
								const text = event.currentTarget.value;

								if (timeout) window.clearTimeout(timeout);

								timeout = window.setTimeout(() => {
									search.func(text);
								}, 500);
							}}
						/>
					</Form.Group>
					<Button
						data-test-id="new"
						size="sm"
						onClick={() => {
							setModalShow(true);
						}}
						title="New report or chart"
					>
						+ {t('global:new.translation')}
					</Button>
					<Modal size="lg" centered data-test-id="add-report-modal" show={modalShow}>
						<Modal.Header style={{ borderBottom: '0 none' }}>
							<Modal.Title style={{ color: 'var(--tango-color-pink' }}>
								{t('global:new.translation')} {t('global:report-or-chart.translation')}
							</Modal.Title>
							<CloseButton onClick={() => setModalShow(false)} />
						</Modal.Header>
						<Modal.Body>
							<Form.Check>
								<Form.Check.Input type="radio" name="radio" defaultChecked />
								<Icon name="tables" style={{ color: 'var(--tango-color-gray)' }} />
								<Form.Check.Label className="fw-bold ms-1" style={{ color: 'var(--tango-color-gray)' }}>
									{t('global:table.translation')}
								</Form.Check.Label>
								<Container>
									<Form.Check.Label className="small" style={{ color: 'var(--tango-color-gray)' }}>
										{t('global:new-table-option.translation')}
									</Form.Check.Label>
								</Container>
							</Form.Check>
						</Modal.Body>
						<Modal.Footer className="justify-content-start">
							<Button
								data-test-id="submit"
								className="me-2 tango-green-button"
								size="sm"
								onClick={() => {
									navigate(`/settings/application/tables/${tableName}/reports/new`);
								}}
							>
								{t('global:create.translation')}
							</Button>
							<Button
								variant="light"
								size="sm"
								onClick={() => setModalShow(false)}
								style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
							>
								{t('global:cancel.translation')}
							</Button>
						</Modal.Footer>
					</Modal>
				</Col>
			)}
		</React.Fragment>
	);
};

ReportsDropdownToolbar.propTypes = {
	search: PropTypes.shape({
		text: PropTypes.string,
		func: PropTypes.func.isRequired
	})
};

export default ReportsDropdownToolbar;
