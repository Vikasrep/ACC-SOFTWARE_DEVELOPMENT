import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Container, Form } from 'react-bootstrap';
import { Check, Clear } from '@material-ui/icons';
import { onEnterClick } from '@utilities';

const ConfirmPassword = ({ disabled, refButton, setPassword }) => {
	const { t } = useTranslation();
	const [newIsInvalid, setNewIsInvalid] = useState(false);
	const [confirmIsInvalid, setConfirmIsInvalid] = useState(false);
	const [isSame, setIsSame] = useState(false);
	const [newPassword, setNewPassword] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [number, setNumber] = useState();
	const [upperCase, setUpperCase] = useState();
	const [lowerCase, setLowerCase] = useState();
	const [specialChar, setSpecialChar] = useState();
	const [charLength, setCharLength] = useState();
	const [showRequirements, setShowRequirements] = useState(false);
	const minLength = 8;

	// set is-same
	useEffect(() => {
		setIsSame(newPassword && newPassword === confirmPassword);

		if (newPassword && confirmPassword) setConfirmIsInvalid(newPassword !== confirmPassword);
	}, [newPassword, confirmPassword, isSame]);

	// requirements
	useEffect(() => {
		if (newPassword) {
			setUpperCase(/[A-Z]/g.test(newPassword));
			setLowerCase(newPassword && newPassword.toUpperCase() !== newPassword);
			setNumber(/[0-9]/g.test(newPassword));
			setSpecialChar(/[~`!#$%^&@()*+=\-\]\\';,._/{}|\\":<>]/g.test(newPassword));
			setCharLength(newPassword && newPassword.length >= minLength);
		} else {
			setUpperCase();
			setLowerCase();
			setNumber();
			setSpecialChar();
			setCharLength();
		}
	}, [newPassword]);

	// on-match
	useEffect(() => {
		if (newPassword && number && upperCase && lowerCase && specialChar && charLength) {
			setShowRequirements(false);
			setNewIsInvalid(false);

			isSame ? setPassword(newPassword) : setPassword();
		} else if (newPassword) {
			setPassword(false);
			setShowRequirements(true);
			setNewIsInvalid(true);
		}
	}, [newPassword, number, upperCase, lowerCase, specialChar, charLength, isSame, setPassword]);

	// // reset passwords
	// useEffect(() => {
	// 	if (reset) {
	// 		setNewPassword();
	// 		setConfirmPassword();
	// 		setShowRequirements(false);
	// 	}
	// }, [reset]);

	return (
		<Container fluid date-test-id="change-password">
			<Form.Group data-test-id="new-password" controlId="new-password" className="mt-3">
				<Form.Label>{t('global:new-password.translation')}</Form.Label>
				<Form.Control
					size="sm"
					type="password"
					disabled={disabled}
					isInvalid={newIsInvalid}
					onFocus={() => {
						!newPassword && setShowRequirements(true);
						!newPassword && setNewIsInvalid(true);
					}}
					onChange={(event) => setNewPassword(event.currentTarget.value)}
					onKeyDown={(event) => onEnterClick(event, refButton.current)}
				/>
				{showRequirements && (
					<Container fluid className="d-flex flex-column small mt-1">
						{[
							{ upperCase: upperCase },
							{ lowerCase: lowerCase },
							{ number: number },
							{ specialChar: specialChar },
							{ charLength: charLength }
						].map((item, index) => {
							const key = Object.keys(item)[0] || '';
							const value = Object.values(item)[0];
							const color = value ? 'var(--tango-color-success)' : 'var(--tango-color-error)';
							const icon = value ? <Check fontSize="small" /> : <Clear fontSize="small" />;

							return (
								<Container fluid key={index} className="d-flex" style={{ color }}>
									{icon}&nbsp;{t(`global:password-requirement-${key.toLowerCase()}.translation`, { x: 8 })}
								</Container>
							);
						})}
					</Container>
				)}
			</Form.Group>
			<Form.Group data-test-id="confirm-new-password" controlId="confirm-new-password" className="mt-3">
				<Form.Label>{t('global:confirm-new-password.translation')}</Form.Label>
				<Form.Control
					size="sm"
					type="password"
					disabled={disabled}
					isInvalid={confirmIsInvalid}
					onFocus={() => {
						!confirmPassword && setConfirmIsInvalid(true);
					}}
					onChange={(event) => setConfirmPassword(event.currentTarget.value)}
					onKeyDown={(event) => onEnterClick(event, refButton.current)}
				/>
				<Form.Control.Feedback type="invalid" style={{ color: 'var(--tango-color-error)' }}>
					{t('global:new-password-confirm-password-do-not-match.translation')}
				</Form.Control.Feedback>
			</Form.Group>
		</Container>
	);
};

ConfirmPassword.propTypes = {
	disabled: PropTypes.bool,
	refButton: PropTypes.any.isRequired, // not sure what the proptype should be
	setPassword: PropTypes.func.isRequired
};

export default ConfirmPassword;
