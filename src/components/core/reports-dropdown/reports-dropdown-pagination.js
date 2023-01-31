import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Container, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@components/core';

const ReportsDropdownPagination = ({ metadata, onPaginate }) => {
	const { t } = useTranslation();
	const { page_index, page_size, total_rows } = metadata;
	const pageCount = Math.ceil(total_rows / page_size) || 0;

	return (
		<React.Fragment>
			{metadata && onPaginate && (
				<Container fluid data-test-id="reports-and-charts-pagination" className="d-flex flex-row-reverse">
					<Form.Group className="d-flex align-items-center">
						<OverlayTrigger placement="top" overlay={<Tooltip>{t('global:previous.translation')}</Tooltip>}>
							<Button
								data-test-id="previous-page"
								size="sm"
								variant="outline-secondary"
								className="me-1"
								disabled={parseInt(page_index, 10) === 1}
								onClick={onPaginate}
							>
								<Icon name="navigate-before" />
							</Button>
						</OverlayTrigger>
						<OverlayTrigger placement="top" overlay={<Tooltip>{t('global:next.translation')}</Tooltip>}>
							<Button
								data-test-id="next-page"
								size="sm"
								variant="outline-secondary"
								className="me-1"
								disabled={pageCount === 0 || parseInt(page_index, 10) === pageCount}
								onClick={onPaginate}
							>
								<Icon name="navigate-next" />
							</Button>
						</OverlayTrigger>
					</Form.Group>
				</Container>
			)}
		</React.Fragment>
	);
};

ReportsDropdownPagination.defaultProps = {
	metadata: {}
};

ReportsDropdownPagination.propTypes = {
	metadata: PropTypes.object,
	onPaginate: PropTypes.func.isRequired
};

export default ReportsDropdownPagination;
