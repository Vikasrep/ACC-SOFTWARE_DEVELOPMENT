import React, { useLayoutEffect, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Container, Form, OverlayTrigger, Row, Tabs, Tab, Tooltip } from 'react-bootstrap';
import { ChevronRight, ExpandMore } from '@material-ui/icons';
import { CurrencyFormatter, DataTable, DateTimeFormatter } from '@components/core';
import './data-view.scss';

//==================================================
// column
//==================================================

const DataViewColumn = ({ action, error, id, label, value, onChange, options, required, type }) => {
	const { t } = useTranslation();

	return (
		<Col
			key={id}
			className="mb-3"
			style={{
				minWidth: '200px'
			}}
		>
			<Form.Group data-test-id={id} controlId={id}>
				<Container fluid className="d-flex ">
					<OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={<Tooltip>{label}</Tooltip>}>
						<Form.Label
							className="me-2 text-nowrap d-inline-block"
							style={{
								maxWidth: '100%'
							}}
						>
							{label}
						</Form.Label>
					</OverlayTrigger>
					{action === 'edit' && required && (
						<OverlayTrigger
							placement="top"
							delay={{ show: 250, hide: 400 }}
							overlay={<Tooltip>{t('global:required.translation')}</Tooltip>}
						>
							<Form.Text className="me-1 text-danger" style={{ cursor: 'default' }}>
								*
							</Form.Text>
						</OverlayTrigger>
					)}
				</Container>
				{action === 'view' ? (
					<React.Fragment>
						{(() => {
							switch (type) {
								case 'checkbox':
									return <Form.Check disabled defaultChecked={['1', 1, 'True', 'true', true].includes(value)} />;

								case 'currency':
									return <CurrencyFormatter disabled value={value || 0} type="input" />;

								case 'date':
									return <DateTimeFormatter type="input" value={value} disabled={true} />;

								case 'timestamp':
									return <DateTimeFormatter type="input" value={value} showTime={true} disabled={true} />;

								case 'radio':
									return (
										<React.Fragment>
											{options.map((item, index) => (
												<Form.Check key={index}>
													<Form.Check.Input
														type="radio"
														value={value}
														name="radio"
														disabled
														defaultChecked={value === item.choiceName}
													/>
													<Form.Check.Label className="small">{item.choiceName}</Form.Check.Label>
												</Form.Check>
											))}
										</React.Fragment>
									);

								default:
									return <Form.Control defaultValue={value} disabled className="text-wrap" size="sm" />;
							}
						})()}
					</React.Fragment>
				) : (
					<React.Fragment>
						{(() => {
							switch (type) {
								case 'checkbox':
									return (
										<React.Fragment>
											<Form.Check>
												<Form.Check.Input
													required={required}
													defaultChecked={['1', 1, 'True', 'true', true].includes(value)} // added to support quickbase bit/string/boolean
													onChange={onChange}
													className={error ? 'is-invalid' : ''}
												/>
											</Form.Check>
										</React.Fragment>
									);

								case 'currency':
									return (
										<Form.Control
											size="sm"
											required={required}
											defaultValue={value}
											type="number"
											className={error ? 'is-invalid' : ''}
											onChange={onChange}
											onKeyDown={(event) => ['e', 'E', '+', '-'].includes(event.key) && event.preventDefault()}
										/>
									);

								case 'date':
									return (
										<DateTimeFormatter
											type="input"
											value={value}
											onChange={onChange}
											className={error ? 'is-invalid' : ''}
										/>
									);

								case 'timestamp':
									return (
										<DateTimeFormatter
											type="input"
											value={value}
											showTime={true}
											onChange={onChange}
											className={error ? 'is-invalid' : ''}
										/>
									);

								case 'radio':
									return (
										<React.Fragment>
											{options.map((item, index) => (
												<Form.Check key={index}>
													<Form.Check.Input
														type="radio"
														name="radio"
														onChange={onChange}
														value={item.choiceName}
														defaultChecked={value === item.choiceName}
													/>
													<Form.Check.Label className="small">{item.choiceName}</Form.Check.Label>
												</Form.Check>
											))}
										</React.Fragment>
									);
								case 'text-multiple-choice':
								case 'dropdown':
									return (
										<React.Fragment>
											<Form.Select
												size="sm"
												required={required}
												defaultValue={value}
												onChange={onChange}
												className={error ? 'is-invalid' : ''}
											>
												<option hidden value="">
													{t('global:select-an-option.translation')}
												</option>
												<option value=""></option>
												{options.map((item, index) => (
													<option key={index} value={item.choiceName}>
														{item.choiceName}
													</option>
												))}
											</Form.Select>
										</React.Fragment>
									);

								default:
									return (
										<Form.Control
											size="sm"
											required={required}
											defaultValue={value}
											className={error ? 'is-invalid' : ''}
											onChange={onChange}
										/>
									);
							}
						})()}
					</React.Fragment>
				)}
				<Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
			</Form.Group>
		</Col>
	);
};

