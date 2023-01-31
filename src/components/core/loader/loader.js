import React from 'react';
import PropTypes from 'prop-types';
import { Container, Spinner } from 'react-bootstrap';

const Loader = ({ style }) => (
	<Container
		fluid
		data-test-id="loader"
		className="d-flex justify-content-center align-items-center"
		style={{
			zIndex: '99999',
			position: 'absolute',
			height: '100%',
			...style
		}}
	>
		<Spinner animation="border" role="status" style={{ color: 'var(--tango-color-light-green)' }}>
			<Container className="visually-hidden">Loading..</Container>
		</Spinner>
	</Container>
);

Loader.propTypes = {
	style: PropTypes.object
};

export default Loader;
