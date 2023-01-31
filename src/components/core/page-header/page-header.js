import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import { Breadcrumb } from '@components/core';

const PageHeader = ({ breadcrumb, actions }) => (
	<Container
		fluid
		data-test-id="page-header"
		className="p-3 d-flex justify-content-between align-items-center"
		style={{
			height: 'var(--tango-page-header-height)'
			//boxShadow: 'var(--tango-navigation)'
		}}
	>
		{breadcrumb ? breadcrumb : <Breadcrumb />}
		{actions && (
			<Container fluid data-test-id="actions" className="d-flex justify-content-end">
				{actions}
			</Container>
		)}
	</Container>
);

PageHeader.propTypes = {
	actions: PropTypes.element,
	breadcrumb: PropTypes.element,
	label: PropTypes.string
};

export default PageHeader;
