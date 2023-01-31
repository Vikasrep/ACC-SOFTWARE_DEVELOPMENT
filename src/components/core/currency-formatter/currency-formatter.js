import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { currencyFormatter } from '@utilities';

const CurrencyFormatter = ({ className, currency, disabled, type, value }) => {
	const formatted = currencyFormatter(value, currency);

	if (type === 'input') {
		const classNames = `text-wrap${className ? ` ${className}` : ''}`;

		return <Form.Control defaultValue={formatted} disabled={disabled} className={classNames} size="sm" />;
	}

	return formatted;
};

CurrencyFormatter.defaultProps = {
	currency: 'USD',
	type: 'text'
};

CurrencyFormatter.propTypes = {
	className: PropTypes.string,
	currency: PropTypes.oneOf(['USD']),
	disabled: PropTypes.bool,
	type: PropTypes.oneOf([null, 'input', 'text']),
	value: PropTypes.number.isRequired
};

export default CurrencyFormatter;
