import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Form } from 'react-bootstrap';

const NoRecordFound = () => {
	const { t } = useTranslation();

	return (
		<Container fluid data-test-id="no-record-found" className="d-flex justify-content-center">
			<Form.Label className="fw-bold">{t('global:no-record-found.translation')}</Form.Label>
		</Container>
	);
};

export default NoRecordFound;
