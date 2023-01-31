import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification } from '@reducers';
import { Container, Toast } from 'react-bootstrap';

const Notification = () => {
	const dispatch = useDispatch();
	const { autohide, message, show, title, type } = useSelector((state) => state.notification);

	return (
		<React.Fragment>
			{show && (
				<Toast
					data-test-id="notification"
					bg={type}
					autohide={autohide || type === 'success' ? true : false}
					onClose={() => dispatch(hideNotification())}
				>
					<Toast.Header>
						<Container className="fw-bold">{title || message}</Container>
					</Toast.Header>
					{title && (
						<Toast.Body>
							{Array.isArray(message)
								? message.map((item, index) => <Container key={index}>{item}</Container>)
								: message}
						</Toast.Body>
					)}
				</Toast>
			)}
		</React.Fragment>
	);
};

export default Notification;
