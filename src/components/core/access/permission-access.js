import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PermissionAccess = () => {
	const { t } = useTranslation();
	const { email1 } = useSelector((state) => state.auth.data);

	return (
		<React.Fragment>
			<Container className="d-flex flex-column align-items-center">
				<Row>
					<Col className="mt-5">
						<Form.Label className="h1 fw-bold mt-5 mb-4">{t('global:access-needed.translation')}</Form.Label>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Label className="mb-2 text-wrap text-center">{t('global:no-permission.translation')}</Form.Label>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Label className="mb-2 text-wrap text-center">{t('global:ask-app-manager.translation')}</Form.Label>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button size="sm" className="mb-2 tango-green-button" disabled>
							{t('global:contact-app-manager.translation')}
						</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<Form.Label
							className="text-wrap text-center"
							dangerouslySetInnerHTML={{ __html: t('global:signed-in-email.translation', { email: email1 }) }}
						/>
					</Col>
				</Row>
			</Container>
		</React.Fragment>
	);
};

export default PermissionAccess;
