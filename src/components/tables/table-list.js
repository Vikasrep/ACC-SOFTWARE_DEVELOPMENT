/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getTangoFields, getReport, hideNotification, getUserPermissions } from '@reducers';
import { Button, Container } from 'react-bootstrap';
import { DataTable, Loader, PageHeader, PermissionAccess, Icon, UserDropDown } from '@components/core';
import ReportsDropdownComponent from '../core/reports-dropdown/reports-dropdown-component';
import { getExcelReports } from '@apis';

const TableList = ({ reportId, table }) => {
	const { pathname } = useLocation();
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const fields = useSelector((state) => state.fields);
	const report = useSelector((state) => state.report);
	const permissions = useSelector((state) => state.auth.data.user_permissions);

	const [columns, setColumns] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [metadata, setMetadata] = useState();
	const [pagination, setPagination] = useState();
	const [rows, setRows] = useState();
	const [sortColumns, setSortColumns] = useState();
	const [Access, setAccess] = useState(false);

	// fetch fields, report
	useEffect(() => {
		const meta = JSON.parse(window.sessionStorage.getItem('tables-metadata')) || {};
		const notifcation = document.querySelector('[data-test-id="notification"]');

		if (notifcation && !notifcation.classList.contains('bg-success')) {
			dispatch(hideNotification());
		}
		dispatch(getUserPermissions('user-role-permissions', table));
		dispatch(getReport(table, reportId, meta));
		dispatch(getTangoFields(table));
	}, [dispatch, reportId, table]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		let tablePermission = permissions
			? permissions.find((item) => {
					if ('serviceline' === item.table.split(' ').join('').toLowerCase()) {
						return String(table.split('-').join('')).toLowerCase().includes('serviceline');
					} else if ('tar' === item.table.split(' ').join('').toLowerCase()) {
						return String(table.split('-').join('')).toLowerCase().includes('tar');
					} else if ('rmaprecertifications' === item.table.split(' ').join('').toLowerCase()) {
						return 'rmaprecertifications'.includes(String(table.split('-').join('')).toLowerCase());
					} else {
						return String(item.table.split(' ').join('')).toLowerCase() === String(table).toLowerCase();
					}
			  })
			: {
					table: false,
					view: false,
					modify: false,
					add: false,
					delete: false,
					save_common_reports: false,
					edit_field_properties: false,
					fields: false
			  };
		if (tablePermission?.view) {
			setAccess(true);
		}
	}, [permissions, table]);

	const fieldsFilterData = (key) => {
		if (!key) return null;

		const { property_name, label, field_type, order, is_searchable } = key;
		return {
			key: property_name,
			field_type,
			label,
			order,
			is_searchable
		};
	};

	// set coluns, rows, metadata, pagination, sort-columns
	useEffect(() => {
		if (report.data) {
			const { data, metadata, fields } = report;
			const { sort_column, sort_direction } = metadata || {};
			const sortColumns = sort_column ? [{ columnKey: sort_column, direction: sort_direction }] : [];
			const cols = fields ? fields.map(fieldsFilterData) : [];

			setColumns(cols.filter((col) => col).sort((a, b) => (a.order > b.order ? 1 : b.order > a.order ? -1 : 0)));
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
			isLoading &&
			columns &&
			metadata &&
			pagination &&
			rows &&
			sortColumns
		) {
			setIsLoading(false);
		}
	}, [columns, fields, isLoading, metadata, pagination, report, rows, sortColumns]);

	const Fetch = async () =>
		await getExcelReports(table, {
			search_text: metadata?.search_text || '',
			search_column: metadata?.search_column || '',
			filter_column: metadata?.filter_column || '',
			filter_text: metadata?.filter_text || ''
		}).then((res) => res);

	const handelClick = async () => {
		try {
			setIsLoading(true);
			const { data = {} } = await Fetch();
			if (Object.keys(data).length) {
				let filePath = `${process.env.API_URL}${data.filePath}`;
				await fetch(filePath, {
					method: 'HEAD',
					cache: 'no-cache'
				});

				const link = document.createElement('a');
				link.href = filePath;
				link.setAttribute('download', '');
				link.setAttribute('target', '_blank');
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				setIsLoading(false);
			}
		} catch (error) {
			setIsLoading(false);
			return false;
		}
	};

	return Access ? (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id={table}>
					{/* {report.action === 'report/fetching' && <Loader />} */}

					<DataTable
						leftSideAction={<ReportsDropdownComponent />}
						actions={
							<React.Fragment>
								<Button
									data-test-id="new"
									disabled
									size="sm"
									className="text-capitalize tango-green-button me-1"
									onClick={() => {
										navigate(`${pathname}/new`);
									}}
								>
									+ {t('global:new.translation')} {table.slice(0, -1)}
								</Button>
								<Button
									data-test-id="import"
									size="sm"
									className="text-capitalize tango-green-button"
									// style={{ color: 'var(--tango-color-light-green)' }}
									onClick={handelClick}
								>
									{t('global:export-from-file.translation')}
								</Button>
								<Button
									data-test-id="import"
									size="sm"
									variant="link"
									className="text-capitalize text-decoration-none"
									style={{ color: 'var(--tango-color-light-green)' }}
									onClick={() => {
										navigate('/import');
									}}
								>
									<Icon name="import" style={{ fontSize: '15px' }} /> {t('global:import-export.translation')}
								</Button>
							</React.Fragment>
						}
						style={{
							height: '68vh',
							boxShadow: '2px 4px 8px 1px rgba(0, 0, 0, 0.14)',
							borderRadius: '10px',
							border: '1px solid #DFDFDF'
						}}
						columnActions={[
							{
								id: 'edit',
								action: (row) => {
									navigate(`${pathname}/${row._rid_}/edit`);
								}
							},
							{
								id: 'view',
								action: (row) => {
									navigate(`${pathname}/${row._rid_}/view`);
								}
							}
						]}
						columns={columns}
						rows={report.action === 'report/fetching' ? [] : rows}
						isFetching={report.action === 'report/fetching' ? true : false}
						pagination={pagination}
						columnOptions={{
							resizable: true,
							sortable: true,
							disabled: true
						}}
						toolbar={{
							search: {
								column: metadata.search_column,
								text: metadata.search_text,
								func: (text, column) => {
									const meta = { ...metadata };

									meta['search_text'] = text;
									meta['search_column'] = column;

									window.sessionStorage.setItem('tables-metadata', JSON.stringify(meta));

									dispatch(getReport(table, reportId, meta));
								},
								options: columns.filter((item) => item.is_searchable)
							}
						}}
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

							dispatch(getReport(table, reportId, meta));
						}}
						onFetch={(meta) => {
							window.sessionStorage.setItem('tables-metadata', JSON.stringify(meta));

							dispatch(getReport(table, reportId, meta));
						}}
					/>
				</Container>
			)}
		</React.Fragment>
	) : (
		<PermissionAccess />
	);
};

TableList.propTypes = {
	reportId: PropTypes.number.isRequired,
	table: PropTypes.string.isRequired
};

export default TableList;
