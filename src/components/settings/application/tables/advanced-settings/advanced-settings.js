import React from 'react';
import { Form, Card, Col, Container, Button, Row } from 'react-bootstrap';
import { CardHeader, PageHeader, UserDropDown } from '@components/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AdvancedSettings = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const xs = 2;

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			<Container fluid>
				<Container fluid className="d-flex justify-content-end mb-2">
					<Button data-test-id="save" size="sm" disabled className="tango-green-button me-2">
						{t('global:save.translation')}
					</Button>
					<Button
						data-test-id="cancel"
						size="sm"
						variant="light"
						style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
						className="me-2"
						onClick={() => {
							navigate(-1);
						}}
					>
						{t('global:cancel.translation')}
					</Button>
				</Container>
				<Card style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}>
					<CardHeader label={t('global:table-record-names.translation')} />
					<Card.Body>
						<Form.Group className="mt-3 d-flex align-items-center">
							<Col xs={xs} className="d-flex align-items-center">
								<Form.Label className="me-2 text-wrap d-inline-block">{t('global:table-name.translation')}</Form.Label>
							</Col>
							<Col>
								<Form.Control className="text-wrap" />
							</Col>
						</Form.Group>
						<Form.Group className="mt-3 d-flex align-items-center">
							<Col xs={xs} className="d-flex align-items-center">
								<Form.Label className="me-2 text-wrap d-inline-block">
									{t('global:records-in-this-table.translation')}
								</Form.Label>
							</Col>
							<Col>
								<Form.Control className="text-wrap" />
							</Col>
						</Form.Group>
						<Form.Group className="mt-3 d-flex align-items-center">
							<Col xs={xs} className="d-flex align-items-center">
								<Form.Label className="me-2 text-wrap d-inline-block">
									{t('global:single-record-called.translation')}
								</Form.Label>
							</Col>
							<Col>
								<Form.Control className="text-wrap" />
							</Col>
						</Form.Group>
						<Form.Group className="mt-3 d-flex align-items-center">
							<Col xs={xs} className="d-flex align-items-center">
								<Form.Label className="me-2 text-wrap d-inline-block">{t('global:description.translation')}</Form.Label>
							</Col>
							<Col>
								<Form.Control as="textarea" rows={4} />
							</Col>
						</Form.Group>
					</Card.Body>
				</Card>
				<Card className="mt-4" style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}>
					<CardHeader label={t('global:identifying-records.translation')} />
					<Card.Body>
						<Col>
							<Col className="d-flex flex-column">
								<Form.Label className="text-wrap mb-1">{t('global:default-record-picker.translation')}</Form.Label>
								<Form.Label className="text-wrap small mb-2">
									{t('global:default-record-picker-note.translation')}
								</Form.Label>
							</Col>
							<Row>
								<Col>
									<Form.Select>
										<option value="">{t('global:select-a-field.translation')}</option>
									</Form.Select>
								</Col>
								<Col>
									<Form.Select>
										<option value="">{t('global:select-a-field.translation')}</option>
									</Form.Select>
								</Col>
								<Col>
									<Form.Select>
										<option value="">{t('global:select-a-field.translation')}</option>
									</Form.Select>
								</Col>
							</Row>
						</Col>
					</Card.Body>
				</Card>
			</Container>
		</React.Fragment>
	);
};

export default AdvancedSettings;
