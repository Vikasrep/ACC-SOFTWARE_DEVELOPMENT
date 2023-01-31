import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatter, datetimeFormatter } from '@utilities';

const DataTableTextEditor = ({ column, disabled, isDate, isDateTime, onClose, onRowChange, row, type }) => {
	const autoFocusAndSelect = (element) => {
		if (element) {
			element.focus();
			element.select();
		}
	};
	const value = row[column.key];
	const defaultValue = isDate ? dateFormatter(value) : isDateTime ? datetimeFormatter(value) : value;

	return (
		<input
			type={type || 'text'}
			ref={autoFocusAndSelect}
			className="react-data-grid-css"
			disabled={disabled}
			defaultValue={defaultValue}
			onBlur={(event) => {
				onRowChange({ ...row, [column.key]: event.target.value }, true);
				onClose(true);
			}}
			onKeyDown={(event) => {
				if (event.key === 'Enter') {
					onRowChange({ ...row, [column.key]: event.target.value }, true);
					onClose(true);
				}
			}}
		/>
	);
};

DataTableTextEditor.propTypes = {
	column: PropTypes.object.isRequired,
	disabled: PropTypes.bool,
	isDate: PropTypes.bool,
	isDateTime: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onRowChange: PropTypes.func.isRequired,
	row: PropTypes.object.isRequired,
	type: PropTypes.string
	// type: PropTypes.oneOf['', 'date', 'email', 'number', 'text']
};

export default DataTableTextEditor;
