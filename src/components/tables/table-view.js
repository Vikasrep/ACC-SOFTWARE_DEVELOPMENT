/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getTangoFields, getForm, getReport, getTable, hideNotification, saveTable, showNotification } from '@reducers';
import { Button, ButtonGroup, Container, Dropdown } from 'react-bootstrap';
import {
	Breadcrumb,
	DataView,
	Loader,
	PageHeader,
	EditHistory,
	PermissionAccess,
	UserDropDown
} from '@components/core';
import { headerLabel, isDate, isDateTime } from '@utilities';
import request from '../../apis/fetch/request';
import ReportsDropdownComponent from '../core/reports-dropdown/reports-dropdown-component';

const TableView = ({ reportId, reportName, table, tableField }) => {
	const { pathname } = useLocation();
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();

	const fields = useSelector((state) => state.fields);
	const form = useSelector((state) => state.form);
	const report = useSelector((state) => state.report);
	const stateTable = useSelector((state) => state.table);
	const permissions = useSelector((state) => state.auth.data.user_permissions);

	const [breadcrumb, setBreadcrumb] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [isTableLoading, setIsTableLoading] = useState(true);
	const [metadata, setMetadata] = useState();
	const [row, setRow] = useState();
	const [rowIndex, setRowIndex] = useState();
	const [rows, setRows] = useState();
	const [navigation, setNavigation] = useState();
	const [saveData, setSaveData] = useState();
	const [settings, setSettings] = useState();
	const [Access, setAccess] = useState(true);

	const basePath = `/tables/${table}/${reportName}`;
	const paramsAction = params.action;
	const paramsId = params.id;
	const routeTable = table.slice(0, -1);

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

		if (tablePermission[paramsAction === 'edit' ? 'modify' : paramsAction]) {
			setAccess(true);
		}
	}, [paramsAction, permissions, table]);

	// toolbar
	const getToolbar = useCallback(() => {
		if (saveData) return {};

		return {
			navigation: {
				next: {
					label: t('global:next.translation'),
					disabled:
						(rowIndex === rows.length - 1 && rowIndex === Math.ceil(metadata.total_rows / metadata.page_size)) ||
						rows.length === 1,
					action: () => {
						setNavigation('next');
					}
				},
				previous: {
					label: t('global:previous.translation'),
					disabled: (rowIndex === 0 && parseInt(metadata.page_index, 10) === 1) || rows.length === 1,
					action: () => {
						setNavigation('previous');
					}
				},
				back: {
					label: t('global:return.translation'),
					disabled: false,
					action: () => {
						setNavigation('return');
					}
				}
			}
		};
	}, [t, saveData, metadata, rowIndex, rows]);

	// actions
	const getActionbar = useCallback(
		() => ({
			actions:
				paramsId === 'new' ? (
					<React.Fragment>
						<Button
							variant="light"
							data-test-id="cancel"
							size="sm"
							onClick={() => {
								navigate(pathname.replace('/new', ''));
							}}
						>
							{t('global:cancel.translation')}
						</Button>
						<Button
							className="tango-green-button ms-2"
							data-test-id="save"
							size="sm"
							onClick={() => {
								console.log('save'); // eslint-disable-line no-console
							}}
						>
							{t('global:save.translation')}
						</Button>
					</React.Fragment>
				) : paramsAction === 'edit' ? (
					<React.Fragment>
						{saveData ? (
							<React.Fragment>
								<Button
									data-test-id="cancel"
									variant="light"
									style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
									size="sm"
									onClick={() => {
										setSaveData();
										setRow({ ...row });
										dispatch(hideNotification());
										navigate(`${pathname.replace('/edit', '/view')}`);
									}}
								>
									{t('global:cancel.translation')}
								</Button>
								<Dropdown as={ButtonGroup} className="ms-2">
									<Button
										data-test-id="save-close"
										size="sm"
										className="tango-green-button"
										onClick={() => {
											if (save()) setNavigation('return');
										}}
									>
										{t('global:save-close.translation')}
									</Button>
									<Dropdown.Toggle className="tango-green-button" size="sm" />
									<Dropdown.Menu>
										<Dropdown.Item
											data-test-id="save-previous"
											size="sm"
											disabled={rowIndex === 0 && parseInt(metadata.page_index, 10) === 1}
											onClick={() => {
												if (save()) setNavigation('previous');
											}}
										>
											{t('global:save-previous.translation')}
										</Dropdown.Item>
										<Dropdown.Item
											data-test-id="save-next"
											size="sm"
											disabled={
												rowIndex === rows.length - 1 && rowIndex === Math.ceil(metadata.total_rows / metadata.page_size)
											}
											onClick={() => {
												if (save()) setNavigation('next');
											}}
										>
											{t('global:save-next.translation')}
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</React.Fragment>
						) : (
							<React.Fragment>
								<Button
									data-test-id="cancel"
									variant="light"
									style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
									size="sm"
									onClick={() => {
										setSaveData();
										setRow({ ...row });
										dispatch(hideNotification());
										navigate(`${pathname.replace('/edit', '/view')}`);
									}}
								>
									{t('global:cancel.translation')}
								</Button>
								<Dropdown as={ButtonGroup} className="ms-2">
									<Button
										className="tango-green-button"
										disabled
										data-test-id="save-close"
										size="sm"
										onClick={() => {
											if (save()) setNavigation('return');
										}}
									>
										{t('global:save-close.translation')}
									</Button>
									<Dropdown.Toggle size="sm" disabled />
									<Dropdown.Menu>
										<Dropdown.Item
											disabled
											data-test-id="save-previous"
											size="sm"
											onClick={() => {
												if (save()) setNavigation('previous');
											}}
										>
											{t('global:save-previous.translation')}
										</Dropdown.Item>
										<Dropdown.Item
											data-test-id="save-next"
											size="sm"
											disabled
											onClick={() => {
												if (save()) setNavigation('next');
											}}
										>
											{t('global:save-next.translation')}
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</React.Fragment>
						)}
					</React.Fragment>
				) : paramsAction === 'view' ? (
					<React.Fragment>
						<Button
							style={{
								backgroundColor: 'var(--tango-color-lighter-green)',
								borderColor: 'var(--tango-color-lighter-green)',
								borderRadius: '10px'
							}}
							data-test-id="edit"
							size="sm"
							onClick={() => {
								dispatch(hideNotification());
								navigate(`${pathname.replace('/view', '/edit')}`);
							}}
						>
							{t('global:edit.translation')}
						</Button>
						<Button
							style={{
								backgroundColor: 'var(--tango-color-lighter-green)',
								borderColor: 'var(--tango-color-lighter-green)',
								borderRadius: '10px'
							}}
							data-test-id="new"
							disabled
							size="sm"
							className="ms-2"
							onClick={() => {
								dispatch(hideNotification());
								navigate(pathname.replace(row.claim_record_id, 'new'));
							}}
						>
							{t('global:new.translation')}
						</Button>
					</React.Fragment>
				) : null
		}),
		[saveData, paramsId, t, paramsAction, rowIndex, metadata, rows, navigate, pathname, row, dispatch, save]
	);

	// save table
	const save = () => {
		const required = settings.filter((item) => item.required);
		const dates = settings.filter((item) => item.field_type === 'date');
		const timestamps = settings.filter((item) => item.field_type === 'timestamp');

		let errors = [];

		// validate required
		required.forEach((item) => {
			if (saveData[item.property_name] !== undefined) {
				if (saveData[item.property_name]) {
					delete item['error'];
				} else {
					item['error'] = t('global:required.translation');
					errors.push(1);
				}
			}
		});

		// validate date
		dates.forEach((item) => {
			if (saveData[item.property_name] !== undefined) {
				if (isDate(saveData[item.property_name])) {
					delete item['error'];
				} else {
					item['error'] = t('global:date-is-invalid.translation');
					errors.push(2);
				}
			}
		});

		// validate timestamp
		timestamps.forEach((item) => {
			if (saveData[item.property_name] !== undefined) {
				if (isDateTime(saveData[item.property_name])) {
					delete item['error'];
				} else {
					item['error'] = t('global:timestamp-is-invalid.translation');
					errors.push(3);
				}
			}
		});

		if (errors.length > 0) {
			const messages = [];

			const mapSettings = settings.map((setting) => {
				const found = required
					.concat(dates, timestamps)
					.find((item) => item.property_name === setting.property_name && item.error);

				if (found) {
					setting = Object.assign({ ...setting }, { ...found });
				}

				return setting;
			});

			if (errors.find((item) => item === 1)) messages.push(t('global:required-fields-are-required.translation'));
			if (errors.find((item) => item === 2)) messages.push(t('global:invalid-dates.translation'));
			if (errors.find((item) => item === 3)) messages.push(t('global:invalid-timestamps.translation'));

			setSettings(mapSettings);

			dispatch(
				showNotification({
					title: t('global:errors.translation'),
					message: messages,
					show: true,
					type: 'danger'
				})
			);

			return false;
		} else {
			try {
				const saveRow = Object.assign({ ...row }, saveData);

				// not needed for saving row
				delete saveRow['save'];

				dispatch(saveTable(routeTable, { ...saveData, _rid_: saveRow['_rid_'] }));

				setSaveData();

				// setIsLoading(true);
				return new Promise((resolve, reject) => {
					try {
						const title = `${stateTable.data[tableField]}`;

						const message = `${routeTable[0].toUpperCase() + routeTable.substring(1).toLowerCase()} has been saved`;

						dispatch(
							showNotification({
								title: title,
								message,
								show: true,
								type: 'success'
							})
						);
						resolve(true);
					} catch (error) {
						reject(error);
					}
				})
					.then(() => {
						dispatch(getTable(routeTable, paramsId));
						return true;
					})
					.catch(() => {
						dispatch(
							showNotification({
								title: t('global:errors.translation'),
								message: 'Something Wrong. please try again',
								show: true,
								type: 'danger'
							})
						);
						return false;
					});
			} catch (error) {
				dispatch(
					showNotification({
						title: t('global:errors.translation'),
						message: 'Something Wrong. please try again',
						show: true,
						type: 'danger'
					})
				);

				return false;
			}
		}
	};

	// fetch fields, form, report
	useEffect(() => {
		const meta = JSON.parse(window.sessionStorage.getItem('tables-metadata')) || {};

		dispatch(getReport(table, reportId, meta));

		dispatch(getTangoFields(table));
		dispatch(getForm(table, 1));
	}, [dispatch, table, reportId, permissions, paramsAction]);

	// fetch table
	useEffect(() => {
		dispatch(getTable(routeTable, paramsId));
	}, [dispatch, paramsId, routeTable]);

	// set data, is-loading
	// show notification
	useEffect(() => {
		if (stateTable.action === 'table/saved') {
			// setSaveData();
			// setIsLoading(true);
			// const title = `${stateTable.data[tableField]}`;
			// const message = `${routeTable[0].toUpperCase() + routeTable.substring(1).toLowerCase()} has been saved`;
			// dispatch(
			// 	showNotification({
			// 		title: title,
			// 		message,
			// 		show: true,
			// 		type: 'success'
			// 	})
			// );
		}
	}, [dispatch, routeTable, stateTable.action, stateTable.data, tableField]);

	// navigation
	useEffect(() => {
		if (navigation) {
			if (navigation === 'return') {
				navigate(basePath);
			} else {
				const num = navigation === 'next' ? 1 : -1;
				const found = rows[rowIndex + num];
				const rid = found ? found._rid_ : row._rid_;
				const url = `${basePath}/${rid}/${paramsAction}`;

				if (!found) {
					const meta = Object.assign({ ...metadata }, { page_index: parseInt(metadata.page_index, 10) + num });

					window.sessionStorage.setItem('tables-metadata', JSON.stringify(meta));

					dispatch(getReport(table, reportId, meta));
				} else {
					navigate(url);
				}
			}
		}
	}, [dispatch, navigate, basePath, metadata, navigation, paramsAction, reportId, row, rowIndex, rows, table]);

	// set navigation, row
	useEffect(() => {
		if (stateTable.data) {
			setNavigation();
			setRow(stateTable.data);
		}
	}, [stateTable]);

	// set metadata, rows
	useEffect(() => {
		if (report.data) {
			setMetadata(report.metadata);
			setRows(report.data);
		}
	}, [report]);

	// set row-index or navigate to (previous/next) record
	useEffect(() => {
		if (row && rows) {
			const index = rows.findIndex((item) => item._rid_ === row._rid_);

			if (rowIndex && index === -1) {
				const rowsLength = rows.length - 1;

				let newRow = rows[rowsLength];

				if (rowIndex === rowsLength) newRow = rows[0];

				navigate(`${basePath}/${newRow._rid_}/${paramsAction}`);
			} else {
				setRowIndex(index);
			}
		}
	}, [navigate, basePath, paramsAction, row, rowIndex, rows]);

	// set breadcrumb
	useEffect(() => {
		if (stateTable.data) {
			const path = `${basePath}/${stateTable.data[tableField]}`;

			setBreadcrumb(path);
		}
	}, [basePath, stateTable, tableField]);

	// fetch embed reports
	// set settings, is-table-loading
	useEffect(() => {
		if (fields.data && form.data && row) {
			setIsTableLoading(true);

			const settings = JSON.parse(JSON.stringify(form.data)).map((item) => {
				const field = fields.data.find((field) => field.property_name === item.property_name);

				if (field) {
					return Object.assign({ ...item }, { ...field });
				}

				return item;
			});

			const reports = settings.filter((item) => item.embedded_report_url);

			const process = async () => {
				for (const report of reports) {
					const embedUrl = report.embedded_report_url;
					const filterColumn = embedUrl.slice(embedUrl.indexOf('${') + 2, embedUrl.lastIndexOf('}'));
					const filterText = row[filterColumn];
					const url = embedUrl.replace(`\${${filterColumn}}`, filterText);

					if (filterText) {
						request({ url, method: 'get' })
							.then((response) => response)
							.then((response) => {
								if (response && response.data && response.data.length > 0) {
									const data = response.data;
									const setting = settings.find((setting) => setting._rid_ === report._rid_);

									if (data && setting) {
										const fields = JSON.parse(JSON.stringify(data[0]));

										delete fields['total_rows'];

										const columns = Object.keys(fields).map((key) => ({
											key,
											label: headerLabel(key)
										}));

										setting['columns'] = columns;
										setting['rows'] = data;
									}
								}
							});
					}

					setSettings(settings);
					setIsTableLoading(false);
				}
			};

			if (reports.length > 0) {
				process(reports);
			} else {
				setSettings(settings);
				setIsTableLoading(false);
			}
		}
	}, [fields, form, row]);

	// set is-loading
	useEffect(() => {
		if (rowIndex > -1 && settings) setIsLoading(false);
	}, [rowIndex, settings]);

	return Access ? (
		<React.Fragment>
			<PageHeader breadcrumb={<Breadcrumb path={breadcrumb || basePath} />} actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id={routeTable}>
					{isTableLoading && <Loader />}
					{stateTable.action === 'table/fetching' && <Loader />}
					<ReportsDropdownComponent />
					<Container
						fluid
						className="table-view"
						style={{
							background: 'var(--tango-color-white)',
							border: '1px solid #dfdfdf',
							boxShadow: '2px 4px 8px 1px rgba(0 0 0 / 14%)',
							borderRadius: '10px',
							padding: '25px'
						}}
					>
						<DataView
							key={breadcrumb}
							action={paramsAction || 'new'}
							data={row}
							settings={settings}
							toolbar={{
								...getToolbar(),
								...getActionbar()
							}}
							onChange={(event) => {
								const record = saveData ? { ...saveData } : {};
								const isCheckbox = event.currentTarget.type === 'checkbox';

								record[event.currentTarget.id] = isCheckbox ? event.currentTarget.checked : event.currentTarget.value;

								dispatch(hideNotification());
								setSaveData((prev) => ({ ...(prev || {}), ...record }));
							}}
						/>
						<EditHistory />
					</Container>
				</Container>
			)}
		</React.Fragment>
	) : (
		<PermissionAccess />
	);
};

TableView.propTypes = {
	reportId: PropTypes.number.isRequired,
	reportName: PropTypes.string.isRequired,
	table: PropTypes.string.isRequired,
	tableField: PropTypes.string.isRequired
};

export default TableView;