DataViewColumn.propTypes = {
	action: PropTypes.oneOf(['edit', 'new', 'view']),
	error: PropTypes.string,
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	options: PropTypes.array,
	required: PropTypes.bool,
	type: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

//==================================================
// row
//==================================================
const DataViewRow = ({ id, data, action, settings, onChange }) => (
	<Row key={id} data-test-id={`row-${id}`}>
		{settings.map((setting, index) => {
			const { choices, error, field_type, label, property_name, property_type, required } = setting;

			if (property_type === 'Text') {
				return <Form.Label key={index} dangerouslySetInnerHTML={{ __html: label }} label={label} />;
			}

			if (property_type === 'report') {
				const name = setting.embedded_report_url?.split('/')[2];

				if (!name) return <React.Fragment />;

				if (!setting.columns && !setting.rows) {
					return (
						<Form.Group key={index}>
							<Form.Label key={index} className="text-uppercase">
								0 {name}
							</Form.Label>
						</Form.Group>
					);
				}

				return (
					<Form.Group key={index} className="mb-3">
						<Form.Label className="fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>
							{setting.rows[0]['total_rows']} {name}
						</Form.Label>
						<DataTable
							columns={setting.columns}
							columnOptions={{
								resizable: true,
								sortable: false,
								disabled: false
							}}
							rows={setting.rows}
							style={{ height: '200px' }}
						/>
					</Form.Group>
				);
			}

			return (
				<DataViewColumn
					key={index}
					id={property_name}
					label={label}
					value={data[property_name]}
					options={choices}
					action={action}
					onChange={onChange}
					type={field_type}
					required={required}
					error={error}
				/>
			);
		})}
	</Row>
);

DataViewRow.propTypes = {
	action: PropTypes.string,
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	settings: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
	onChange: PropTypes.func
};

//==================================================
// DataViewToolbar
//==================================================
const DataViewToolbar = ({ navigation, actions }) => (
	// if (!navigation) return <React.Fragment />;

	/* const { next, previous, back } = navigation; */

	<>
		<Container
			fluid
			data-test-id="data-view-toolbar"
			className="d-flex justify-content-end align-items-start"
			style={{
				overflow: 'unset'
			}}
		>
			<Container fluid data-test-id="navigation" className="d-flex justify-content-end align-items-center">
				{actions}
			</Container>
		</Container>
		<Container
			fluid
			data-test-id="data-view-toolbar"
			className="d-flex justify-content-end align-items-start"
			style={{
				overflow: 'unset'
			}}
		>
			{navigation && (
				<Container fluid data-test-id="navigation" className="d-flex justify-content-end align-items-center">
					<Button
						data-test-id="previous"
						variant="link"
						style={{ color: 'var(--tango-color-light-green)' }}
						size="sm"
						className="p-0 me-1 text-decoration-none button-link"
						disabled={navigation.previous.disabled}
						onClick={navigation.previous.action}
					>
						{navigation.previous.label || 'Previous'}
					</Button>
					{' | '}
					<Button
						data-test-id="return"
						variant="link"
						style={{ color: 'var(--tango-color-light-green)' }}
						size="sm"
						className="p-0 mx-1 text-decoration-none button-link"
						disabled={navigation.back.disabled}
						onClick={navigation.back.action}
					>
						{navigation.back.label || 'Return'}
					</Button>
					{' | '}
					<Button
						data-test-id="next"
						variant="link"
						style={{ color: 'var(--tango-color-light-green)' }}
						size="sm"
						className="p-0 ms-1 text-decoration-none button-link"
						disabled={navigation.next.disabled}
						onClick={navigation.next.action}
					>
						{navigation.next.label || 'Next'}
					</Button>
				</Container>
			)}
		</Container>
	</>
);
DataViewToolbar.propTypes = {
	navigation: PropTypes.shape({
		next: PropTypes.shape({
			label: PropTypes.string,
			disabled: PropTypes.bool,
			action: PropTypes.func
		}),
		previous: PropTypes.shape({
			label: PropTypes.string,
			disabled: PropTypes.bool,
			action: PropTypes.func
		}),
		back: PropTypes.shape({
			label: PropTypes.string,
			disabled: PropTypes.bool,
			action: PropTypes.func
		})
	}),
	actions: PropTypes.element
};

//==================================================
// blank
//==================================================
const DataViewBlank = ({ action, data, onChange, settings }) => {
	const end = settings.map((setting) => setting.property_type).indexOf('Section Heading');
	const rows = settings.slice(0, end).filter((setting) => setting.same_line === false);

	if (rows.length === 0) return <React.Fragment />;

	return (
		<Container fluid data-test-id="blank" className="mb-3">
			{rows.map((row, index) => {
				const firstIndex = settings.findIndex((item) => item.property_name === row.property_name);
				const lastIndex =
					index < rows.length - 1
						? settings.findIndex((item) => item.property_name === rows[index + 1].property_name)
						: settings.slice(0, end).length;

				return (
					<DataViewRow
						key={index}
						id={index + 1}
						data={data}
						settings={settings.slice(firstIndex, lastIndex)}
						action={action}
						onChange={onChange}
					/>
				);
			})}
		</Container>
	);
};

DataViewBlank.propTypes = {
	action: PropTypes.string,
	settings: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
	onChange: PropTypes.func
};

//==================================================
// sections
//==================================================
const DataViewSections = ({ action, settings, data, onChange }) => {
	const sections = settings.filter((setting) => setting.property_type === 'Section Heading');

	if (sections.length === 0) return <React.Fragment />;

	return sections.map((section, index) => {
		const firstIndex = settings.findIndex((item) => item.label === section.label);
		const lastIndex =
			index < sections.length - 1 ? settings.findIndex((item) => item.label === sections[index + 1].label) : 0;
		const tabFirstIndex = settings.findIndex((item) => item.property_type === 'Tab');

		return (
			<DataViewSection
				key={index}
				data-test-id="section"
				id={section.label.replaceAll(/ /g, '-').toLowerCase()}
				label={section.label}
				data={data}
				settings={settings.slice(firstIndex + 1, lastIndex || tabFirstIndex)}
				action={action}
				onChange={onChange}
			/>
		);
	});
};

DataViewSections.propTypes = {
	action: PropTypes.string,
	settings: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
	onChange: PropTypes.func
};

// ==================================================
// section
//==================================================
const DataViewSection = ({ id, label, action, settings, data, onChange }) => {
	const rows = settings.filter((setting) => setting.same_line === false);
	const iconStyle = {
		marginTop: '-0.2rem',
		marginRight: '0.2rem',
		marginLeft: '-0.4rem'
	};

	return (
		<Card key={id} data-test-id={id} className="mb-4">
			<Card.Header
				className="w-100"
				onClick={(event) => {
					const expand = event.currentTarget.parentNode.querySelector('[data-test-id="expand"]');
					const contract = event.currentTarget.parentNode.querySelector('[data-test-id="contract"]');
					const style = event.currentTarget.parentNode.querySelector('.card-body').style;

					if (style.display === 'none') {
						style.display = 'block';
						expand.style.display = 'inline-block';
						contract.style.display = 'none';
					} else {
						style.display = 'none';
						expand.style.display = 'none';
						contract.style.display = 'inline-block';
					}
				}}
				style={{ cursor: 'pointer' }}
			>
				<ExpandMore data-test-id="expand" style={iconStyle} />
				<ChevronRight data-test-id="contract" style={{ ...iconStyle, display: 'none' }} />
				{label}
			</Card.Header>
			<Card.Body
				className="w-100"
				style={{
					marginBottom: '-0.5rem'
				}}
			>
				{rows.map((row, index) => {
					const firstIndex = settings.findIndex((item) => item.property_name === row.property_name);
					const lastIndex =
						index < rows.length - 1
							? settings.findIndex((item) => item.property_name === rows[index + 1].property_name)
							: settings.length;

					return (
						<DataViewRow
							key={index}
							id={index + 1}
							data={data}
							settings={settings.slice(firstIndex, lastIndex)}
							action={action}
							onChange={onChange}
						/>
					);
				})}
			</Card.Body>
		</Card>
	);
};

DataViewSection.propTypes = {
	action: PropTypes.string,
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	label: PropTypes.string.isRequired,
	settings: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
	onChange: PropTypes.func
};

//==================================================
// tabs
//==================================================
const DataViewTabs = ({ action, settings, data, onChange }) => {
	const [activeTab, setActiveTab] = useState();
	const tabs = settings.filter((setting) => setting.property_type === 'Tab');

	// scroll to bottom via tab onclick
	useLayoutEffect(() => {
		if (activeTab) {
			const element = document.querySelector('div[data-test-id^=data-view-]');

			if (element) element.scrollTop = element.scrollHeight - element.clientHeight;
		}
	}, [activeTab]);

	if (tabs.length === 0) return <React.Fragment />;

	const defaultActiveKey = tabs[0].label.replaceAll(/ /g, '-').toLowerCase();
	const settingsLength = settings.length - 1;

	/* eslint-disable */
	useEffect(() => {
		let timer = setTimeout(() => {
			setActiveTab(defaultActiveKey);
		}, 1500);
		return () => clearTimeout(timer);
	}, []);
	/* eslint-enable */

	return (
		<Tabs
			data-test-id="tabs"
			className="mb-4"
			defaultActiveKey={defaultActiveKey}
			onSelect={(activeKey) => {
				setActiveTab(activeKey);
			}}
		>
			{tabs.map((tab, index) => {
				const eventKey = tab.label.replaceAll(/ /g, '-').toLowerCase();
				const firstIndex = settings.findIndex((item) => item.label === tab.label);
				const lastIndex =
					index < tabs.length - 1 ? settings.findIndex((item) => item.label === tabs[index + 1].label) : 0;
				const tabSettings = settings.slice(firstIndex + 1, lastIndex || settingsLength);
				const rows = tabSettings.filter((tabSettings) => tabSettings.same_line === false);

				return (
					<Tab key={index} eventKey={eventKey} id={eventKey} title={tab.label}>
						{rows.map((row, index) => {
							const firstIndex = tabSettings.findIndex((item) => item.property_name === row.property_name);
							const lastIndex =
								index < rows.length - 1
									? tabSettings.findIndex((item) => item.property_name === rows[index + 1].property_name)
									: tabSettings.length;

							return (
								<DataViewRow
									key={index}
									id={index + 1}
									data={data}
									settings={tabSettings.slice(firstIndex, lastIndex || settingsLength)}
									action={action}
									onChange={onChange}
								/>
							);
						})}
					</Tab>
				);
			})}
		</Tabs>
	);
};

DataViewTabs.propTypes = {
	action: PropTypes.string,
	settings: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
	onChange: PropTypes.func
};

//==================================================
// data-view
//==================================================
const DataView = ({ action, settings, data, toolbar, onChange }) => {
	const isNew = action === 'new';

	return (
		<Container fluid data-test-id={`data-view-${data._rid_}`}>
			<DataViewToolbar {...toolbar} />
			<DataViewBlank data={data} settings={settings} action={action} onChange={onChange} />
			<DataViewSections data={data} settings={settings} action={action} onChange={onChange} />
			{!isNew && <DataViewTabs data={data} settings={settings} action={action} onChange={onChange} />}
		</Container>
	);
};

DataView.propTypes = {
	action: PropTypes.string,
	settings: PropTypes.array.isRequired,
	data: PropTypes.object.isRequired,
	toolbar: PropTypes.object,
	onChange: PropTypes.func
};

export default DataView;
