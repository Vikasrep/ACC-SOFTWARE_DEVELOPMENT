import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import validator from 'validator';
import { onEnterClick } from '@utilities';

const ForgotPassword = () => {
	const refButton = useRef();
	const { t } = useTranslation();
	const [isInvalid, setIsInvalid] = useState(false);
	const [email, setEmail] = useState();
	const [showAlert, setShowAlert] = useState(false);
	const [reset, setReset] = useState();

	return (
		<Container fluid data-test-id="forgot-password">
			<Form.Group className="text-center">
				<Form.Label className="h3 fw-bold" style={{ color: 'var(--tango-color-pink)' }}>
					{t('global:forgot-password.translation')}
				</Form.Label>
			</Form.Group>
			<Form.Group className="text-center mt-3">
				<Form.Label className="small text-wrap">{t('global:email-reset.translation')}</Form.Label>
			</Form.Group>
			{showAlert && (
				<Alert data-test-id="alert" variant="info" className="mt-3">
					{t('global:forgot-password-submit-info.translation')}
				</Alert>
			)}
			<Form.Group data-test-id="email" controlId="email" className="mt-3">
				<Form.Label>{t('global:email-address.translation')}</Form.Label>
				<Form.Control
					size="sm"
					key={reset}
					type="email"
					isInvalid={isInvalid}
					onChange={(event) => {
						setIsInvalid(false);
						setShowAlert(false);
						setEmail(event.currentTarget.value);
					}}
					onKeyDown={(event) => onEnterClick(event, refButton.current)}
				/>
				<Form.Control.Feedback type="invalid">{t('global:invalid-email.translation')}</Form.Control.Feedback>
			</Form.Group>
			<Button
				data-test-id="submit"
				ref={refButton}
				className="tango-green-button mt-4 w-100"
				onClick={() => {
					if (email && validator.isEmail(email)) {
						const url = `${process.env.API_URL}/forgot-password`;
						const config = {
							method: 'POST',
							headers: {
								email
							}
						};

						setReset(Math.random());
						setIsInvalid(false);
						setShowAlert(true);
						fetch(url, config);
					} else {
						setShowAlert(false);
						setIsInvalid(true);
					}
				}}
			>
				{t('global:send.translation')}
			</Button>
			<Container fluid className="d-flex justify-content-center mt-4">
				<Link to="/login" className="small" style={{ color: 'var(--tango-color-gray)' }}>
					{t('global:back-to-login.translation')}
				</Link>
			</Container>
		</Container>
	);
};

export default ForgotPassword;
