import React, { useState, useEffect } from 'react';
import { PageHeader, Loader, UserDropDown } from '@components/core';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Form, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getTangoFields, showNotification } from '@reducers';
import { usePapaParse } from 'react-papaparse';

const fileReader = new FileReader();

const FileImportStep2 = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const { readString } = usePapaParse();
	const dispatch = useDispatch();
	const [pagination, setPagination] = useState();
	const { table, mergeField } = location.state;
	const { fields } = useSelector((state) => state);
	const { access_token } = useSelector((state) => state.auth.data);

	const [array, setArray] = useState([]);
	const [file] = useState(localStorage.getItem('file') || null);
	const [fieldOptions, setFieldOptions] = useState([]);
	const [headerKeys, setHeaderKeys] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [dataPerPage] = useState(250);
	const [startPerPage, setStartPerPage] = useState(0);

	useEffect(() => {
		dispatch(getTangoFields(table.replaceAll('_dbid_', '').replace(/-/g, '_')));
	}, [dispatch, table]);

	useEffect(() => {
		if (file) {
			fileReader.onload = function (event) {
				const text = event.target.result;

				readString(text, {
					//worker: true,
					skipEmptyLines: 'greedy',
					header: true,

					transformHeader: (h) =>
						h
							.replaceAll(' ', '_')
							.replaceAll('#', '')
							.replaceAll('_-_', '_')
							.replaceAll('/', '_')
							.replaceAll('(', '')
							.replaceAll(')', '')
							.replaceAll('%', '')
							.replaceAll('Number_', '')
							.toLowerCase()
							.replaceAll('claim_record_id', '_rid_'),
					complete: (array) => {
						setArray(array.data);
					}
				});
			};

			fetch(file)
				.then((result) => result.blob())
				.then((blob) => {
					const file = new File([blob], 'csv', { type: blob.type });
					fileReader.readAsText(file);
				});
		}
	}, [file, readString]);

	useEffect(() => {
		let headerKeys = Object.keys(Object.assign({}, ...array.slice(0, 50))) || [];
		let arrayHeaders = headerKeys && headerKeys.length ? headerKeys.map((value) => ({ value: '2', key: value })) : [];
		setPagination(array);
		setFieldOptions(arrayHeaders);
		setHeaderKeys(headerKeys);
	}, [array]);

	const onChangeRadioButton = (value) => (event) => {
		setFieldOptions((prev) => [
			...prev.filter((item) => item.key !== value),
			{ value: event.target.value, key: value }
		]);
	};

	const onChangeSelectBox = (oldKey) => (event) => {
		let newArray = [];
		for (let index = 0; index < array.length; index++) {
			let element = array[index];
			element[event.target.value] = element[oldKey];
			delete element[oldKey];
			newArray.push(element);
		}
		setArray(newArray);
	};

	const findValue = (keyValue) => fieldOptions.find((item) => item.key === keyValue) || { value: '', key: '' };

	useEffect(() => {
		if (fields.action === 'fields/fetched' && pagination) {
			setIsLoading(false);
		}
	}, [fields, pagination]);

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid>
					<Card>
						<Card.Header>{t('global:import-button.translation')}</Card.Header>
						<Card.Body>
							<Card.Text>{t('global:import-step2-preview.translation')}</Card.Text>
							<Card.Text
								dangerouslySetInnerHTML={{
									__html: t('global:import-step2-assign.translation', { mergeField: mergeField?.label || '' })
								}}
							/>
							<Card.Text>{t('global:import-step2-proceed.translation')}</Card.Text>
							<Card>
								<Container fluid className="p-2">
									<Card.Text>{t('global:first-row-field-names.translation')}</Card.Text>
									<Form.Check
										label={t('global:first-row-field-names-box.translation')}
										className="fw-bold small"
										disabled
										defaultChecked
									/>
								</Container>
							</Card>
						</Card.Body>

						{/* CSV VIEW */}
						<Card.Body>
							<Container fluid>
								<Table
									responsive
									bordered
									size="sm"
									style={{ whiteSpace: 'nowrap', display: 'block', height: '50vh' }}
									pagination={pagination}
								>
									<tbody>
										<tr className="table-light">
											<td colSpan="100%" className="text-capitalize">
												Importing {array?.length} {table.replaceAll('_dbid_', '').replaceAll('_', ' ')} records
											</td>
										</tr>
										<tr>
											<td></td>
											{headerKeys.map((key, index) => (
												<td key={key}>
													<Form.Check
														type="radio"
														name={index + 1}
														value="1"
														label={t('global:do-not-import.translation')}
														onChange={onChangeRadioButton(key)}
													/>
													<Form.Check
														type="radio"
														name={index + 1}
														value="2"
														defaultChecked
														label={t('global:to-existing-field.translation')}
														onChange={onChangeRadioButton(key)}
													/>
													<Form.Check
														disabled
														type="radio"
														name={index + 1}
														value="3"
														label={t('global:create-new-field.translation')}
														onChange={onChangeRadioButton(key)}
													/>
												</td>
											))}
										</tr>
										<tr>
											<td className="fw-bold">{t('global:field-type.translation')}</td>
											{fieldOptions === '3' ? (
												<React.Fragment>
													{headerKeys.map((key) => (
														<td key={key.replaceAll(' ', '_')}>
															<Form.Select size="sm">
																{Array.from(
																	new Set(fields && fields.data && fields.data.map((item) => item.field_type))
																).map((field_type, index) => {
																	if (field_type) {
																		return (
																			<option key={index} value={`${field_type}`}>
																				{field_type}
																			</option>
																		);
																	}
																})}
															</Form.Select>
														</td>
													))}
												</React.Fragment>
											) : (
												<React.Fragment>
													{headerKeys.map((key) => (
														<td key={key}></td>
													))}
												</React.Fragment>
											)}
										</tr>
										<tr>
											<td className="fw-bold">{t('global:field-labels.translation')}</td>
											{headerKeys.map((key, itration) => {
												let result = findValue(key);
												return (
													// eslint-disable-next-line react/jsx-key
													<React.Fragment>
														<td key={key}>
															{result.value === '3' && result.key === key ? (
																<Form.Control size="sm" />
															) : result.value === '2' && result.key === key ? (
																<Form.Select size="sm" defaultValue={key} onChange={onChangeSelectBox(key)}>
																	{fields.data &&
																		[{ property_name: 'select_column', label: 'Select a column' }, ...fields.data].map(
																			(value, index) => {
																				if (itration > 0 && headerKeys[itration - 1] === value.property_name) {
																					return null;
																				}
																				return (
																					<option value={value.property_name} key={index}>
																						{value.label}
																					</option>
																				);
																			}
																		)}
																</Form.Select>
															) : result.value === '1' && result.key === key ? null : null}
														</td>
													</React.Fragment>
												);
											})}
										</tr>
										{array?.slice(startPerPage, startPerPage + dataPerPage).map((item, index) => (
											<tr key={item.id}>
												<td className="fw-bold">
													{t('global:row.translation')} {startPerPage + index + 1}
												</td>
												{Object.values(item).map((val, key) => (
													<td key={key}>{val}</td>
												))}
											</tr>
										))}
									</tbody>
								</Table>
							</Container>

							<Button
								size="sm"
								className="mt-1 tango-green-button"
								onClick={() => {
									new Promise((resolve, reject) => {
										try {
											let payload = array.map((item) => {
												let newItem = { ...item };
												let removeFields = fieldOptions.filter((value) => value.value === '1');
												if (removeFields.length) {
													removeFields.forEach((e) => delete newItem[e.key]);
												}
												return newItem;
											});
											resolve(payload);
										} catch (e) {
											reject(e);
										}
									}).then(async (data) => {
										const chunkSize = 1500;
										let array = [];
										for (let i = 0; i < data.length; i += chunkSize) {
											array.push(data.slice(i, i + chunkSize));
										}
										// eslint-disable-next-line no-unreachable
										const url = `${process.env.API_URL}/importfile`;

										const notification = {
											title: 'File Import',
											message: `File imported successfully in ${table
												.replaceAll('_dbid_', '')
												.replaceAll('_', ' ')} table.`,
											show: true,
											type: 'success'
										};

										await Promise.allSettled(
											array.map(async (item) => {
												const postData = {
													table_name: table.replaceAll('_dbid_', '').replace(/-/g, '_'),
													payload: item,
													mergefield: mergeField
												};
												const config = {
													method: 'POST',
													headers: {
														Accept: 'application/json',
														'Content-Type': 'application/json',
														authorization: `Bearer ${access_token}`
													},
													body: JSON.stringify(postData)
												};
												await fetch(url, config);
											})
										)
											.then((data) => {
												// eslint-disable-next-line no-console
												console.log('data', data);
											})
											.catch((err) => {
												notification.message = err.message;
												notification.type = 'danger';
												// eslint-disable-next-line no-console
												console.log('err', err);
											});
										dispatch(showNotification(notification));
									});
								}}
							>
								{t('global:import-button.translation')}
							</Button>
							<Container fluid data-test-id="navigation" className="d-flex justify-content-end align-items-center">
								<Button
									data-test-id="previous"
									variant="link"
									style={{ color: 'var(--tango-color-light-green)' }}
									size="sm"
									className="p-0 me-1 text-decoration-none button-link"
									disabled={startPerPage < 1 ? true : false}
									onClick={(e) => {
										e.preventDefault();
										setStartPerPage((prev) => (prev - dataPerPage < 1 ? 0 : prev - dataPerPage));
									}}
								>
									{'Previous'}
								</Button>
								{' | '}
								<Button
									data-test-id="next"
									variant="link"
									style={{ color: 'var(--tango-color-light-green)' }}
									size="sm"
									className="p-0 ms-1 text-decoration-none button-link"
									disabled={false}
									onClick={(e) => {
										e.preventDefault();
										setStartPerPage((prev) => prev + dataPerPage);
									}}
								>
									{'Next'}
								</Button>
							</Container>
						</Card.Body>
					</Card>
				</Container>
			)}
		</React.Fragment>
	);
};

export default FileImportStep2;
