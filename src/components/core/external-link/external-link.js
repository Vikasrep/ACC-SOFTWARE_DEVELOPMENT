import React from 'react';
import PropTypes from 'prop-types';

const ExternalLink = ({ label, className, url }) => (
	<a
		href={url}
		target="_blank"
		className={`text-decoration-none ${className}`}
		rel="noreferrer"
		style={{ color: 'var(--tango-color-lighter-green' }}
	>
		{label}
	</a>
);

ExternalLink.propTypes = {
	label: PropTypes.string.isRequired,
	className: PropTypes.string,
	url: PropTypes.string.isRequired
};

export default ExternalLink;
