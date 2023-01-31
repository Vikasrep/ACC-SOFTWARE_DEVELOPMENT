import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Container, Form, ListGroup, OverlayTrigger, Tooltip, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { CardHeader, PageHeader, Icon, Loader, Breadcrumb } from '@components/core';
import { getTangoFields, getQuery, showNotification, blankQuery } from '@reducers';
import { useDispatch, useSelector } from 'react-redux';
import { headerLabel } from '@utilities';

const xs = 2;

const ReportView = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const params = useParams();
	const dispatch = useDispatch();

	const reportTable = params.table;
	const reportId = params.id;
	const reportAction = params.action;

	const newReport = {
		table_name: `${reportTable}`,
		type: 'Table',
		name: '',
		description: '',
		section: 'Common',
		sort_columns: '',
		select_columns: '',
		is_embedded_report: false,
		is_active: true
	};

	const { access_token } = useSelector((state) => state.auth.data);
	const { fields, query } = useSelector((state) => state);
	const { data } = query;

	const [addedColumns, setAddedColumns] = useState([]);
	const [optionsColumns, setOptionsColumns] = useState();
	const [removedColumns, setRemovedColumns] = useState([]);
	const [searchText, setSearchText] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [breadcrumb, setBreadcrumb] = useState();
	const [report, setReport] = useState(newReport);
	const [isInvalid, setIsInvalid] = useState(false);

	const [sortList, setSortList] = useState([{ sort_direction: '', sort_columns: '' }]);

	const refAddedColumns = useRef();
	const refColumns = useRef();
	const refRemovedColumns = useRef();

	const basePath = `/settings/application/tables/${reportTable}`;

	//fetch fields/columns for table
	useEffect(() => {
		dispatch(getTangoFields(reportTable));
		if (reportAction === 'edit') {
			dispatch(getQuery(reportTable, reportId));
			return () => {
				dispatch(blankQuery());
			};
		}
	}, [dispatch, reportTable, reportId, reportAction]);

	useEffect(() => {
		if (query.action === 'query/fetched' && reportAction === 'edit') {
			handleEditSort();
			handleEditColumn();
		}
	}, [handleEditSort, handleEditColumn, query, reportAction]);

	//set inputs
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setReport({ ...report, [name]: value });
	};

	// //remove sort row
	const removeSortList = (i) => {
		let newSortColumns = [...sortList];
		newSortColumns.splice(i, 1);
		setSortList(newSortColumns);
	};

	//add sort row
	const addSortList = () => {
		setSortList([...sortList, { sort_direction: '', sort_columns: '' }]);
	};

	//handle sort row
	const handleSortList = (i, e) => {
		let newSortColumns = [...sortList];
		newSortColumns[i][e.target.name] = e.target.value;
		setSortList(newSortColumns);

		//pushes each sorting field into sort_columns
		let result = sortList.map((a) => a.sort_columns).join(', ');
		report['sort_columns'] = result;
	};

	// handling the edit of sort columns section
	const handleEditSort = useCallback(() => {
		if (query && query?.data?.sort_columns) {
			let sortColumns = query.data.sort_columns && query.data.sort_columns.split(', ');
			sortList.shift();

			sortColumns.forEach((column) => {
				sortList.push({ sort_direction: '', sort_columns: column });
			});
		}

		let newSortColumns = [...sortList];
		setSortList(newSortColumns);
	}, [query, sortList]);

	//handling the edit of columns to display section
	const handleEditColumn = useCallback(() => {
		if (query && query?.data?.select_columns) {
			let displayColumns = query.data.select_columns.split(', ');
			addedColumns.shift();

			displayColumns.forEach((column) => {
				addedColumns.push({ key: column, label: headerLabel(column), active: '' });
			});
		}

		let newDisplayColumns = [...addedColumns];
		setAddedColumns(newDisplayColumns);
	}, [query, addedColumns]);

	// set removed-columns
	// set options-columns
	/* eslint-disable */
	useEffect(() => {
		const columnsMap = fields.data
			? fields.data
					.filter((item) => item.is_active)
					.map(({ label, property_name }) => ({
						key: property_name,
						label,
						active: false
					}))
					.sort((a, b) => a['label'].localeCompare(b['label']))
			: false;

		setRemovedColumns(columnsMap);
		setOptionsColumns(columnsMap);
	}, [fields.data, setRemovedColumns]);
	/* eslint-enable */

	useEffect(() => {
		if (reportAction === 'edit') {
			const path = `${basePath}/${reportId}`;

			setBreadcrumb(path);
			if (query.action === 'query/fetched' && fields.action === 'fields/fetched') {
				setIsLoading(false);
			}
		}

		if (reportAction === 'new') {
			if (fields.action === 'fields/fetched') {
				setIsLoading(false);
			}
		}
	}, [query, fields, basePath, reportId, reportAction]);

	return (
		<React.Fragment>
			<PageHeader breadcrumb={reportAction === 'edit' ? <Breadcrumb path={breadcrumb || basePath} /> : null} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id="report">
					<Container fluid className="d-flex justify-content-end mb-2">
						<Button
							data-test-id="cancel"
							size="sm"
							style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
							variant="light"
							className="me-1"
							onClick={() => {
								navigate(-1);
							}}
						>
							{t('global:cancel.translation')}
						</Button>
						{reportAction === 'edit' ? (
							<Button
								data-test-id="save"
								size="sm"
								className="tango-green-button"
								onClick={() => {
									console.log(sortList);
									console.log(addedColumns);
								}}
							>
								{t('global:save.translation')}
							</Button>
						) : (
							<Button
								data-test-id="save"
								size="sm"
								className="tango-green-button"
								onClick={() => {
									if (report.name && addedColumns.length > 0) {
										let result = addedColumns.map((a) => a.key).join(', ');
										report['select_columns'] = result;

										const url = `${process.env.API_URL}/reports`;
										const config = {
											method: 'POST',
											headers: {
												Accept: 'application/json',
												'Content-Type': 'application/json',
												authorization: `Bearer ${access_token}`
											},
											body: JSON.stringify(report)
										};
										return fetch(url, config)
											.then((response) => response.json())
											.then((response) => {
												const notification = {
													title: 'New Report',
													message: 'Report created successfully.',
													show: true,
													type: 'success'
												};

												if (!response.success) {
													notification.message = response.message;
													notification.type = 'danger';
												} else {
													navigate(`/settings/application/tables/${reportTable}/reports`);
												}

												dispatch(showNotification(notification));

												return true;
											});
									} else {
										setIsInvalid(true);
									}
								}}
							>
								{t('global:save.translation')}
							</Button>
						)}
					</Container>
					<Card
						data-test-id="basics"
						style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
					>
						<CardHeader label={t('global:basics.translation')} />
						<Card.Body>
							<Form.Group controlId="type" className="d-flex">
								<Col xs={xs} className="d-flex align-items-center">
									<Form.Label className="me-2 text-wrap d-inline-block">{t('global:type.translation')}</Form.Label>
								</Col>
								<Col>
									{reportAction === 'edit' ? (
										<Form.Control disabled plaintext readOnly defaultValue={data?.qytype} className="text-wrap" />
									) : (
										<Form.Control
											disabled
											plaintext
											readOnly
											defaultValue={t('global:table-report.translation')}
											name="qytype"
											size="sm"
											className="text-wrap"
										/>
									)}
								</Col>
							</Form.Group>
							<Form.Group controlId="name" className="mt-3 d-flex">
								<Col xs={xs} className="d-flex align-items-center">
									<Form.Label className="me-2 text-wrap d-inline-block">{t('global:name.translation')}</Form.Label>
								</Col>
								<Col>
									{reportAction === 'edit' ? (
										<Form.Control defaultValue={data?.qyname} className="text-wrap" size="sm" />
									) : (
										<React.Fragment>
											<Form.Control
												required
												size="sm"
												className="text-wrap"
												name="name"
												value={report.name}
												isInvalid={isInvalid}
												onChange={(e) => {
													handleInputChange(e);
													setIsInvalid(false);
												}}
											/>
											<Form.Control.Feedback type="invalid">{t('global:required.translation')}</Form.Control.Feedback>
										</React.Fragment>
									)}
								</Col>
							</Form.Group>
							<Form.Group controlId="description" className="mt-3 d-flex">
								<Col xs={xs} className="d-flex align-items-center">
									<Form.Label className="me-2 text-wrap d-inline-block">
										{t('global:description.translation')}
									</Form.Label>
								</Col>
								<Col>
									{reportAction === 'edit' ? (
										<Form.Control className="text-wrap" size="sm" defaultValue={data?.description} />
									) : (
										<Form.Control
											as="textarea"
											name="description"
											size="sm"
											value={report.description}
											rows="2"
											onChange={handleInputChange}
										/>
									)}
								</Col>
							</Form.Group>
						</Card.Body>
					</Card>
					<Card
						data-test-id="reports-and-charts-panel"
						className="mt-4"
						style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
					>
						<CardHeader label={t('global:reports-and-charts-panel.translation')} />
						<Card.Body>
							<Form.Group controlId="group-for-this-report" className="mt-3 d-flex">
								<Col xs={xs} className="d-flex align-items-center">
									<Form.Label className="me-2 text-wrap d-inline-block">
										{t('global:show-for-this-report.translation')}:
									</Form.Label>
								</Col>
								<Col>
									{reportAction === 'edit' ? (
										<Form.Check
											type="radio"
											className="text-wrap"
											defaultChecked="true"
											label={t('global:everyone.translation')}
										/>
									) : (
										<Form.Check type="radio" defaultChecked="true" label={t('global:everyone.translation')} />
									)}
								</Col>
							</Form.Group>
							<Form.Group controlId="group-for-this-report" className="mt-3 d-flex align-items-center">
								<Col xs={xs} className="d-flex align-items-center">
									<Form.Label className="me-2 text-wrap d-inline-block">
										{t('global:group-for-this-report.translation')}:
									</Form.Label>
								</Col>
								<Col>
									{reportAction === 'edit' ? (
										<Form.Control disabled defaultValue={data?.section} size="sm" className="text-wrap" />
									) : (
										<Form.Select onChange={handleInputChange} name="section" value={report.section} size="sm">
											<option value="common">{t('global:common.translation')}</option>
										</Form.Select>
									)}
								</Col>
							</Form.Group>
						</Card.Body>
					</Card>

					{/* ------------------COLUMNS TO DISPLAY------------------ */}
					<Card
						data-test-id="columns-to-display"
						className="mt-4"
						style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
					>
						<CardHeader label={t('global:columns-to-display.translation')} />
						<Card.Body className="pe-0">
							<Form.Check
								className="my-2"
								type="radio"
								defaultChecked="true"
								label={t('global:custom-columns.translation')}
							/>
							<Form.Label>{t('global:available.translation')}</Form.Label>
							<Form.Group
								controlId="search"
								className="w-100 d-flex align-items-start"
								style={{
									minHeight: '50px'
								}}
							>
								<Col xs={5} className="d-flex flex-column">
									<Form.Control
										size="sm"
										placeholder={t('global:search.translation')}
										onChange={(event) => {
											setSearchText(event.currentTarget.value);
										}}
									/>
								</Col>
							</Form.Group>
							<Container fluid className="d-flex">
								<Col xs={5} className="d-flex flex-column">
									<ListGroup
										data-test-id="removed"
										ref={refRemovedColumns}
										className="h-100 w-100"
										style={{
											minHeight: '200px',
											maxHeight: '200px',
											overflow: 'auto',
											border: '1px solid rgba(0, 0, 0, 0.125)'
										}}
									>
										{removedColumns.map(({ active, key, label }, index) => {
											if (searchText && !label.toLowerCase().includes(searchText.toLowerCase())) return null;
											return (
												<ListGroup.Item
													key={index}
													data-test-id={key}
													className="border-0"
													style={{
														background: active ? 'var(--tango-color-pink)' : 'inherit',
														color: active ? 'var(--tango-color-white)' : 'inherit',
														cursor: 'pointer'
													}}
													onClick={(event) => {
														const id = event.currentTarget.dataset['testId'];
														const cols = [...removedColumns].map((item) => {
															item.active = false;
															if (item.key === id) item.active = true;
															return item;
														});
														setRemovedColumns(cols);
													}}
												>
													{label}
												</ListGroup.Item>
											);
										})}
									</ListGroup>
								</Col>
								<Col xs={1} className="d-flex flex-column justify-content-center align-items-center">
									<OverlayTrigger placement="top" overlay={<Tooltip>{t('global:add.translation')}</Tooltip>}>
										<Button
											data-test-id="add"
											size="sm"
											className="mb-1 tango-green-button"
											onClick={() => {
												if (removedColumns.find((item) => item.active)) {
													const removed = removedColumns.map((item) => item).filter((item) => !item.active);
													const add = removedColumns.map((item) => item).filter((item) => item.active);
													const added = addedColumns.map((item) => {
														item.active = false;
														return item;
													});
													added.push(...add);
													refColumns.current.value = added.map((item) => item.key).toString();
													refColumns.current.focus();
													setRemovedColumns(removed);
													setAddedColumns(added);
												}
											}}
										>
											<Icon name="arrow-forward" />
										</Button>
									</OverlayTrigger>
									<OverlayTrigger
										data-test-id="remove"
										placement="top"
										overlay={<Tooltip>{t('global:remove.translation')}</Tooltip>}
									>
										<Button
											size="sm"
											className="mt-1 tango-green-button"
											onClick={() => {
												if (addedColumns.find((item) => item.active)) {
													const added = addedColumns.map((item) => item).filter((item) => !item.active);
													const remove = addedColumns.map((item) => item).filter((item) => item.active);
													const removed = removedColumns.map((item) => {
														item.active = false;
														return item;
													});
													removed.push(...remove);
													removed.sort((a, b) => a['key'].localeCompare(b['key']));
													refColumns.current.value = added.map((item) => item.key).toString();
													refColumns.current.focus();
													setRemovedColumns(removed);
													setAddedColumns(added);
												}
											}}
										>
											<Icon name="arrow-back" />
										</Button>
									</OverlayTrigger>
								</Col>
								<Col xs={5} className="d-flex flex-column">
									<ListGroup
										ref={refAddedColumns}
										data-test-id="added"
										className="h-100 w-100"
										style={{
											minHeight: '200px',
											maxHeight: '200px',
											overflow: 'auto',
											border: '1px solid rgba(0, 0, 0, 0.125)',
											borderColor:
												refColumns.current && refColumns.current.classList.contains('is-invalid')
													? 'var(--bs-danger)'
													: 'rgba(0, 0, 0, 0.125)'
										}}
									>
										{addedColumns.map(({ active, key, label }, index) => (
											<ListGroup.Item
												key={index}
												data-test-id={key}
												className="border-0"
												style={{
													background: active ? 'var(--tango-color-pink)' : 'inherit',
													color: active ? 'var(--tango-color-white)' : 'inherit'
												}}
												onClick={(event) => {
													const id = event.currentTarget.dataset['testId'];
													const cols = [...addedColumns].map((item) => {
														item.active = false;
														if (item.key === id) item.active = true;
														return item;
													});
													setAddedColumns(cols);
												}}
											>
												{label}
											</ListGroup.Item>
										))}
									</ListGroup>
									<Form.Group controlId="columns" className="w-100 d-flex justify-content-start">
										<Form.Control
											required
											ref={refColumns}
											style={{
												position: 'absolute',
												left: '-100px',
												width: '0'
											}}
											isInvalid={isInvalid}
											onChange={() => {
												setIsInvalid(false);
											}}
										/>
										<Form.Control.Feedback type="invalid">{t('global:required.translation')}</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col xs={1} className="d-flex flex-column justify-content-center align-items-center">
									<OverlayTrigger placement="top" overlay={<Tooltip>{t('global:top.translation')}</Tooltip>}>
										<Button
											data-test-id="top"
											size="sm"
											className="tango-green-button"
											onClick={() => {
												const active = addedColumns.map((item) => item).filter((item) => item.active);
												const inactive = addedColumns.map((item) => item).filter((item) => !item.active);
												active.push(...inactive);
												setAddedColumns([...active]);
											}}
										>
											<Icon name="first-page" style={{ transform: 'rotate(90deg)' }} />
										</Button>
									</OverlayTrigger>
									<OverlayTrigger placement="top" overlay={<Tooltip>{t('global:up.translation')}</Tooltip>}>
										<Button
											data-test-id="up"
											size="sm"
											className="mt-1 tango-green-button"
											onClick={() => {
												const active = addedColumns.map((item) => item).filter((item) => item.active);
												const inactive = addedColumns.map((item) => item).filter((item) => !item.active);
												const index = addedColumns.map((item) => item).findIndex((item) => item.active);
												if (index > 0) {
													inactive.splice(index - 1, 0, ...active);
													setAddedColumns([...inactive]);
												}
											}}
										>
											<Icon name="navigate-before" style={{ transform: 'rotate(90deg)' }} />
										</Button>
									</OverlayTrigger>
									<OverlayTrigger placement="top" overlay={<Tooltip>{t('global:down.translation')}</Tooltip>}>
										<Button
											data-test-id="down"
											size="sm"
											className="mt-3 tango-green-button"
											onClick={() => {
												const active = addedColumns.map((item) => item).filter((item) => item.active);
												const inactive = addedColumns.map((item) => item).filter((item) => !item.active);
												const index =
													addedColumns.map((item) => item).findIndex((item) => item.key === active[0].key) + 1;
												inactive.splice(index, 0, ...active);
												setAddedColumns([...inactive]);
											}}
										>
											<Icon name="navigate-next" style={{ transform: 'rotate(90deg)' }} />
										</Button>
									</OverlayTrigger>
									<OverlayTrigger placement="top" overlay={<Tooltip>{t('global:bottom.translation')}</Tooltip>}>
										<Button
											data-test-id="bottom"
											size="sm"
											className="mt-1 tango-green-button"
											onClick={() => {
												const active = addedColumns.map((item) => item).filter((item) => item.active);
												const inactive = addedColumns.map((item) => item).filter((item) => !item.active);
												inactive.push(...active);
												setAddedColumns([...inactive]);
											}}
										>
											<Icon name="last-page" style={{ transform: 'rotate(90deg)' }} />
										</Button>
									</OverlayTrigger>
								</Col>
							</Container>
						</Card.Body>
					</Card>

					{/* ------------------END OF COLUMNS TO DISPLAY------------------ */}

					<Card
						data-test-id="sorting-and-grouping"
						className="mt-4"
						style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
					>
						<CardHeader label={t('global:sorting-and-grouping.translation')} />
						<Card.Body>
							<Form.Group data-test-id="sort-and-group" className="mt-3 d-flex">
								<Col xs={xs} className="d-flex">
									<Form.Label className="me-2 text-wrap d-inline-block">
										{t('global:sort-and-group.translation')}
									</Form.Label>
								</Col>
								<Col>
									<React.Fragment>
										{reportAction === 'edit' ? (
											<Form.Check>
												<Form.Check.Input type="radio" name="radio" defaultChecked />
												<Form.Check.Label className="ms-1 mb-2">
													{t('global:sort-or-group.translation')}
												</Form.Check.Label>
											</Form.Check>
										) : (
											<Row className="d-flex">
												<Form.Check>
													<Form.Check.Input type="radio" name="radio" defaultChecked />
													<Form.Check.Label className="ms-1 mb-2">
														{t('global:sort-or-group.translation')}
													</Form.Check.Label>
												</Form.Check>
											</Row>
										)}
										{sortList.map((element, index) => (
											<Row className="ms-2" key={index}>
												{index ? (
													<Col xs={1} className="d-flex justify-content-end align-items-center mb-2">
														<Form.Label className="text-wrap">{t('global:then.translation')}</Form.Label>
													</Col>
												) : null}
												<Col>
													<Form.Select id="sort-direction" className="mb-2" name="sort_direction" size="sm" disabled>
														<option value="">{t('global:select-a-direction.translation')}</option>
														<option value="asc">{t('global:ascending.translation')}</option>
														<option value="desc">{t('global:descending.translation')}</option>
													</Form.Select>
												</Col>
												{reportAction === 'edit' ? (
													<React.Fragment>
														<Col>
															<Form.Select
																size="sm"
																id="sort-column"
																name="sort_columns"
																onChange={(e) => handleSortList(index, e)}
																value={element.sort_columns}
															>
																<option value="">{t('global:select-a-field.translation')}</option>
																{optionsColumns &&
																	optionsColumns.map((item, index) => (
																		<option key={index} value={item.key}>
																			{item.label}
																		</option>
																	))}
															</Form.Select>
														</Col>

														<Col>
															<Button className="me-2 mt-1 tango-green-button" size="sm" onClick={() => addSortList()}>
																+
															</Button>
															{index ? (
																<Button
																	variant="danger"
																	className="mt-1"
																	size="sm"
																	style={{ borderRadius: '5px', border: 'none' }}
																	onClick={() => removeSortList(index)}
																>
																	x
																</Button>
															) : null}
														</Col>
													</React.Fragment>
												) : (
													<React.Fragment>
														<Col>
															<Form.Select
																size="sm"
																id="sort-column"
																name="sort_columns"
																onChange={(e) => handleSortList(index, e)}
																value={element.sort_columns}
															>
																<option value="">{t('global:select-a-field.translation')}</option>
																{optionsColumns &&
																	optionsColumns.map((item, index) => (
																		<option key={index} value={item.key}>
																			{item.label}
																		</option>
																	))}
															</Form.Select>
														</Col>

														<Col>
															<Button className="me-2 mt-1 tango-green-button" size="sm" onClick={() => addSortList()}>
																+
															</Button>
															{index ? (
																<Button
																	variant="danger"
																	style={{ borderRadius: '5px', border: 'none' }}
																	className="mt-1"
																	size="sm"
																	onClick={() => removeSortList(index)}
																>
																	x
																</Button>
															) : null}
														</Col>
													</React.Fragment>
												)}
											</Row>
										))}
									</React.Fragment>
								</Col>
							</Form.Group>
						</Card.Body>
					</Card>
				</Container>
			)}
		</React.Fragment>
	);
};

export default ReportView;
