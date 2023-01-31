import React from 'react';
import PropTypes from 'prop-types';

const AccessSelect = ({ column, row, onRowChange }) => {
	const options = ['All Records', 'None'];

	return (
		<select
			autoFocus
			className="react-data-grid-css"
			defaultValue={row[column.key]}
			onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value }, true)}
		>
			{options &&
				options.map((option) => (
					<option key={option} value={option === 'All Records' ? true : null || option === 'None' ? false : null}>
						{option}
					</option>
				))}
		</select>
	);
};

AccessSelect.propTypes = {
	column: PropTypes.object.isRequired,
	onRowChange: PropTypes.func.isRequired,
	row: PropTypes.object.isRequired
};

export default AccessSelect;
