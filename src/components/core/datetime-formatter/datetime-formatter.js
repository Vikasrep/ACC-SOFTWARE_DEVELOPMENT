import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { dateFormatter, datetimeFormatter } from '@utilities';

const DateTimeFormatter = ({ className, disabled, onChange, showTime, type, value }) => {
	if (!value) return value;

	const formatted = showTime ? datetimeFormatter(value) : dateFormatter(value);

	if (type === 'input') {
		const classNames = `text-wrap${className ? ` ${className}` : ''}`;

		return (
			<Form.Control defaultValue={formatted} disabled={disabled} className={classNames} size="sm" onChange={onChange} />
		);
	}

	return formatted;
};

DateTimeFormatter.defaultProps = {
	disabled: false,
	language: 'en-US',
	type: 'text',
	time: false
};

DateTimeFormatter.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
	language: PropTypes.string,
	onChange: PropTypes.func,
	showTime: PropTypes.bool,
	type: PropTypes.oneOf(['input', 'text']),
	value: PropTypes.string.isRequired
};

export default DateTimeFormatter;
