import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Container, Form } from 'react-bootstrap';
import { ConfirmPassword } from '@components/core';
import { onEnterClick } from '@utilities';

const ChangePassword = ({ error, onSave }) => {
	const refButton = useRef();
	const { t } = useTranslation();
	const [disabled, setDisabled] = useState(true);
	const [disablePassword, setDisablePassword] = useState(false);
	const [currentPassword, setCurrentPassword] = useState();
	const [password, setPassword] = useState();
	const [reset, setReset] = useState();

	// disable/enable save button
	useEffect(() => {
		if (currentPassword && password) setDisabled(false);
		else setDisabled(true);
	}, [currentPassword, password]);

	// set disabled
	useEffect(() => {
		if (error) {
			setDisabled(true);
			setDisablePassword(false);
		}
	}, [error]);

	return (
		<Container fluid data-test-id="change-password">
			<Form.Group data-test-id="current-password" controlId="current-password">
				<Form.Label>{t('global:current-password.translation')}</Form.Label>
				<Form.Control
					size="sm"
					key={reset}
					type="password"
					disabled={disablePassword}
					onChange={(event) => setCurrentPassword(event.currentTarget.value)}
					onKeyDown={(event) => onEnterClick(event, refButton.current)}
				/>
			</Form.Group>
			<ConfirmPassword key={reset} refButton={refButton} disabled={disablePassword} setPassword={setPassword} />

			<Button
				data-test-id="save"
				ref={refButton}
				className="my-3 tango-green-button px-3 py-1"
				size="sm"
				disabled={disabled}
				onClick={async () => {
					setDisabled(true);
					setDisablePassword(true);

					const result = await onSave(currentPassword, password);

					if (result) {
						setCurrentPassword();
						setReset(Math.random());
					}

					setDisablePassword(false);
				}}
			>
				{t('global:save.translation')}
			</Button>
		</Container>
	);
};

ChangePassword.propTypes = {
	className: PropTypes.string,
	error: PropTypes.bool,
	onSave: PropTypes.func.isRequired
};

export default ChangePassword;
