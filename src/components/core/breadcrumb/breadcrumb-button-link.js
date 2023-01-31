import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Icon } from '@components/core';

const BreadcrumbButtonLink = ({ arrow, label, options }) => (
	<React.Fragment>
		<DropdownButton data-test-id="button-link" title={label} size="sm" variant="light">
			{options.map(({ label, route }, index) => (
				<Dropdown.Item key={index} href={route}>
					{label}
				</Dropdown.Item>
			))}
		</DropdownButton>
		{arrow && <Icon name="arrow-right" />}
	</React.Fragment>
);

BreadcrumbButtonLink.defaultProps = {
	arrow: true
};

BreadcrumbButtonLink.propTypes = {
	arrow: PropTypes.bool,
	label: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			route: PropTypes.string.isRequired
		})
	)
};

export default BreadcrumbButtonLink;
