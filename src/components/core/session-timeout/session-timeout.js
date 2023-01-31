import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Modal } from 'react-bootstrap';
import { access_token } from '@reducers';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const SessionTimeout = ({ onIdle, timer = 30 }) => {
	const [modalShow, setModalShow] = useState(false);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	useEffect(() => {
		window.localStorage.setItem('session-timer', new Date());

		const interval = 1 * 60000; // 1 minute
		const expiration = timer * 240000; // 2 hours
		// const notify = 1000; // 1 hours
		const notify = expiration / 2; // 1 hours
		const events = ['click', 'load', 'mousemove', 'scroll', 'keydown'];

		const setInterval = window.setInterval(() => {
			const time = window.localStorage.getItem('session-timer') || new Date();
			const difference = new Date().getTime() - new Date(new Date(time).getTime() + expiration).getTime();
			const Notifydifference = new Date().getTime() - new Date(new Date(time).getTime() + notify).getTime();
			Notifydifference > -1 && setModalShow(true);
			difference > -1 && onIdle();
		}, interval);

		const eventHandler = () => {
			window.localStorage.setItem('session-timer', new Date());
		};

		events.forEach((event) => {
			window.addEventListener(event, eventHandler);
		});

		return () => {
			events.forEach((event) => {
				window.removeEventListener(event, eventHandler);
			});

			setInterval && window.clearInterval(setInterval);
		};
	}, [onIdle, timer]);

	return (
		<Modal size="md" centered data-test-id="new-table-modal" show={modalShow}>
			<Modal.Header style={{ borderBottom: '0 none' }}>
				<Modal.Title
					id="contained-modal-title-vcenter"
					className="text-capitalize"
					style={{ color: 'var(--tango-color-pink' }}
				>
					{t('global:session-out.translation')}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{t('global:session-out.description')}
				<Container fluid className="mt-4">
					<Button
						data-test-id="submit"
						size="md"
						className="me-2 tango-green-button"
						onClick={(e) => {
							e.preventDefault();
							onIdle();
						}}
					>
						{t('global:log-off.translation')}
					</Button>
					<Button
						variant="light"
						size="md"
						style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
						onClick={(e) => {
							e.preventDefault();
							dispatch(access_token());
							setModalShow(false);
						}}
					>
						{t('global:stay-logged-in.translation')}
					</Button>
				</Container>
			</Modal.Body>
		</Modal>
	);
};

SessionTimeout.propTypes = {
	onIdle: PropTypes.func.isRequired,
	timer: PropTypes.number
};

export default SessionTimeout;
