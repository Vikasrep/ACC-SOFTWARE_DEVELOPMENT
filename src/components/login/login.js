import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@reducers';
import { useTranslation } from 'react-i18next';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { onEnterClick } from '@utilities';
import { Icon } from '@components/core';

const Login = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { success } = useSelector((state) => state.auth);

	const [isInvalid, setIsInvalid] = useState(success);
	const [username, setUsername] = useState();
	const [password, setPassword] = useState();
	const [disabled, setDisabled] = useState(false);
	//const [showPassword, setShowPassword] = useState(false);

	const refButton = useRef();

	useEffect(() => {
		if (success) {
			navigate('dashboard');
		} else if (success === false) {
			setIsInvalid(true);
			setDisabled(false);
		}
	}, [success, navigate]);

	return (
		<Container fluid data-test-id="login">
			<Form.Group className="text-center">
				<Form.Label className="h3 fw-bold" style={{ color: 'var(--tango-color-pink)' }}>
					{t('global:welcome.translation')}
				</Form.Label>
			</Form.Group>
			<Form.Group data-test-id="username" controlId="username" className="mt-3">
				<Form.Label>{t('global:username.translation')}</Form.Label>
				<Col className="position-relative">
					<Icon
						className="envelopIcon"
						name={'EmailAtRate'}
						style={{
							color: 'var(--tango-color-gray)',
							top: '10px',
							left: '10px',
							position: 'absolute',
							fontSize: '17px'
						}}
					/>
					<Form.Control
						size="sm"
						type="text"
						style={{ padding: '0.375rem 2.5rem' }}
						isInvalid={isInvalid}
						onChange={(event) => {
							setIsInvalid(false);
							setUsername(event.currentTarget.value);
						}}
						onKeyDown={(event) => onEnterClick(event, refButton.current)}
					/>
					<Form.Control.Feedback type="invalid">{t('global:invalid-username.translation')}</Form.Control.Feedback>
				</Col>
			</Form.Group>

			<Form.Group data-test-id="password" controlId="password" className="mt-3">
				<Form.Label>{t('global:password.translation')}</Form.Label>
				<Col className="position-relative">
					<Icon
						name={'Lock'}
						style={{
							color: 'var(--tango-color-gray)',
							top: '10px',
							left: '10px',
							position: 'absolute',
							fontSize: '17px'
						}}
					/>
					<Form.Control
						size="sm"
						type="password"
						style={{ padding: '0.375rem 2.5rem' }}
						isInvalid={isInvalid}
						onChange={(event) => {
							setIsInvalid(false);
							setPassword(event.currentTarget.value);
						}}
						onKeyDown={(event) => onEnterClick(event, refButton.current)}
					/>
					<Form.Control.Feedback type="invalid">{t('global:invalid-password.translation')}</Form.Control.Feedback>
					{/* <Icon
						className="hari"
						name={'VisibilityOff'}
						style={{ color: 'var(--tango-color-gray)', right: '10px', left: 'auto' }}
						onClick={() => setShowPassword(!showPassword)}
					/> */}
				</Col>
			</Form.Group>
			<Button
				data-test-id="submit"
				ref={refButton}
				className="tango-green-button mt-4 w-100"
				disabled={disabled}
				onClick={() => {
					if (username && password) {
						setDisabled(true);
						setIsInvalid(false);
						dispatch(login(username, password));
					} else setIsInvalid(true);
				}}
			>
				{t('global:log-in.translation')}
			</Button>
			<Container fluid data-test-id="forgot-password" className="d-flex justify-content-center mt-4">
				<Link
					to="/password/forgot"
					className="small"
					style={{
						color: 'var(--tango-color-gray)'
					}}
				>
					{t('global:forgot-password.translation')}
				</Link>
			</Container>
		</Container>
	);
};

export default Login;
