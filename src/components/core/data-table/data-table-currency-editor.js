import React from 'react';
import PropTypes from 'prop-types';

const DataTableCurrencyEditor = (props) => {
	const { column, disabled, row, onClose, onRowChange, type } = props;

	const autoFocusAndSelect = (element) => {
		if (element) {
			element.focus();
			element.select();
		}
	};

	return (
		<input
			type={type || 'text'}
			ref={autoFocusAndSelect}
			className="react-data-grid-css"
			disabled={disabled}
			defaultValue={row[column.key] || 0}
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

DataTableCurrencyEditor.propTypes = {
	column: PropTypes.object.isRequired,
	disabled: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onRowChange: PropTypes.func.isRequired,
	row: PropTypes.object.isRequired,
	type: PropTypes.string
};

export default DataTableCurrencyEditor;
