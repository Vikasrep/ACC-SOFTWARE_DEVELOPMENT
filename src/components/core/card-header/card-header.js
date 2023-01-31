import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { Icon } from '@components/core';

const CardHeader = ({ label }) => (
	<Card.Header
		className="w-100"
		onClick={(event) => {
			const down = event.currentTarget.parentNode.querySelector('[data-test-id="arrow-down"]');
			const right = event.currentTarget.parentNode.querySelector('[data-test-id="arrow-right"]');
			const style = event.currentTarget.parentNode.querySelector('.card-body').style;

			if (style.display === 'none') {
				style.display = 'block';
				down.style.display = 'inline-block';
				right.style.display = 'none';
			} else {
				style.display = 'none';
				down.style.display = 'none';
				right.style.display = 'inline-block';
			}
		}}
		style={{ paddingLeft: '0.25rem', cursor: 'pointer' }}
	>
		<Icon dataTestId="arrow-down" name="arrow-down" style={{ marginRight: '0.25rem' }} />
		<Icon dataTestId="arrow-right" name="arrow-right" style={{ display: 'none', marginRight: '0.25rem' }} />
		{label}
	</Card.Header>
);

CardHeader.propTypes = {
	label: PropTypes.string.isRequired
};

export default CardHeader;
