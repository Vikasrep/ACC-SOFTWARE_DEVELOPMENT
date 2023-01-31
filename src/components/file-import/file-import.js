import React, { useState, useEffect } from 'react';
import { Card, Form, Container, Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader, Loader, UserDropDown } from '@components/core';
import { useTranslation } from 'react-i18next';
import { getAllTables, getKeyFields } from '@reducers';
import { useNavigate } from 'react-router-dom';
import { getExcelReports } from '@apis';
// import { usePapaParse } from 'react-papaparse';

const FileImport = () => {
	const { t } = useTranslation();
	// const { readString } = usePapaParse();
	// const fileReader = new FileReader();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { tables, keyFields } = useSelector((state) => state);
	const { data } = tables;

	const [isLoading, setIsLoading] = useState(true);
	const [isInvalid, setIsInvalid] = useState(false);
	const [table, setTable] = useState('');
	const [mergeField, setMergeField] = useState({});
	const [action, setAction] = useState('');
	const [file, setFile] = useState();
	const [array] = useState([]);

	useEffect(() => {
		dispatch(getAllTables());
	}, [dispatch]);

	useEffect(() => {
		if (tables.action === 'tables/fetched') {
			setIsLoading(false);
		}
	}, [tables]);

	const handleOnSubmit = (e) => {
		e.preventDefault();

		if (file) {
			// fileReader.onload = function (event) {
			// 	const text = event.target.result;

			// 	readString(text, {
			// 		//worker: true,
			// 		skipEmptyLines: 'greedy',
			// 		header: true,

			// 		transformHeader: (h) =>
			// 			h
			// 				.replaceAll(' ', '_')
			// 				.replaceAll('#', '')
			// 				.replaceAll('_-_', '_')
			// 				.replaceAll('/', '_')
			// 				.replaceAll('(', '')
			// 				.replaceAll(')', '')
			// 				.replaceAll('%', '')
			// 				.replaceAll('Number_', '')
			// 				.toLowerCase()
			// 				.replaceAll('claim_record_id', '_rid_'),
			// 		complete: (array) => {
			// 			console.log(array.data);

			// 			setArray(array.data);
			// 			localStorage.setItem('array', JSON.stringify(array.data));
			// 		}
			// 	});
			// };

			// fileReader.readAsText(file);
			const URLBLOB = URL.createObjectURL(file);

			localStorage.setItem('file', URLBLOB);
		}
	};

	const Fetch = async () => await getExcelReports(table).then((res) => res);

	const handelExcelClick = async () => {
		try {
			setIsLoading(true);
			const { data = false } = await Fetch();
			if (data) {
				await fetch(`${process.env.API_URL}${data.filePath}`, {
					method: 'HEAD',
					cache: 'no-cache'
				});

				const link = document.createElement('a');
				link.href = `${process.env.API_URL}${data.filePath}`;
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

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid>
					<Card>
						<Card.Body>
							<Row>
								<Col>
									<Card.Title>{t('global:choose-action.translation')}</Card.Title>
								</Col>
								<Col xs={8} onChange={(event) => setAction(event.target.value)}>
									<Form.Check data-test-id="action-select">
										<Form.Check.Input id={'import'} type="radio" name="radio" value={'import'} />
										<Form.Check.Label
											htmlFor={'import'}
											className="ms-1 mb-2"
											dangerouslySetInnerHTML={{ __html: t('global:import-from-file-table.translation') }}
										/>
									</Form.Check>
									<Form.Check data-test-id="action-select">
										<Form.Check.Input id={'export'} type="radio" name="radio" value={'export'} />
										<Form.Check.Label
											htmlFor={'export'}
											className="ms-1 mb-2"
											dangerouslySetInnerHTML={{ __html: t('global:export-from-file-table.translation') }}
										/>
									</Form.Check>
								</Col>
							</Row>
						</Card.Body>
					</Card>
					{action ? (
						<React.Fragment>
							<Card className="mt-4">
								<Card.Body>
									<Row>
										<Col>
											<Card.Title>{t('global:select-table.translation')}</Card.Title>
										</Col>
										<Col xs={8}>
											<Form.Select
												style={{
													width: '80%'
												}}
												size="sm"
												isInvalid={isInvalid}
												data-test-id="table-select"
												onChange={(event) => {
													setIsInvalid(false);
													let tableField = event.currentTarget.value;
													dispatch(getKeyFields(tableField.replaceAll('_dbid_', '')));
													setTable(tableField);
												}}
											>
												<option value="">{t('global:choose-table.translation')}</option>
												{data &&
													data.map((table, index) => (
														<option key={index} value={table.table_name}>
															{table.display_name}
														</option>
													))}
											</Form.Select>
											<Form.Control.Feedback type="invalid">{t('global:required.translation')}</Form.Control.Feedback>
										</Col>
									</Row>
								</Card.Body>
							</Card>
							<Card className="mt-4">
								<Card.Body>
									<Row>
										<Col>
											<Card.Title>{t('global:select-merge-field.translation')}</Card.Title>
										</Col>
										<Col xs={8}>
											{table && action === 'import' ? (
												<React.Fragment>
													<Form.Select
														style={{
															width: '80%'
														}}
														size="sm"
														isInvalid={isInvalid}
														data-test-id="field-select"
														onChange={(event) => {
															setMergeField({
																label: event.currentTarget.value,
																id: event.target?.selectedOptions[0]?.dataset?.id || 0
															});
															setIsInvalid(false);
														}}
													>
														<option value="">Select a field</option>
														{keyFields &&
															keyFields.data &&
															keyFields.data.map((field, index) => (
																<option key={index} value={field.label} data-id={field.id}>
																	{field.label}
																</option>
															))}
													</Form.Select>
													<Form.Control.Feedback type="invalid">
														{t('global:required.translation')}
													</Form.Control.Feedback>
													<Card.Text className="small mt-2">{t('global:merge-field-note.translation')}</Card.Text>
												</React.Fragment>
											) : (
												<Form.Select
													style={{
														width: '80%'
													}}
													size="sm"
													disabled
												>
													<option value="">{t('global:select-field.translation')}</option>
												</Form.Select>
											)}
										</Col>
									</Row>
								</Card.Body>
							</Card>
							{action === 'import' ? (
								<React.Fragment>
									<Card className="mt-4">
										<Card.Body>
											<Row>
												<Col>
													<Card.Title>{t('global:choose-file.translation')}</Card.Title>
												</Col>
												<Col xs={8}>
													<Card.Text dangerouslySetInnerHTML={{ __html: t('global:choose-file-note.translation') }} />
													<Card.Text className="ms-3">{t('global:csv-note.translation')}</Card.Text>
													<Form.Group className="mt-4">
														<Form.Control
															style={{
																width: '80%'
															}}
															type="file"
															size="sm"
															accept=".csv"
															onChange={(e) => {
																setFile(e.target.files[0]);
															}}
															data-test-id="file-upload"
														/>
													</Form.Group>
													<Card.Text
														className="mt-4"
														dangerouslySetInnerHTML={{ __html: t('global:send-file-note.translation') }}
													/>
												</Col>
											</Row>
										</Card.Body>
									</Card>
									<Button
										size="sm"
										data-test-id="import"
										className="mt-4 tango-green-button"
										onClick={(e) => {
											if (table && mergeField) {
												handleOnSubmit(e);
												navigate('/import/step-2', { state: { array, table, mergeField } });
											} else {
												setIsInvalid(true);
											}
										}}
									>
										{t('global:import-from-file.translation')}
									</Button>
								</React.Fragment>
							) : (
								<Button
									size="sm"
									data-test-id="import"
									className="mt-4 tango-green-button"
									onClick={() => handelExcelClick()}
								>
									{t('global:export-from-file.translation')}
								</Button>
							)}
						</React.Fragment>
					) : null}
				</Container>
			)}
		</React.Fragment>
	);
};

export default FileImport;
