import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTangoFields, getReport } from '@reducers';
import { ExternalLink, Loader, PageHeader, DataTable, Icon, UserDropDown } from '@components/core';
import { Form, Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [columns, setColumns] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [metadata, setMetadata] = useState();
	const [pagination, setPagination] = useState();
	const [rows, setRows] = useState();
	const [sortColumns, setSortColumns] = useState();

	const auth = useSelector((state) => state.auth);
	const fields = useSelector((state) => state.fields);
	const report = useSelector((state) => state.report);

	const reportTable = 'claims';
	const reportTableId = 1; // list all

	// fetch fields, report
	useEffect(() => {
		const meta = auth.data && auth.data.email1 && { filter_column: 'assigned_to', filter_text: auth.data.email1 };

		dispatch(getReport(reportTable, reportTableId, meta));
		dispatch(getTangoFields(reportTable, reportTableId));
	}, [dispatch, auth]);

	// set columns
	useEffect(() => {
		if (fields.data && report.data) {
			if (report.data.length === 0) {
				setColumns([]);
			} else {
				const keys = Object.keys(report.data[0]);
				const cols = keys.map((key) => {
					const field = fields.data.find((field) => field.property_name === key);

					if (!field) return null;

					return {
						key,
						label: field.label,
						field_type: field.field_type
					};
				});

				setColumns(cols.filter((col) => col));
			}
		}
	}, [fields.data, report.data]);

	// set rows, metadata, pagination, sort-columns
	useEffect(() => {
		if (report.data) {
			const { data, metadata } = report;
			const { sort_column, sort_direction } = metadata || {};
			const sortColumns = sort_column ? [{ columnKey: sort_column, direction: sort_direction }] : [];

			setRows(data);
			setMetadata(metadata);
			setPagination(metadata);
			setSortColumns(sortColumns);
		}
	}, [report]);

	// set is-loading
	useEffect(() => {
		if (
			fields.action === 'fields/fetched' &&
			report.action === 'report/fetched' &&
			columns &&
			pagination &&
			rows &&
			sortColumns
		) {
			setIsLoading(false);
		}
	}, [columns, fields, pagination, report, rows, sortColumns]);

	return (
		<React.Fragment>
			{
				<style>
					{`
					div[data-test-id=dashboard] > div[data-test-id=claims] {
						position: relative;
					}

					div[data-test-id=dashboard] > div[data-test-id=claims] > div[data-test-id=loader] {
						height: 100% !important;
						width: 100% !important;
					}
				`}
				</style>
			}
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id="dashboard">
					<Container fluid className="d-flex justify-content-between dashboard-header">
						<Form.Label
							style={{ color: 'var(--tango-color-dark-green)', fontSize: '1.5rem' }}
							dangerouslySetInnerHTML={{
								__html: t('global:welcome-name.translation', { name: auth.data.first_name || '' })
							}}
						/>
						<Button
							data-test-id="import"
							size="sm"
							className="text-capitalize mb-2 tango-green-button"
							onClick={() => {
								navigate('/import');
							}}
						>
							<Icon name="import" style={{ fontSize: '14px' }} /> {t('global:import-export.translation')}
						</Button>
					</Container>
					<Container
						fluid
						data-test-id="claims"
						style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
					>
						{report.action === 'report/fetching' && <Loader />}
						<DataTable
							columnActions={[
								{
									id: 'edit',
									action: (row) => navigate(`/tables/claims/list-all/${row._rid_}/edit`)
								},
								{
									id: 'view',
									action: (row) => navigate(`/tables/claims/list-all/${row._rid_}/view`)
								}
							]}
							columns={columns}
							columnOptions={{
								resizable: true,
								sortable: true,
								disabled: true
							}}
							rows={rows}
							pagination={pagination}
							sortColumns={sortColumns}
							onSortColumnsChange={(columns) => {
								const meta = { ...metadata };

								if (columns.length === 0) {
									delete meta['sort_column'];
									delete meta['sort_direction'];
								} else {
									meta['sort_column'] = columns[0].columnKey;
									meta['sort_direction'] = columns[0].direction;
								}

								window.sessionStorage.setItem('tables-metadata', JSON.stringify(meta));

								dispatch(getReport(reportTable, reportTableId, meta));
							}}
							toolbar={{
								title: t('global:assigned-to.translation')
							}}
							onFetch={(meta) => {
								dispatch(getReport(reportTable, reportTableId, meta));
							}}
							style={{ height: '440px' }}
						/>
					</Container>
					<Container fluid data-test-id="self-audits" className="mt-4">
						<ExternalLink
							label={t('global:current-self-audits.translation')}
							url="https://pcu.quickbase.com/db/bjqsvr9my?a=dbpage&pageID=41"
							className="h5"
						/>
						<Container fluid>
							<Form.Text>{t('global:redirect-to-qb.translation')}</Form.Text>
						</Container>
					</Container>
				</Container>
			)}
		</React.Fragment>
	);
};

export default Dashboard;
