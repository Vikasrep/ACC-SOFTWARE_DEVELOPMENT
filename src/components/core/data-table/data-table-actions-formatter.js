import React from 'react';
import PropTypes from 'prop-types';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@components/core';

const DataTableActionsFormatter = ({ actions, row }) => (
	<Container
		data-test-id="data-table-actions-formatter"
		className="h-100 d-flex justify-content-between align-items-center react-data-grid-actions-css"
		style={{
			width: 'inherit',
			margin: '0 -8px'
		}}
	>
		{actions.map(({ id, action }, index) => {
			const style = {};

			if (actions.length > 1) {
				if (index === 0) style['paddingLeft'] = '8px';
				if (index === actions.length - 1) style['paddingRight'] = '8px';
			}

			return (
				<OverlayTrigger key={index} placement="top" overlay={<Tooltip>{id}</Tooltip>}>
					<Container
						className="text-center"
						style={{ width: '100%', cursor: 'pointer', ...style }}
						onClick={() => action(row)}
						onMouseMove={(event) => {
							event.currentTarget.getElementsByTagName('svg')[0].style.color = 'var(--tango-color-black)';
						}}
						onMouseLeave={(event) => {
							event.currentTarget.getElementsByTagName('svg')[0].style.color = 'var(--tango-color-black)';
						}}
					>
						<Icon name={id} style={{ width: '18px', color: 'var(--tango-color-black)' }} />
					</Container>
				</OverlayTrigger>
			);
		})}
	</Container>
);

DataTableActionsFormatter.propTypes = {
	actions: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			action: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired
		})
	),
	row: PropTypes.object
};

export default DataTableActionsFormatter;
