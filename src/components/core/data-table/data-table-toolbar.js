import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { Icon } from '@components/core';
const DataTableToolbar = ({ addField, search, title, showdropdown, actions, leftSideAction }) => {
	const { t } = useTranslation();
	const refSearchText = useRef();
	const refSearchSelect = useRef();
	const refAddFieldSelect = useRef();
	const refAddFieldButton = useRef();
	const refShowSelect = useRef();

	let timeout;

	return (
		<Container
			fluid
			data-test-id="data-table-toolbar"
			className="d-flex justify-content-between align-items-start col-md-12"
			style={{
				overflow: 'unset'
			}}
		>
			<Row>
				{title && (
					<Col>
						<Container fluid data-test-id="title" className="d-flex">
							<Form.Label className="fw-bold">{title}</Form.Label>
						</Container>
					</Col>
				)}
				{leftSideAction && leftSideAction}
				{addField && (
					<Col>
						<Form.Group data-test-id="add-field" className="d-flex">
							<Form.Select
								data-test-id="add-field-select"
								ref={refAddFieldSelect}
								size="sm"
								aria-label="select"
								onChange={() => {
									refAddFieldButton.current.disabled = false;
								}}
								style={{
									minWidth: '200px'
								}}
							>
								{addField.options.length === 0 ? (
									<option value="">{t('global:all-fields-have-been-added.translation')}</option>
								) : (
									<React.Fragment>
										<option hidden value="">
											{t('global:select-a-field-to-add.translation')}
										</option>
										{addField.options.map(({ key, fieldName }, index) => {
											if (fieldName && key !== 'actions') {
												return (
													<option key={index} value={key}>
														{fieldName}
													</option>
												);
											}
										})}
									</React.Fragment>
								)}
							</Form.Select>
							<Button
								data-table-id="add-field-button"
								ref={refAddFieldButton}
								size="sm"
								className="ms-2"
								disabled={addField.options.length === 0}
								onClick={(event) => {
									if (refAddFieldSelect.current.value) {
										addField.func(refAddFieldSelect.current.value);
										refAddFieldSelect.current.value = '';
										event.currentTarget.disabled = true;
									}
								}}
							>
								{t('global:add.translation')}
							</Button>
						</Form.Group>
					</Col>
				)}
				{search && (
					<React.Fragment>
						{!title && !addField && !leftSideAction && <Col />}
						<Col xl={12} lg={12} md={12} sm={12} className={'py-md-2'}>
							<Form.Group data-test-id="search" className="d-flex flex-lg-row flex-column justify-content-end">
								<div className="pb-2 ">
									<div className="search-icon" style={{ position: 'relative' }}>
										<Icon
											name={'SearchOutlined'}
											style={{
												color: '#7e7e7e',
												position: 'absolute',
												right: '5px',
												top: '5px'
											}}
										/>
										<Form.Control
											data-test-id="search-input"
											type="text"
											ref={refSearchText}
											style={{ borderRadius: '10px', paddingRight: '30px' }}
											defaultValue={search.value}
											size="sm"
											className="me-2 w-100"
											placeholder={t('global:search.translation')}
											onChange={(event) => {
												const text = event.currentTarget.value;
												const column = refSearchSelect.current.value;

												if (timeout) window.clearTimeout(timeout);

												timeout = window.setTimeout(() => {
													search.func(text, column);
												}, 500);
											}}
										/>
									</div>
								</div>
								{search.options && (
									<div className="pb-2 px-lg-2">
										<Form.Select
											data-test-id="search-select"
											ref={refSearchSelect}
											defaultValue={search.column}
											size="sm"
											style={{ borderRadius: '10px' }}
											aria-label="select"
											onChange={(event) => {
												const column = event.currentTarget.value;
												const text = refSearchText.current.value;

												if (text) search.func(text, column);
											}}
										>
											<option value="">{t('global:all.translation')}</option>
											{search.options.map(({ key, label }, index) => {
												if (label && key !== 'actions') {
													return (
														<option key={index} value={key}>
															{label}
														</option>
													);
												}
											})}
										</Form.Select>
									</div>
								)}
								{showdropdown && (
									<React.Fragment>
										{!title && !addField && !search && <Col />}
										<Col className="pb-2">
											<Form.Group data-test-id="show-dropdown" className="d-flex">
												<Form.Label className="overflow-visible me-2 d-flex align-items-center">
													{t('global:show-dropdown.translation')}
												</Form.Label>

												{showdropdown.options && (
													<Form.Select
														data-test-id="show-dropdown"
														ref={refShowSelect}
														className="me-2"
														style={{ borderRadius: '10px' }}
														defaultValue={showdropdown.column}
														size="sm"
														aria-label="select"
														onChange={(event) => {
															const text = event.currentTarget.value;

															if (timeout) window.clearTimeout(timeout);

															timeout = window.setTimeout(() => {
																showdropdown.func(text);
															}, 500);
														}}
													>
														<option value="">{t('global:all-fields.translation')}</option>
														{Array.from(new Set(showdropdown.options.map((item) => item.field_type))).map(
															(field_type, index, key) => {
																if (field_type && key !== 'actions') {
																	return (
																		<option key={index} value={`${field_type}`}>
																			{field_type}
																		</option>
																	);
																}
															}
														)}
													</Form.Select>
												)}
											</Form.Group>
										</Col>
									</React.Fragment>
								)}
								{actions && (
									<React.Fragment>
										<div className="pb-sm-2 text-end">{actions}</div>
									</React.Fragment>
								)}
							</Form.Group>
						</Col>
					</React.Fragment>
				)}
			</Row>
		</Container>
	);
};

DataTableToolbar.propTypes = {
	addField: PropTypes.shape({
		func: PropTypes.func.isRequired,
		options: PropTypes.array.isRequired
	}),
	search: PropTypes.shape({
		column: PropTypes.string,
		text: PropTypes.string,
		func: PropTypes.func.isRequired,
		options: PropTypes.array,
		value: PropTypes.string
	}),
	showdropdown: PropTypes.shape({
		column: PropTypes.string,
		text: PropTypes.string,
		func: PropTypes.func.isRequired,
		options: PropTypes.array
	}),
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	actions: PropTypes.element,
	leftSideAction: PropTypes.element
};

export default DataTableToolbar;
