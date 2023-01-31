import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Container, Form } from 'react-bootstrap';

const DataTableDetails = ({ metadata, onPaginate }) => {
	const { t } = useTranslation();
	const { page_size, total_rows } = metadata;
	const showOptions = [10, 25, 50, 75, 100];
	return (
		<Container
			fluid
			data-test-id="data-table-details"
			className="d-flex justify-content-between align-items-end"
			style={{
				overflow: 'unsert'
			}}
		>
			<Form.Group data-test-id="total-rows" className="d-flex justify-content-start align-items-center">
				<Form.Label className="overflow-visible fw-semibold" style={{ color: 'var(--tango-color-green)' }}>
					{t('global:total.translation')}:
				</Form.Label>
				<Form.Group className="ms-2 fw-bold ">{total_rows}</Form.Group>
			</Form.Group>
			<Form.Group
				data-test-id="page-size"
				controlId="page-size"
				className="d-flex justify-content-end align-items-center"
			>
				<Form.Label className="overflow-visible fw-semibold" style={{ color: 'var(--tango-color-green)' }}>
					Show:
				</Form.Label>
				<Form.Select data-test-id="page-size" size="sm" value={page_size} className="ms-2" onChange={onPaginate}>
					{showOptions.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</Form.Select>
			</Form.Group>
		</Container>
	);
};

DataTableDetails.defaultProps = {
	metadata: {}
};

DataTableDetails.propTypes = {
	metadata: PropTypes.object.isRequired,
	onPaginate: PropTypes.func.isRequired
};

export default DataTableDetails;
