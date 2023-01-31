import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Container, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@components/core';

const DataTablePagination = ({ metadata, onPaginate }) => {
	const { t } = useTranslation();
	const { page_index, page_size, total_rows } = metadata;
	const pageCount = Math.ceil(total_rows / page_size) || 0;

	return (
		<React.Fragment>
			{metadata && onPaginate && (
				<Container
					fluid
					data-test-id="data-table-pagination"
					className="d-flex justify-content-between align-items-end"
					style={{
						overflow: 'unset'
					}}
				>
					<Form.Group className="d-flex align-items-center">
						{pageCount > 0 && (
							<React.Fragment>
								<Form.Label className="overflow-visible fw-semibold" style={{ color: 'var(--tango-color-green)' }}>
									Page
								</Form.Label>
								<Form.Select
									data-test-id="page-index"
									size="sm"
									value={page_index}
									className="mx-2"
									onChange={onPaginate}
								>
									{[...Array(pageCount)].map((item, index) => (
										<option key={index} value={index + 1}>
											{index + 1}
											{item}
										</option>
									))}
								</Form.Select>
								<Form.Label className="overflow-visible">of</Form.Label>
								<Form.Label className="ms-2 overflow-visible fw-bold">{pageCount}</Form.Label>
							</React.Fragment>
						)}
					</Form.Group>
					<Form.Group className="d-flex align-items-center">
						<OverlayTrigger placement="top" overlay={<Tooltip>{t('global:first.translation')}</Tooltip>}>
							<Button
								data-test-id="first-page"
								size="sm"
								variant="outline-secondary"
								className="me-1"
								disabled={parseInt(page_index, 10) === 1}
								onClick={onPaginate}
							>
								<Icon name="first-page" />
							</Button>
						</OverlayTrigger>
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
						<OverlayTrigger placement="top" overlay={<Tooltip>{t('global:last.translation')}</Tooltip>}>
							<Button
								data-test-id="last-page"
								size="sm"
								variant="outline-secondary"
								disabled={pageCount === 0 || parseInt(page_index, 10) === pageCount}
								onClick={onPaginate}
							>
								<Icon name="last-page" />
							</Button>
						</OverlayTrigger>
					</Form.Group>
				</Container>
			)}
		</React.Fragment>
	);
};

DataTablePagination.defaultProps = {
	metadata: {}
};

DataTablePagination.propTypes = {
	metadata: PropTypes.object,
	onPaginate: PropTypes.func.isRequired
};

export default DataTablePagination;
