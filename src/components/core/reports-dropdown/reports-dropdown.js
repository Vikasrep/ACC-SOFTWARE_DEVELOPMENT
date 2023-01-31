import React from 'react';
import { Container, Col, Row, Form, Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ReportsDropdownToolbar from './reports-dropdown-toolbar';
import ReportsDropdownPagination from './reports-dropdown-pagination';
import { isMobile } from '@utilities';

const ReportsDropdown = ({ reportbar, pagination, isFetching, onFetch }) => {
	const { t } = useTranslation();
	const queries = useSelector((state) => state.queries);

	// paginate
	const handleOnPaginate = (event) => {
		const { page_size, total_rows } = pagination;
		const pageCount = Math.ceil(total_rows / page_size);
		const action = event.currentTarget.getAttribute('data-test-id');
		const value = event.currentTarget.value;
		const params = { ...pagination };

		switch (action) {
			case 'first-page':
				params.page_index = 1;
				break;

			case 'previous-page':
				params.page_index = parseInt(params.page_index, 10) - 1;
				break;

			case 'next-page':
				params.page_index = parseInt(params.page_index, 10) + 1;
				break;

			case 'last-page':
				params.page_index = parseInt(pageCount, 10);
				break;

			case 'page-index':
				params.page_index = value;
				break;

			case 'page-size':
				params.page_size = value;
				break;

			default:
				break;
		}

		if (!isFetching) onFetch(params);
	};

	return (
		<React.Fragment>
			<Dropdown className="py-md-2 col-md-12 col-sm-12 toggle-btn">
				<Dropdown.Toggle
					size="sm"
					variant="link"
					className="text-decoration-none"
					style={{ marginBottom: isMobile() ? '8px' : '', color: 'var(--tango-color-light-green)' }}
				>
					{t('global:reports-and-charts.translation')}
				</Dropdown.Toggle>
				<Dropdown.Menu className="w-100 pb-4 bg-light">
					<Container fluid className="p-3" data-test-id="reports-dropdown">
						<Row>{reportbar && <ReportsDropdownToolbar search={reportbar.search} />}</Row>
						<Row>{pagination && <ReportsDropdownPagination metadata={pagination} onPaginate={handleOnPaginate} />}</Row>
						{/* reports */}
						<Row className="mt-3 d-flex">
							<Col xl={3} className="mb-3">
								<Row>
									<Form.Label className="fw-bold mb-2">{t('global:previously-viewed.translation')}</Form.Label>
								</Row>
								<Container fluid className="d-flex flex-column flex-wrap h-100">
									{queries.data &&
										queries.data.recent.map((item, index) => (
											<Form.Label key={index} style={{ fontSize: '14px', padding: '2px' }}>
												{item.qyname}
											</Form.Label>
										))}
								</Container>
							</Col>
							<Col xl={9}>
								<Row>
									<Form.Label className="fw-bold mb-2">{t('global:common-reports.translation')}</Form.Label>
								</Row>
								<Container fluid style={{ columns: '4 auto' }} className="common-reports">
									{queries.data &&
										queries.data.common.map((item, index) => (
											<Form.Label
												className="d-flex flex-wrap text-wrap w-100"
												key={index}
												style={{ fontSize: '14px', padding: '2px' }}
											>
												{item.qyname}
											</Form.Label>
										))}
								</Container>
							</Col>
						</Row>
					</Container>
				</Dropdown.Menu>
			</Dropdown>
		</React.Fragment>
	);
};

ReportsDropdown.propTypes = {
	pagination: PropTypes.object,
	isFetching: PropTypes.bool,
	onFetch: PropTypes.func,
	reportbar: PropTypes.shape({
		search: PropTypes.shape({
			text: PropTypes.string,
			func: PropTypes.func.isRequired
		})
	})
};

export default ReportsDropdown;
