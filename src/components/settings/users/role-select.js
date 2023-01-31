import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const RoleSelect = ({ column, row, onRowChange }) => {
	const { data } = useSelector((state) => state.roles);
	return (
		<select
			autoFocus
			className="react-data-grid-css"
			defaultValue={row[column.key]}
			onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value }, true)}
		>
			{data &&
				[{ role_name: 'Select a Role', role_id: '' }, ...data].map((option) => {
					const label = typeof option === 'object' ? option.role_name : option;
					const value = typeof option === 'object' ? option.role_id : option;

					return (
						<option key={value} value={value}>
							{label}
						</option>
					);
				})}
		</select>
	);
};

RoleSelect.propTypes = {
	column: PropTypes.object.isRequired,
	onRowChange: PropTypes.func.isRequired,
	row: PropTypes.object.isRequired
};

export default RoleSelect;
