import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

const BreadcrumbLabel = ({ label }) => <Form.Label className="text-nowrap text-truncate fw-bold">{label}</Form.Label>;

BreadcrumbLabel.propTypes = {
	label: PropTypes.string.isRequired
};

export default BreadcrumbLabel;
