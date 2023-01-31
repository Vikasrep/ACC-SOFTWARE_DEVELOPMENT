/* eslint-disable indent */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader, Loader, Breadcrumb, CardHeader, UserDropDown } from '@components/core';
import { getField, blankField, showNotification } from '@reducers';
import { Container, Card, Form, Button, Col, Table } from 'react-bootstrap';
import DeleteField from './delete-field';

const FieldView = () => {
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { access_token } = useSelector((state) => state.auth.data);
	const { data: FieldTypes, action } = useSelector((state) => state.field);

	const [isLoading, setIsLoading] = useState(true);
	const [breadcrumb, setBreadcrumb] = useState();
	const [fieldData, setFieldData] = useState();

	const [input, setInput] = useState('');
	const [unique, setUnique] = useState('');

	const report = useSelector((state) => state.fieldsTable);

	const [metadata, setMetadata] = useState();
	const [data, setData] = useState({});
	const [rowIndex, setRowIndex] = useState();

	const [rows, setRows] = useState();
	const [navigation, setNavigation] = useState();

	const paramsTable = params.table;
	const paramsId = params.id;

	const xs = 2;

	const basePath = `/settings/application/tables/${paramsTable}/fields`;

	useEffect(() => {
		setData(FieldTypes);
	}, [FieldTypes]);

	useEffect(() => {
		dispatch(getField(paramsTable, paramsId));
		return async () => {
			await dispatch(blankField());
		};
	}, [dispatch, paramsTable, paramsId]);

	useEffect(() => {
		if (action === 'field/fetched') {
			setIsLoading(false);
		}
		const path = `${basePath}/${paramsId}`;

		setBreadcrumb(path);

		if (data?.unique === true) {
			setUnique(true);
		}
	}, [basePath, paramsId, data?.unique, action]);

	const handleChange = (e) => {
		const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		const name = e.target.name;

		if (value) {
			setFieldData((prev) => ({ ...prev, [name]: value }));
		}
	};

	// set metadata, rows
	useEffect(() => {
		if (report.data) {
			setMetadata(report.metadata);
			setRows(report.data);
		}
	}, [report]);

	// set row-index or navigate to (previous/next) record
	useEffect(() => {
		if (data && rows) {
			const index = rows.findIndex((item) => item.field_id === parseInt(paramsId || 0));
			if (rowIndex && index === -1) {
				navigate(`${basePath}/${paramsId}`);
			} else {
				setRowIndex(index);
			}
		}
	}, [navigate, basePath, data, rowIndex, rows, paramsId]);

	// navigation
	useEffect(() => {
		if (navigation) {
			setIsLoading(true);
			if (navigation === 'return') {
				navigate(basePath);
			} else {
				const num = navigation === 'next' ? 1 : -1;
				const found = rows[parseInt(rowIndex) + parseInt(num)];
				const rid = found ? found.field_id : paramsId;
				const url = `${basePath}/${rid}`;
				setNavigation();
				navigate(url);
			}
		}
	}, [navigate, basePath, navigation, rowIndex, rows, paramsId]);

	const NavigationChange = () => (
		<Container fluid data-test-id="navigation" className="d-flex justify-content-end align-items-center my-2">
			<Button
				data-test-id="previous"
				variant="link"
				style={{ color: 'var(--tango-color-light-green)' }}
				size="sm"
				className="p-0 me-1 text-decoration-none button-link"
				disabled={(rowIndex === 0 && parseInt(metadata.page_index, 10) === 1) || (rows?.length || 0) === 1}
				onClick={() => {
					setNavigation('previous');
				}}
			>
				{t('global:previous.translation') || 'Previous'}
			</Button>
			{' | '}
			<Button
				data-test-id="return"
				variant="link"
				style={{ color: 'var(--tango-color-light-green)' }}
				size="sm"
				className="p-0 mx-1 text-decoration-none button-link"
				disabled={false}
				onClick={() => {
					setNavigation('return');
				}}
			>
				{t('global:return.translation') || 'Return'}
			</Button>
			{' | '}
			<Button
				data-test-id="next"
				variant="link"
				style={{ color: 'var(--tango-color-light-green)' }}
				size="sm"
				className="p-0 ms-1 text-decoration-none button-link"
				disabled={
					(rowIndex === (rows?.length || 0) - 1 && rowIndex === Math.ceil(metadata.total_rows / metadata.page_size)) ||
					(rows?.length || 0) === 1
				}
				onClick={() => {
					setNavigation('next');
				}}
			>
				{t('global:next.translation') || 'Next'}
			</Button>
		</Container>
	);

	return (
		<React.Fragment>
			<PageHeader breadcrumb={<Breadcrumb path={breadcrumb || basePath} />} actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id="field">
					<Container fluid className="d-flex justify-content-end mb-2">
						<Button
							data-test-id="save"
							size="sm"
							className="tango-green-button me-2"
							onClick={async () => {
								const url = `${process.env.API_URL}/v2/fields/${paramsTable}/${paramsId}`;
								const config = {
									method: 'PATCH',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
										authorization: `Bearer ${access_token}`
									},
									body: JSON.stringify(fieldData)
								};

								const response = await fetch(url, config);
								const response_1 = await response.json();
								const notification = {
									title: 'Field Updated',
									message: 'Field updated successfully.',
									show: true,
									type: 'success'
								};
								if (!response_1.success) {
									notification.message = response_1.message;
									notification.type = 'danger';
								}
								dispatch(showNotification(notification));
								dispatch(getField(paramsTable, paramsId));
								return true;
							}}
						>
							{t('global:save.translation')}
						</Button>
						<Button
							data-test-id="cancel"
							size="sm"
							variant="light"
							style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
							className="me-2"
							onClick={() => {
								navigate(basePath);
							}}
						>
							{t('global:cancel.translation')}
						</Button>
						<DeleteField />
					</Container>

					{NavigationChange()}
					{/* BASICS SECTION */}
					<Card
						data-test-id="basics"
						style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
					>
						<CardHeader label={t('global:basics.translation')} />
						<Card.Body>
							{data?.label && (
								<Form.Group controlId="label" className="d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:label.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Control
											defaultValue={data?.label}
											name="label"
											className="text-wrap"
											size="sm"
											onChange={handleChange}
										/>
									</Col>
								</Form.Group>
							)}
							{data?.field_type && (
								<Form.Group controlId="type" className="mt-3 d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:type.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Control
											disabled
											plaintext
											defaultValue={
												data?.mode ? `${data?.field_type}` + ' (' + `${data?.mode}` + ')' : data?.field_type
											}
											className="text-wrap"
											size="sm"
										/>
										{['user', 'address'].indexOf(data?.field_type) >= 0 ? null : (
											<Button
												variant="link"
												onClick={() => {
													navigate(`/settings/application/tables/${paramsTable}/fields/${paramsId}/change-field-type`);
												}}
												style={{ color: 'var(--tango-color-light-green', fontSize: '13px' }}
											>
												{t('global:change-type.translation')}
											</Button>
										)}
									</Col>
								</Form.Group>
							)}

							{['user', 'address', 'timestamp', 'dblink', 'ICalendarButton', 'vcard'].indexOf(data?.field_type) >= 0 ||
							data?.mode === 'summary' ||
							(data?.field_type === 'date' && data?.mode === 'lookup') ||
							(data?.field_type === 'numeric' && data?.mode === 'lookup') ? null : (
								<React.Fragment>
									{data?.field_type.includes('formula') ? null : (
										<Form.Group controlId="required" className="mt-3 d-flex align-items-center">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:required.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Check
													className="text-wrap"
													name="required"
													defaultChecked={data?.required === true ? true : false}
													label={t('global:must-be-filled.translation')}
													onChange={handleChange}
												/>
											</Col>
										</Form.Group>
									)}
									{[
										'checkbox',
										'url',
										'rich-text',
										'phone',
										'file',
										'text-multi-line',
										'predecessor',
										'multi-select-text',
										'list-user',
										'vcard'
									].indexOf(data?.field_type) >= 0 || data?.mode === 'lookup' ? null : (
										<Form.Group controlId="unique" className="mt-3 d-flex align-items-center">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:unique.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Check
													className="text-wrap"
													defaultChecked={data?.unique === true ? true : false}
													label={t('global:must-be-unique.translation')}
													name="unique"
													onChange={(e) => {
														handleChange(e);
														setUnique(!unique);
													}}
												/>
												{unique ? (
													<Form.Check
														className="text-wrap"
														label={t('global:check-existing-entries.translation')}
														onChange={(e) => {
															handleChange(e);
														}}
													/>
												) : null}
											</Col>
										</Form.Group>
									)}
									{data?.mode === 'lookup' ||
									data?.field_type === 'file' ||
									data?.field_type.includes('formula') ? null : (
										<Form.Group controlId="default-value" className="mt-3 d-flex align-items-center">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:default-value.translation')}
												</Form.Label>
											</Col>
											<Col>
												{data?.field_type === 'checkbox' ? (
													<Form.Check
														className="text-wrap"
														defaultChecked={data?.default_value === true ? true : false}
														label={t('global:checked.translation')}
														onChange={handleChange}
														name="default_value"
													/>
												) : data?.field_type === 'date' ? (
													<Form.Check
														className="text-wrap"
														defaultChecked={data?.default_today === true ? true : false}
														label={t('global:today.translation')}
														onChange={handleChange}
														name="default_today"
													/>
												) : data?.field_type === 'list-user' ? (
													<React.Fragment>
														{['None', 'Current user'].map((option, key) => (
															<Form.Check key={key} type="radio" label={option} name="default_value" />
														))}
													</React.Fragment>
												) : (
													<Form.Control
														defaultValue={data?.default_value}
														className="text-wrap"
														size="sm"
														name="default_value"
														onChange={handleChange}
													/>
												)}
											</Col>
										</Form.Group>
									)}
								</React.Fragment>
							)}
							<Form.Group controlId="sample-data" className="mt-3 d-flex align-items-center">
								<Col xs={xs} className="d-flex align-items-center">
									<Form.Label className="me-2 text-wrap d-inline-block">
										{t('global:sample-data.translation')}
									</Form.Label>
								</Col>
								<Col>
									<Button variant="link" size="sm" style={{ color: 'var(--tango-color-light-green' }}>
										{t('global:show.translation')}
									</Button>
								</Col>
							</Form.Group>
						</Card.Body>
					</Card>
					{/* TEXT-MULTIPLE CHOICE SECTION */}
					{['text-multiple-choice', 'text-multi-line'].indexOf(data?.field_type) >= 0 ? (
						<Card
							data-test-id="multiple-choice-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							{data?.field_type === 'text-multiple-choice' ? (
								<CardHeader label={t('global:multiple-choice-options.translation')} />
							) : (
								<CardHeader label={t('global:multi-line-options.translation')} />
							)}

							<Card.Body>
								<Form.Group controlId="input-type" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:input-type.translation')}
										</Form.Label>
									</Col>
									<Col>
										{['User input', 'From list', 'From another field'].map((option, key) => (
											<Form.Check
												inline
												key={key}
												value={key + 1}
												type="radio"
												label={option}
												name="input-types"
												onChange={(e) => {
													setInput(e.currentTarget.value);
												}}
											/>
										))}
										{input === 2 ? (
											<React.Fragment>
												<Form.Control
													as="textarea"
													rows={4}
													defaultValue={data?.choices.map((choice) => choice.choiceName.split(',')).join('\n')}
												/>
												<Form.Check
													label={t('global:allow-new-choices.translation')}
													onChange={handleChange}
													name="allow_new_choices"
													className="text-wrap"
													defaultChecked={data?.allow_new_choices === true ? true : false}
												/>
												<Form.Select size="sm">
													<option value="1">{t('global:display-choices-here.translation')}</option>
													<option value="0">{t('global:display-choices-alph.translation')}</option>
												</Form.Select>
											</React.Fragment>
										) : input === 3 ? (
											<Button className="tango-green-button" size="sm">
												{t('global:select-shared-field.translation')}
											</Button>
										) : null}
									</Col>
								</Form.Group>
								<Form.Group controlId="log-entries" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:log-entries.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											label={t('global:log-edits.translation')}
											onChange={handleChange}
											name="append_only"
											defaultChecked={data?.append_only === true ? true : false}
										/>
										<Form.Label className="small text-muted text-wrap">
											{t('global:log-edits-note.translation')}
										</Form.Label>
										{data?.append_only === true ? (
											<React.Fragment>
												<Col className="ms-4 mt-1">
													<Form.Check
														type="radio"
														name="show-name"
														label="Show the name and date on the same line as the entry"
													/>
													<Form.Check type="radio" name="show-name" label="Show the name and date on their own line" />
												</Col>
												<Col className="ms-4 mt-3">
													<Form.Check label="Show new entries at the bottom of the field" />
													<Form.Check label="Show full names instead of user names" />
													<Form.Check label="Show the time in addition to the date" />
													<Form.Check label="Show the time zone in addition to the time" />
												</Col>
											</React.Fragment>
										) : null}
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* TEXT SECTION */}
					{data?.field_type === 'multi-select-text' || (data?.field_type === 'text' && data?.mode === null) ? (
						<Card
							data-test-id="text-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							{data?.field_type === 'multi-select-text' ? (
								<CardHeader label={t('global:multi-select-text-options.translation')} />
							) : (
								<CardHeader label={t('global:text-field-options.translation')} />
							)}
							<Card.Body>
								<Form.Group controlId="input-type" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:input-type.translation')}
										</Form.Label>
									</Col>
									<Col>
										{['User input', 'From list', 'From another field'].map((option, key) => (
											<Form.Check inline key={key} value={key + 1} type="radio" label={option} name="input-types" />
										))}
										<React.Fragment>
											<Form.Control
												as="textarea"
												rows={4}
												defaultValue={data?.choices.map((choice) => choice.choiceName.split(',')).join('\n')}
											/>
											<Form.Check
												label={t('global:allow-new-choices.translation')}
												onChange={handleChange}
												name="allow_new_choices"
												className="text-wrap mt-1"
												defaultChecked={data?.allow_new_choices === true ? true : false}
											/>
											<Form.Select size="sm" className="mt-3">
												<option value="1">{t('global:display-choices-here.translation')}</option>
												<option value="0">{t('global:display-choices-alph.translation')}</option>
											</Form.Select>
										</React.Fragment>
									</Col>
								</Form.Group>
								{data?.field_type === 'multi-select-text' ? null : (
									<Form.Group controlId="log-entries" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:log-entries.translation')}
											</Form.Label>
										</Col>
										<Col>
											<Form.Check
												className="text-wrap"
												label={t('global:log-edits.translation')}
												onChange={handleChange}
												name="append_only"
												defaultChecked={data?.append_only === true ? true : false}
											/>
											<Form.Label className="small text-muted text-wrap">
												{t('global:log-edits-note.translation')}
											</Form.Label>
											{data?.append_only === true ? (
												<React.Fragment>
													<Col className="ms-4 mt-1">
														<Form.Check
															type="radio"
															name="show-name"
															label="Show the name and date on the same line as the entry"
														/>
														<Form.Check
															type="radio"
															name="show-name"
															label="Show the name and date on their own line"
														/>
													</Col>
													<Col className="ms-4 mt-3">
														<Form.Check label="Show new entries at the bottom of the field" />
														<Form.Check label="Show full names instead of user names" />
														<Form.Check label="Show the time in addition to the date" />
														<Form.Check label="Show the time zone in addition to the time" />
													</Col>
												</React.Fragment>
											) : null}
										</Col>
									</Form.Group>
								)}
							</Card.Body>
						</Card>
					) : null}
					{/* CURRENCY SECTION */}
					{['numeric-percent', 'percent', 'currency', 'numeric-rating (0-5)', 'numeric-currency'].indexOf(
						data?.field_type
					) >= 0 ? (
						<Card
							data-test-id="currency-percent-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							{['numeric-currency', 'currency'].indexOf(data?.field_type) >= 0 ? (
								<CardHeader label={t('global:currency-field-options.translation')} />
							) : ['numeric-percent', 'percent'].indexOf(data?.field_type) >= 0 ? (
								<CardHeader label={t('global:percent-field-options.translation')} />
							) : (
								<CardHeader label={t('global:rating-field-options.translation')} />
							)}
							<Card.Body>
								{data?.mode === 'summary' ? null : (
									<Form.Group controlId="input-type" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:input-type.translation')}
											</Form.Label>
										</Col>
										<Col>
											{['User input', 'From list', 'From another field'].map((option, key) => (
												<Form.Check inline key={key} value={key + 1} type="radio" label={option} name="input-types" />
											))}
											<React.Fragment>
												<Form.Control
													as="textarea"
													rows={4}
													defaultValue={data?.choices?.map((choice) => choice.choiceName.split(',')).join('\n')}
													onChange={handleChange}
													name="choices"
												/>
												<Form.Check
													label={t('global:allow-new-choices.translation')}
													className="text-wrap mb-3"
													onChange={handleChange}
													name="allow_new_choices"
													defaultChecked={data?.allow_new_choices === true ? true : false}
												/>
											</React.Fragment>
										</Col>
									</Form.Group>
								)}
								<Form.Group controlId="units-description" className="d-flex mt-3 align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:units-description.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Control className="text-wrap" size="sm" />
										<Form.Label className="small text-muted text-wrap">
											{t('global:units-description-note.translation')}
										</Form.Label>
									</Col>
								</Form.Group>
								<Form.Group controlId="sort-order" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:sort-order.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select
											className="text-wrap"
											size="sm"
											defaultValue={data?.sort_as_given === true ? 1 : 0}
											onChange={handleChange}
											name="sort_as_given"
										>
											<option value="1">{t('global:ascending.translation')}</option>
											<option value="0">{t('global:descending.translation')}</option>
										</Form.Select>
									</Col>
								</Form.Group>
								<Form.Group controlId="blank" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:blank.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.blank_is_zero === true ? true : false}
											label={t('global:blank-option.translation')}
											onChange={handleChange}
											name="blank_is_zero"
										/>
									</Col>
								</Form.Group>
								<Form.Group controlId="totals-and-averages" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:totals-and-averages.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.does_total === true ? true : false}
											label={t('global:totals-option-1.translation')}
											onChange={handleChange}
											name="does_total"
										/>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.does_average === true ? true : false}
											label={t('global:totals-option-2.translation')}
											onChange={handleChange}
											name="does_average"
										/>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* NUMERIC/FLOAT SECTION */}
					{data?.field_type === 'numeric' ? (
						<Card
							data-test-id="numeric-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:numeric-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="units-description" className="d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:units-description.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Control className="text-wrap" size="sm" />
										<Form.Label className="small text-muted text-wrap">
											{t('global:units-description-note.translation')}
										</Form.Label>
									</Col>
								</Form.Group>
								<Form.Group controlId="sort-order" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:sort-order.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select
											className="text-wrap"
											size="sm"
											defaultValue={data?.sort_as_given === true ? 1 : 0}
											onChange={handleChange}
											name="sort_as_given"
										>
											<option value="1">{t('global:ascending.translation')}</option>
											<option value="0">{t('global:descending.translation')}</option>
										</Form.Select>
									</Col>
								</Form.Group>
								<Form.Group controlId="blank" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:blank.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.blank_is_zero === true ? true : false}
											label={t('global:blank-option.translation')}
											onChange={handleChange}
											name="blank_is_zero"
										/>
									</Col>
								</Form.Group>
								<Form.Group controlId="totals-and-averages" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:totals-and-averages.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.does_total === true ? true : false}
											label={t('global:totals-option-1.translation')}
											onChange={handleChange}
											name="does_total"
										/>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.does_average === true ? true : false}
											label={t('global:totals-option-2.translation')}
											onChange={handleChange}
											name="does_average"
										/>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* CHECKBOX SECTION */}
					{data?.field_type === 'checkbox' ? (
						<Card
							data-test-id="checkbox-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:checkbox-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="totals" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:totals.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.default_value === true ? true : false}
											label={t('global:totals-option.translation')}
											onChange={handleChange}
											name="default_value"
										/>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* ICalendarButton SECTION */}
					{data?.field_type === 'ICalendarButton' ? (
						<Card
							data-test-id="icalendar-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:icalendar-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="field-mapping" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:field-mapping.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Table bordered size="sm">
											<thead>
												<tr>
													<th>{t('global:this-ical-field.translation')}</th>
													<th>{t('global:maps-to-tango-field.translation')}</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>
														{t('global:subject.translation')}{' '}
														<Form.Text className="me-1 text-danger" style={{ cursor: 'default' }}>
															*
														</Form.Text>
													</td>
													<td>
														<Form.Select size="sm">
															<option value="">{t('global:select-a-field.translation')}</option>
														</Form.Select>
													</td>
												</tr>
												<tr>
													<td>{t('global:description.translation')}</td>
													<td>
														<Form.Select size="sm">
															<option value="">{t('global:select-a-field.translation')}</option>
														</Form.Select>
													</td>
												</tr>
												<tr>
													<td>{t('global:location.translation')}</td>
													<td>
														<Form.Select size="sm">
															<option value="">{t('global:select-a-field.translation')}</option>
														</Form.Select>
													</td>
												</tr>
												<tr>
													<td>
														{t('global:starting-time.translation')}{' '}
														<Form.Text className="me-1 text-danger" style={{ cursor: 'default' }}>
															*
														</Form.Text>
													</td>
													<td>
														<Form.Select size="sm">
															<option value="">{t('global:select-a-field.translation')}</option>
														</Form.Select>
													</td>
												</tr>
												<tr>
													<td>
														{t('global:end-time.translation')}{' '}
														<Form.Text className="me-1 text-danger" style={{ cursor: 'default' }}>
															*
														</Form.Text>
													</td>
													<td>
														<Form.Select size="sm">
															<option value="">{t('global:select-a-field.translation')}</option>
														</Form.Select>
													</td>
												</tr>
											</tbody>
										</Table>
										<Form.Text className="text-danger">* {t('global:required-fields.translation')}</Form.Text>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* VCARD SECTION */}
					{data?.field_type === 'vcard' ? (
						<Card
							data-test-id="vcard-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:vcard-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="field-mapping" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:field-mapping.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Table bordered size="sm">
											<thead>
												<tr>
													<th>{t('global:this-vcard-field.translation')}</th>
													<th>{t('global:maps-to-tango-field.translation')}</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>
														{t('global:name.translation')}{' '}
														<Form.Text className="me-1 text-danger" style={{ cursor: 'default' }}>
															*
														</Form.Text>
													</td>
													<td>
														<Form.Select size="sm">
															<option value="">{t('global:select-a-field.translation')}</option>
														</Form.Select>
													</td>
												</tr>
												<tr>
													<td>{t('global:email.translation')}</td>
													<td>
														<Form.Select size="sm">
															<option value="">{t('global:select-a-field.translation')}</option>
														</Form.Select>
													</td>
												</tr>
											</tbody>
										</Table>
										<Form.Text className="text-danger">* {t('global:required-fields.translation')}</Form.Text>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* RICH TEXT SECTION */}
					{data?.field_type === 'rich-text' ? (
						<Card
							data-test-id="checkbox-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:checkbox-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="log-entries" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:log-entries.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											label={t('global:log-edits.translation')}
											onChange={handleChange}
											name="append_only"
											defaultChecked={data?.append_only === true ? true : false}
										/>
										<Form.Label className="small text-muted text-wrap">
											{t('global:log-edits-note.translation')}
										</Form.Label>
										{data?.append_only === true ? (
											<React.Fragment>
												<Col className="ms-4 mt-1">
													<Form.Check
														type="radio"
														name="show-name"
														label="Show the name and date on the same line as the entry"
													/>
													<Form.Check type="radio" name="show-name" label="Show the name and date on their own line" />
												</Col>
												<Col className="ms-4 mt-3">
													<Form.Check label="Show new entries at the bottom of the field" />
													<Form.Check label="Show full names instead of user names" />
													<Form.Check label="Show the time in addition to the date" />
													<Form.Check label="Show the time zone in addition to the time" />
												</Col>
											</React.Fragment>
										) : null}
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* PHONE SECTION */}
					{data?.field_type === 'phone' ? (
						<Card
							data-test-id="phone-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:phone-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="extensions" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:extensions.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check className="text-wrap" label={t('global:phone-includes-extension.translation')} />
									</Col>
								</Form.Group>
								<Form.Group controlId="international" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:international.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check className="text-wrap" label={t('global:phone-is-international.translation')} />
									</Col>
								</Form.Group>
								<Form.Group controlId="default-country" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:default-country.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select className="text-wrap" size="sm">
											<option value="1">US</option>
											<option value="0">Other</option>
										</Form.Select>
										<Form.Label className="small text-muted text-wrap">
											{t('global:default-country-note.translation')}
										</Form.Label>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* TIMESTAMP SECTION */}
					{data?.field_type === 'timestamp' ? (
						<Card
							data-test-id="timestamp-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:timestamp-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="sort-order" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:sort-order.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select
											className="text-wrap"
											size="sm"
											defaultValue={data?.sort_as_given === true ? 1 : 0}
											onChange={handleChange}
											name="sort_as_given"
										>
											<option value="1">{t('global:ascending.translation')}</option>
											<option value="0">{t('global:descending.translation')}</option>
										</Form.Select>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* PREDECESSOR SECTION */}
					{data?.field_type === 'predecessor' ? (
						<Card
							data-test-id="predecessor-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:predecessor-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="start-date" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:start-date-field.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select className="text-wrap" size="sm">
											<option value="">{t('global:select-a-field.translation')}</option>
										</Form.Select>
									</Col>
								</Form.Group>
								<Form.Group controlId="end-date" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:end-date-field.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select className="text-wrap" size="sm">
											<option value="">{t('global:select-a-field.translation')}</option>
										</Form.Select>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* REPORT LINK FIELD OPTIONS SECTION */}
					{data?.field_type === 'dblink' ? (
						<Card
							data-test-id="report-link-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:report-link-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="field-relationship" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:field-relationship.translation')}
										</Form.Label>
									</Col>
								</Form.Group>
								<Form.Group controlId="value-matching" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:value-matching.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.exact === true ? true : false}
											label={t('global:value-matching-option.translation')}
											onChange={handleChange}
											name="exact"
										/>
									</Col>
								</Form.Group>
								<Form.Group controlId="link-behavior" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:link-behavior.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.use_new_window === true ? true : false}
											label={t('global:link-behavior-option.translation')}
											onChange={handleChange}
											name="use_new_window"
										/>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* FILE FIELD OPTIONS SECTION */}
					{data?.field_type === 'file' ? (
						<Card
							data-test-id="file-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:file-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="revisions" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:revisions.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											type="radio"
											name="revisions"
											className="text-wrap"
											label={t('global:keep-all-revisions.translation')}
										/>
										<Container fluid className="d-flex align-items-center">
											<Form.Check
												name="revisions"
												type="radio"
												className="text-wrap me-1"
												label={t('global:keep-the-last.translation')}
											/>
											<Form.Control className="text-wrap" style={{ width: '50px' }} size="sm" />
										</Container>
										<Form.Label className="small text-muted text-wrap">
											{t('global:revisions-radio-note.translation')}
										</Form.Label>
										<Form.Check className="text-wrap" label={t('global:revisions-check-option.translation')} />
									</Col>
								</Form.Group>
								<Form.Group controlId="link-behavior" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:link-behavior.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check className="text-wrap" label={t('global:file-link-behavior.translation')} />
									</Col>
								</Form.Group>
								<Form.Group controlId="allow-access" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:allow-open-access.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check className="text-wrap" label={t('global:allow-open-access-option.translation')} />
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* DURATION SECTION */}
					{data?.field_type === 'duration' ? (
						<Card
							data-test-id="duration-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:duration-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="totals-and-averages" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:totals-and-averages.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.does_total === true ? true : false}
											label={t('global:totals-option-1.translation')}
											onChange={handleChange}
											name="does_total"
										/>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.does_average === true ? true : false}
											label={t('global:totals-option-2.translation')}
											onChange={handleChange}
											name="does_average"
										/>
									</Col>
								</Form.Group>
								<Form.Group controlId="formula" className="mt-3 d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:formula.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Control
											defaultValue={data?.formula}
											className="text-wrap"
											size="sm"
											onChange={handleChange}
											name="formula"
										/>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* FORMULA SECTIONS */}
					{data?.field_type.includes('formula') ? (
						<Card
							data-test-id="formula-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:formula-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="formula" className="mt-3 d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:formula.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Control
											defaultValue={data?.formula}
											className="text-wrap"
											size="sm"
											onChange={handleChange}
											name="formula"
										/>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* DATE SECTION */}
					{data?.field_type === 'date' ? (
						<Card
							data-test-id="date-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:date-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="sort-order" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:sort-order.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select
											className="text-wrap"
											size="sm"
											defaultValue={data?.sort_as_given === true ? 1 : 0}
											onChange={handleChange}
											name="sort_as_given"
										>
											<option value="1">{t('global:ascending.translation')}</option>
											<option value="0">{t('global:descending.translation')}</option>
										</Form.Select>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* EMAIL SECTION */}
					{data?.field_type === 'email' ? (
						<Card
							data-test-id="email-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:email-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="default-domain" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:default-domain.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Control size="sm" />
									</Col>
								</Form.Group>
								<Form.Group controlId="sort-order" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:sort-order.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check label={t('global:sort-by-domain.translation')} />
									</Col>
								</Form.Group>
								<Form.Group controlId="email-all" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:email-all.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check label={t('global:email-all-choice.translation')} />
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* LIST-USER SECTION */}
					{data?.field_type === 'list-user' ? (
						<Card
							data-test-id="list-user-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:list-user-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="choices" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:choices.translation')}</Form.Label>
									</Col>
									<Col>
										<React.Fragment>
											{['Default user set', 'Custom user set'].map((option, key) => (
												<Form.Check key={key} type="radio" label={option} name="choices" />
											))}
										</React.Fragment>
										<Form.Check
											label={t('global:allow-new-choices.translation')}
											onChange={handleChange}
											name="allow_new_choices"
											className="text-wrap mt-3"
											defaultChecked={data?.allow_new_choices === true ? true : false}
										/>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* ADDRESS SECTION */}
					{data?.field_type === 'address' ? (
						<Card
							data-test-id="address-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:address-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="format" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:format.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Select className="text-wrap" size="sm">
											<option value="1">International</option>
											<option value="0">United States</option>
										</Form.Select>
									</Col>
								</Form.Group>
								<Form.Group controlId="countries" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:countries.translation')}
										</Form.Label>
									</Col>
								</Form.Group>
								<Form.Group controlId="states" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:states.translation')}</Form.Label>
									</Col>
								</Form.Group>
								<Form.Group controlId="width-box" className="mt-3 d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:width-of-box.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Control
											defaultValue={data?.width}
											className="text-wrap"
											size="sm"
											onChange={handleChange}
											name="width"
										/>
									</Col>
								</Form.Group>
								<Form.Group controlId="map-type" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:map-type.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select className="text-wrap" size="sm">
											<option value="0">Road</option>
											<option value="1">Satellite</option>
											<option value="2">Hybrid</option>
											<option value="3">Terrain</option>
										</Form.Select>
										<Form.Label className="small text-muted text-wrap">
											{t('global:map-type-note.translation')}
										</Form.Label>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* LOOKUP SECTION */}
					{data?.mode === 'lookup' ? (
						<Card
							data-test-id="lookup-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:lookup-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="reference-field" className="mt-3 d-flex flex-wrap align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:reference-field.translation')}
										</Form.Label>
										<Form.Label className="me-2 text-wrap small">{t('global:in-this-table.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Select className="text-wrap" size="sm">
											<option value="0">Select a field</option>
										</Form.Select>
									</Col>
								</Form.Group>
								<Form.Group controlId="value-field" className="mt-3 d-flex flex-wrap align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:value-field.translation')}
										</Form.Label>
										<Form.Label className="me-2 text-wrap small">
											{t('global:in-the-foreign-table.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select className="text-wrap" size="sm">
											<option value="0">{t('global:select-a-field.translation')}</option>
										</Form.Select>
									</Col>
								</Form.Group>
								<Form.Group controlId="lookup-options" className="mt-3 d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:lookup-options.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.does_total === true ? true : false}
											onChange={handleChange}
											name="does_total"
											label={t('global:lookup-options-option.translation')}
										/>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* SUMMARY FIELD OPTIONS SECTION */}
					{data?.mode === 'summary' ? (
						<Card
							data-test-id="summary-field-options"
							className="mt-4"
							style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
						>
							<CardHeader label={t('global:summary-field-options.translation')} />
							<Card.Body>
								<Form.Group controlId="field-to-summarize" className="mt-3 d-flex flex-wrap align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:field-to-summarize.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Label className="small">{t('global:drilldown-behavior-note.translation')}</Form.Label>
										<Form.Select className="text-wrap" size="sm">
											<option value="0">Select a field</option>
										</Form.Select>
									</Col>
								</Form.Group>
								<Form.Group controlId="function" className="mt-3 d-flex flex-wrap align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:function.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select className="text-wrap" size="sm" defaultValue={data?.summaryFunction}>
											{[
												{ name: 'Count', val: '1' },
												{ name: 'Total', val: '2' },
												{ name: 'Average', val: '3' },
												{ name: 'Maximum', val: '4' },
												{ name: 'Minimum', val: '5' },
												{ name: 'Standard Deviation', val: '6' },
												{ name: 'Distinct Count', val: '8' }
											].map((options, key) => (
												<option key={key}>{options.name}</option>
											))}
										</Form.Select>
									</Col>
								</Form.Group>
								<Form.Group controlId="drilldown-behavior" className="mt-3 d-flex flex-wrap align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:drilldown-behavior.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Select className="text-wrap" size="sm">
											<option value="0">Select a field</option>
										</Form.Select>
										<Form.Label className="small text-muted text-wrap">
											{t('global:drilldown-behavior-note.translation')}
										</Form.Label>
									</Col>
								</Form.Group>
							</Card.Body>
						</Card>
					) : null}
					{/* DISPLAY SECTION */}
					<Card
						data-test-id="display"
						className="mt-4"
						style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
					>
						<CardHeader label={t('global:display.translation')} />
						<Card.Body>
							{data?.field_type === 'checkbox' ? (
								<Form.Group controlId="display" className="d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:display.translation')}</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.does_total === true ? true : false}
											onChange={handleChange}
											name="does_total"
											label={t('global:checkbox-display.translation')}
										/>
									</Col>
								</Form.Group>
							) : ['phone', 'address'].indexOf(data?.field_type) >= 0 ? null : [
									'numeric',
									'currency',
									'numeric-currency',
									'timeofday',
									'percent',
									'numeric-percent',
									'numeric-rating (0-5)'
							  ].indexOf(data?.field_type) >= 0 ? (
								<React.Fragment>
									{['numeric', 'timeofday'].indexOf(data?.field_type) >= 0 ? null : (
										<Form.Group controlId="width-box" className="mt-3 d-flex">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:width-of-box.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Control
													defaultValue={data?.width}
													className="text-wrap"
													size="sm"
													onChange={handleChange}
													name="width"
												/>
											</Col>
										</Form.Group>
									)}
									{data?.field_type === 'timeofday' ? (
										<Form.Group controlId="decimal-places" className="mt-3 d-flex">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:width-of-box.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Control
													defaultValue={data?.width}
													className="text-wrap"
													size="sm"
													onChange={handleChange}
													name="width"
												/>
											</Col>
										</Form.Group>
									) : (
										<React.Fragment>
											<Form.Group controlId="decimal-places" className="mt-3 d-flex">
												<Col xs={xs} className="d-flex align-items-center">
													<Form.Label className="me-2 text-wrap d-inline-block">
														{t('global:decimal-places.translation')}
													</Form.Label>
												</Col>
												<Col>
													<Form.Control
														defaultValue={data?.decimal_places}
														className="text-wrap"
														size="sm"
														onChange={handleChange}
														name="decimal_places"
													/>
													<Form.Label className="small text-muted text-wrap">
														{t('global:decimal-places-note.translation')}
													</Form.Label>
												</Col>
											</Form.Group>
											<Form.Group controlId="display-format" className="mt-3 d-flex align-items-center">
												<Col xs={xs} className="d-flex align-items-center">
													<Form.Label className="me-2 text-wrap d-inline-block">
														{t('global:display-format.translation')}
													</Form.Label>
												</Col>
												<Col>
													<Form.Select className="text-wrap" size="sm">
														<option value="0">12345678.00</option>
														<option value="3">12,345,678.00</option>
													</Form.Select>
												</Col>
											</Form.Group>
											<Form.Group controlId="separators" className="mt-3 d-flex align-items-center">
												<Col xs={xs} className="d-flex align-items-center">
													<Form.Label className="me-2 text-wrap d-inline-block">
														{t('global:separators.translation')}
													</Form.Label>
												</Col>
												<Col>
													<Form.Select className="text-wrap" size="sm">
														<option value="0">Show separator after 3 places</option>
														<option value="1">Show separator after 4 places</option>
													</Form.Select>
												</Col>
											</Form.Group>
											<Form.Group controlId="display-as" className="mt-3 d-flex align-items-center">
												<Col xs={xs} className="d-flex align-items-center">
													<Form.Label className="me-2 text-wrap d-inline-block">
														{t('global:display-as.translation')}
													</Form.Label>
												</Col>
												<Col>
													<Form.Select className="text-wrap" size="sm">
														<option value="0">Simple number</option>
														<option value="1">Star Rating</option>
														<option value="3">Percent</option>
														<option value="2">Currency</option>
													</Form.Select>
													<Col className="ms-4 mt-1">
														<Form.Label className="text-wrap small">{t('global:symbol.translation')}</Form.Label>
														<Form.Control
															size="sm"
															defaultValue={data?.currency_symbol}
															onChange={handleChange}
															name="currency_symbol"
														/>
													</Col>
													<Col className="ms-4 mt-1">
														<Form.Label className="text-wrap small">{t('global:position.translation')}</Form.Label>
														<Form.Select
															defaultValue={data?.currency_format}
															className="text-wrap"
															size="sm"
															onChange={handleChange}
															name="currency_format"
														>
															<option value="0">Before number</option>
															<option value="1">Between -es and the number</option>
															<option value="2">After number</option>
														</Form.Select>
													</Col>
												</Col>
											</Form.Group>
										</React.Fragment>
									)}
								</React.Fragment>
							) : ['url', 'email'].indexOf(data?.field_type) >= 0 ? (
								<React.Fragment>
									<Form.Group controlId="link-text" className="d-flex">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:link-text.translation')}
											</Form.Label>
										</Col>
										<Col>
											<Form.Control
												defaultValue={data?.appears_as}
												className="text-wrap"
												size="sm"
												onChange={handleChange}
												name="appears_as"
											/>
											<Form.Label className="small text-muted text-wrap">
												{t('global:link-text-note.translation')}
											</Form.Label>
										</Col>
									</Form.Group>
									<Form.Group controlId="options" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:options.translation')}
											</Form.Label>
										</Col>
										<Col>
											{[
												'Don\'t show "http://" when showing the URL',
												'Display as a button on forms and reports',
												'Embed as iframe in forms'
											].map((option, key) => (
												<Form.Check
													key={key}
													value={key + 1}
													defaultChecked={data?.abbreviate || data?.embed_in_forms === true ? true : false}
													label={option}
												/>
											))}
										</Col>
									</Form.Group>
									<Form.Group controlId="open-target" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:open-target.translation')}
											</Form.Label>
										</Col>
										<Col>
											{['In the same page', 'In new window', 'In popup'].map((option, key) => (
												<Form.Check key={key} type="radio" value={key + 1} label={option} name="open-targets" />
											))}
										</Col>
									</Form.Group>
								</React.Fragment>
							) : ['timestamp', 'date'].indexOf(data?.field_type) >= 0 ? (
								<Form.Group controlId="format" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">{t('global:format.translation')}</Form.Label>
									</Col>
									{data?.field_type === 'date' ? (
										<Col>
											{[
												{ name: 'Show the month as a name', property_name: data?.display_month },
												{ name: 'Show the day of the week', property_name: data?.display_dow },
												{
													name: "Don't show the year for dates in the current year", //eslint-disable-line
													property_name: data?.display_relative
												}
											].map((options, key) => (
												<Form.Check
													key={key}
													value={key + 1}
													defaultChecked={options.property_name === true ? true : false}
													label={options.name}
												/>
											))}
										</Col>
									) : (
										<Col>
											{[
												{ name: 'Show the month as a name', property_name: data?.display_month },
												{ name: 'Show the day of the week', property_name: data?.display_dow },
												{
													name: "Don't show the year for dates in the current year", //eslint-disable-line
													property_name: data?.display_relative
												},
												{ name: 'Show the time', property_name: data?.display_time },
												{ name: 'Show the time zone', property_name: data?.display_zone }
											].map((options, key) => (
												<Form.Check
													key={key}
													value={key + 1}
													defaultChecked={options.property_name === true ? true : false}
													label={options.name}
												/>
											))}
										</Col>
									)}
								</Form.Group>
							) : data?.field_type === 'duration' ? (
								<Form.Group controlId="decimal-places" className="d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:decimal-places.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Control
											defaultValue={data?.decimal_places}
											className="text-wrap"
											size="sm"
											onChange={handleChange}
											name="decimal_spaces"
										/>
										<Form.Label className="small text-muted text-wrap">
											{t('global:decimal-places-note.translation')}
										</Form.Label>
									</Col>
								</Form.Group>
							) : (data?.field_type === 'text' && data?.mode === 'lookup') ||
							  [
									'ICalendarButton',
									'email',
									'file',
									'user',
									'dblink',
									'timestamp',
									'timeofday',
									'predecessor',
									'multi-select-text',
									'list-user',
									'vcard'
							  ].indexOf(data?.field_type) >= 0 ? null : (
								<React.Fragment>
									{data?.field_type.includes('formula') ? null : (
										<Form.Group controlId="number-of-lines" className="d-flex">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:number-of-lines.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Control
													defaultValue={data?.num_lines || 0}
													className="text-wrap"
													size="sm"
													onChange={handleChange}
													name="num_lines"
												/>
											</Col>
										</Form.Group>
									)}
									<Form.Group controlId="max-characters" className="mt-3 d-flex">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:max-characters.translation')}
											</Form.Label>
										</Col>
										<Col>
											<Form.Control
												defaultValue={data?.maxlength || 0}
												className="text-wrap"
												size="sm"
												onChange={handleChange}
												name="maxlength"
											/>
										</Col>
									</Form.Group>
									{['text', 'rich-text'].indexOf(data?.field_type) >= 0 ? (
										<Form.Group controlId="width-box" className="mt-3 d-flex">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:width-of-box.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Control
													defaultValue={data?.width}
													className="text-wrap"
													size="sm"
													onChange={handleChange}
													name="width"
												/>
											</Col>
										</Form.Group>
									) : null}
								</React.Fragment>
							)}
							{['email', 'dblink', 'file'].indexOf(data?.field_type) >= 0 ? (
								<Form.Group controlId="label" className="d-flex">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:link-text.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Control className="text-wrap" size="sm" />
										{data?.field_type === 'file' ? (
											<React.Fragment>
												<Form.Label className="small text-muted text-wrap">
													{t('global:file-link-text-note.translation')}
												</Form.Label>
												<Form.Check className="text-wrap" label={t('global:show-images-forms.translation')} />
											</React.Fragment>
										) : (
											<Form.Label className="small text-muted text-wrap">
												{t('global:link-text-note.translation')}
											</Form.Label>
										)}
									</Col>
								</Form.Group>
							) : null}
							{data?.field_type === 'rich-text' ? null : (
								<Form.Group controlId="value-display" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:value-display.translation')}
										</Form.Label>
									</Col>
									<Col>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.bold === true ? true : false}
											label={t('global:display-bold.translation')}
											onChange={handleChange}
											name="bold"
										/>
										<Form.Label className="small text-muted text-wrap">
											{t('global:display-bold-note.translation')}
										</Form.Label>
										<Form.Check
											className="text-wrap"
											defaultChecked={data?.nowrap === true ? true : false}
											onChange={handleChange}
											name="nowrap"
											label={t('global:display-no-wrap.translation')}
										/>
										<Form.Label className="small text-muted text-wrap">
											{t('global:display-no-wrap-note.translation')}
										</Form.Label>
										{data?.field_type === 'timeofday' ? (
											<React.Fragment>
												{['HH:MM', 'HH:MM:SS'].map((option, key) => (
													<Form.Check key={key} value={key + 1} type="radio" label={option} name="hour-format" />
												))}
												<Form.Check className="text-wrap mt-2" label={t('global:24-hour-clock.translation')} />
											</React.Fragment>
										) : null}
										{data?.mode === 'summary' ? (
											<Form.Check className="text-wrap" label={t('global:display-as-link.translation')} />
										) : null}
										{data?.field_type === 'email' ? (
											<React.Fragment>
												{[
													'Display the entire email address',
													'Display just the part of the email address before "@"',
													'Display just the part of the email address before the first underscore "_"'
												].map((option, key) => (
													<Form.Check key={key} value={key + 1} type="radio" label={option} name="email-display" />
												))}
											</React.Fragment>
										) : null}
										{data?.field_type === 'duration' ? (
											<Form.Select
												size="sm"
												defaultValue={data?.format}
												className="mt-2"
												onChange={handleChange}
												name="format"
											>
												<option value="7">HH:MM</option>
												<option value="8">HH:MM:SS</option>
												<option value="10">:MM</option>
												<option value="9">:MM:SS</option>
												<option value="6">Smart Units</option>
												<option value="5">Weeks</option>
												<option value="4">Days</option>
												<option value="3">Hours</option>
												<option value="2">Minutes</option>
												<option value="1">Seconds</option>
											</Form.Select>
										) : null}
										{data?.field_type === 'user' ? (
											<Form.Select size="sm" className="mt-2">
												<option value="DisplayFullName">Full Name</option>
												<option value="DisplayFullNameLF">Last Name, First Name</option>
												<option value="DisplayName">User Name</option>
											</Form.Select>
										) : null}
									</Col>
								</Form.Group>
							)}
						</Card.Body>
					</Card>
					{/* ADVANCED SECTION */}
					<Card
						data-test-id="advanced"
						className="mt-4"
						style={{ boxShadow: '0px 10px 30px #ECECEC', padding: '1.5rem', borderRadius: '10px' }}
					>
						<CardHeader label={t('global:advanced.translation')} />
						<Card.Body>
							{['user', 'timestamp'].indexOf(data?.field_type) >= 0 ? (
								<React.Fragment>
									<Form.Group controlId="searchable" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:searchable.translation')}
											</Form.Label>
										</Col>
										<Col>
											<Form.Check
												className="text-wrap"
												label={t('global:searchable-option.translation')}
												name="is_searchable"
												defaultChecked={data?.is_searchable === true ? true : false}
											/>
										</Col>
									</Form.Group>
									<Form.Group controlId="reportable" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:reportable.translation')}
											</Form.Label>
										</Col>
										<Col>
											<Form.Check className="text-wrap" label={t('global:reportable-new-reports.translation')} />
											<Form.Check className="text-wrap" label={t('global:reportable-reports.translation')} />
										</Col>
									</Form.Group>
								</React.Fragment>
							) : (
								<React.Fragment>
									<Form.Group controlId="permissions" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:permissions.translation')}
											</Form.Label>
										</Col>
										<Col>
											<Form.Check className="text-wrap" label={t('global:restrict-access.translation')} />
										</Col>
									</Form.Group>
									{data?.field_type === 'duration' ||
									['lookup', 'summary'].indexOf(data?.mode) >= 0 ||
									data?.field_type.includes('formula') ? (
										<Form.Group controlId="override-sub-field" className="mt-3 d-flex align-items-center">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:override-sub-field.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Check className="text-wrap" label={t('global:override-sub-field-option.translation')} />
												<Form.Label className="small text-muted text-wrap">
													{t('global:override-sub-field-note.translation')}
												</Form.Label>
											</Col>
										</Form.Group>
									) : ['address', 'dblink', 'file', 'ICalendarButton', 'vcard'].indexOf(data?.field_type) >= 0 ||
									  data?.mode === 'summary' ? null : (
										<Form.Group controlId="auto-fill" className="mt-3 d-flex align-items-center">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:auto-fill.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Check
													className="text-wrap"
													onChange={handleChange}
													name="doesdatacopy"
													label={t('global:auto-fill-option.translation')}
													defaultChecked={data?.doesdatacopy === true ? true : false}
												/>
											</Col>
										</Form.Group>
									)}
									<Form.Group controlId="searchable" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:searchable.translation')}
											</Form.Label>
										</Col>
										<Col>
											<Form.Check
												className="text-wrap"
												label={t('global:searchable-option.translation')}
												name="is_searchable"
												defaultChecked={data?.is_searchable === true ? true : false}
											/>
										</Col>
									</Form.Group>
									<Form.Group controlId="reportable" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:reportable.translation')}
											</Form.Label>
										</Col>
										<Col>
											<Form.Check className="text-wrap" label={t('global:reportable-new-reports.translation')} />
											<Form.Check className="text-wrap" label={t('global:reportable-reports.translation')} />
										</Col>
									</Form.Group>
									{['multi-select-text', 'address', 'list-user'].indexOf(data?.field_type) >= 0 ? null : (
										<Form.Group controlId="shared-values" className="mt-3 d-flex align-items-center">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:shared-values.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Check className="text-wrap" label={t('global:shared-values-option.translation')} />
											</Col>
										</Form.Group>
									)}
									{[
										'duration',
										'address',
										'dblink',
										'predecessor',
										'multi-select-text',
										'file',
										'ICalendarButton',
										'vcard'
									].indexOf(data?.field_type) >= 0 ||
									['lookup', 'summary'].indexOf(data?.mode) >= 0 ||
									data?.field_type.includes('formula') ? null : (
										<Form.Group controlId="snapshot" className="mt-3 d-flex align-items-center">
											<Col xs={xs} className="d-flex align-items-center">
												<Form.Label className="me-2 text-wrap d-inline-block">
													{t('global:snapshot.translation')}
												</Form.Label>
											</Col>
											<Col>
												<Form.Check
													className="text-wrap"
													label={t('global:snapshot-option.translation')}
													onChange={(e) => {
														handleChange(e);
													}}
													name="snapfid"
													defaultChecked={data?.snapfid === 1 || data?.snapfid === true}
												/>
											</Col>
										</Form.Group>
									)}
									<Form.Group controlId="field-help" className="mt-3 d-flex align-items-center">
										<Col xs={xs} className="d-flex align-items-center">
											<Form.Label className="me-2 text-wrap d-inline-block">
												{t('global:field-help.translation')}
											</Form.Label>
										</Col>
										<Col>
											<Form.Control
												as="textarea"
												rows={2}
												defaultValue={data?.fieldhelp}
												onChange={handleChange}
												name="fieldhelp"
											/>
											<Form.Label className="small text-muted text-wrap">
												{t('global:field-help-note.translation')}
											</Form.Label>
										</Col>
									</Form.Group>
								</React.Fragment>
							)}
							{data?.field_type === 'address' ? (
								<Form.Group controlId="address-subfields" className="mt-3 d-flex align-items-center">
									<Col xs={xs} className="d-flex align-items-center">
										<Form.Label className="me-2 text-wrap d-inline-block">
											{t('global:address-subfields.translation')}
										</Form.Label>
									</Col>
								</Form.Group>
							) : null}
						</Card.Body>
					</Card>
				</Container>
			)}
		</React.Fragment>
	);
};

export default FieldView;
