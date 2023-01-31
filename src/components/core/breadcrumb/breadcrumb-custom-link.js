import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon } from '@components/core';

const BreadcrumbCustomLink = ({ label, route }) => (
	<React.Fragment>
		<Link
			to={route}
			className="text-nowrap text-truncate text-decoration-none"
			style={{ color: 'var(--tango-color-dark-green)', fontWeight: '600' }}
		>
			{label}
		</Link>
		<Icon name="arrow-right" />
	</React.Fragment>
);

BreadcrumbCustomLink.propTypes = {
	label: PropTypes.string.isRequired,
	route: PropTypes.string.isRequired
};

export default BreadcrumbCustomLink;
