import React from 'react';
import PropTypes from 'prop-types';

const DataTableSelectEditor = ({ column, disabled, row, options, onRowChange }) => {
	const autoFocusAndSelect = (element) => {
		if (element) element.focus();
	};

	return (
		<select
			autoFocus
			ref={autoFocusAndSelect}
			className="react-data-grid-css"
			value={row[column.key]}
			disabled={disabled}
			onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value }, true)}
		>
			{options.map((option) => {
				const label = typeof option === 'object' ? option.label : option;
				const value = typeof option === 'object' ? option.value : option;

				return (
					<option key={value} value={value}>
						{label}
					</option>
				);
			})}
		</select>
	);
};

DataTableSelectEditor.propTypes = {
	column: PropTypes.object.isRequired,
	disabled: PropTypes.bool,
	onRowChange: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
	row: PropTypes.object.isRequired
};

export default DataTableSelectEditor;
