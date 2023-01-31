import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, Container, Form, Button } from 'react-bootstrap';
import { ConfirmPassword } from '@components/core';
import { queryParams } from '@utilities';

const ResetPassword = () => {
	const navigate = useNavigate();
	const refButton = useRef();
	const { t } = useTranslation();
	const [disabled, setdisabled] = useState(true);
	const [password, setPassword] = useState();
	const [showAlert, setShowAlert] = useState(false);

	// disable/enable button
	useEffect(() => {
		password ? setdisabled(false) : setdisabled(true);
	}, [password]);

	// add onclick to link
	useEffect(() => {
		if (showAlert) {
			const element = document.getElementById('link');

			if (element) element.onclick = () => navigate('login');
		}
	}, [navigate, showAlert]);

	return (
		<Container fluid data-test-id="reset-password">
			<Form.Group className="text-center">
				<Form.Label className="h2 fw-bold" style={{ color: 'var(--tango-color-pink)' }}>
					{t('global:reset-password.translation')}
				</Form.Label>
			</Form.Group>
			{showAlert ? (
				<Alert data-test-id="alert" variant="info" className="mt-3">
					<div
						dangerouslySetInnerHTML={{
							__html: t('global:reset-password-submit-info.translation').replace(
								'<a>',
								'<a id="link" href="javascript:void(0)">'
							)
						}}
					/>
				</Alert>
			) : (
				<React.Fragment>
					<ConfirmPassword refButton={refButton} setPassword={setPassword} />
					<Button
						data-test-id="submit"
						ref={refButton}
						disabled={disabled}
						className="tango-green-button mt-4 w-100"
						onClick={() => {
							setShowAlert(true);

							const token = queryParams('t');
							const payload = btoa(`${token}:${password}`);
							const url = `${process.env.API_URL}/reset-password`;
							const config = {
								method: 'POST',
								headers: {
									payload,
									isLoggedIn: false
								}
							};

							fetch(url, config);
						}}
					>
						{t('global:reset-password.translation')}
					</Button>
					<Container fluid className="d-flex justify-content-center mt-4">
						<Link to="/login" className="small" style={{ color: 'var(--tango-color-gray)' }}>
							{t('global:back-to-login.translation')}
						</Link>
					</Container>
				</React.Fragment>
			)}
		</Container>
	);
};

export default ResetPassword;
