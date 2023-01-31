import React, { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const DataTableCheckboxFormatter = ({ column, isCellSelected, onRowChange, row }) => {
	const ref = useRef();

	useLayoutEffect(() => {
		if (!isCellSelected) return;

		ref.current && ref.current.focus({ preventScroll: true });
	}, [isCellSelected]);

	return (
		<label className="react-data-grid-checkbox-css">
			<input
				type="checkbox"
				ref={ref}
				tabIndex={isCellSelected ? 0 : -1}
				defaultChecked={row[column.key] === '1' || row[column.key] === 'true' || row[column.key] === true}
				onChange={() => onRowChange({ ...row, [column.key]: !row[column.key] })}
				onClick={(event) => event.stopPropagation()}
			/>
			<div />
		</label>
	);
};

DataTableCheckboxFormatter.propTypes = {
	column: PropTypes.object.isRequired,
	disabled: PropTypes.bool,
	isCellSelected: PropTypes.bool.isRequired,
	onRowChange: PropTypes.func.isRequired,
	row: PropTypes.object.isRequired
};

export default DataTableCheckboxFormatter;
