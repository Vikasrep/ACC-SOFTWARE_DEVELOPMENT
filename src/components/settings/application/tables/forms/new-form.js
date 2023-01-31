/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import FormTable from './form-table';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader, PageHeader } from '@components/core';
import { useSelector } from 'react-redux';

const NewForm = () => {
	const { data } = useSelector((state) => state.auth);
	const { access_token } = data;
	const { t } = useTranslation();
	const navigate = useNavigate();
	const params = useParams();

	const { table, id } = params;

	const url = `${process.env.API_URL}/v2/fields/${table}`;
	const formUrl = `${process.env.API_URL}/form/${table}/${id}`;

	const [dropdownList, setdropdownList] = useState([]);
	const [formData, setformData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// eslint-disable-next-line no-unused-vars
	const [DataAppend, setDataAppend] = useState({
		embedded_report_id: null,
		embedded_report_name: null,
		embedded_report_url: null,
		form_id: id,
		label: '',
		name: '',
		order: 0,
		property_name: '',
		property_type: '',
		required: false,
		rows_to_display: null,
		same_line: false,
		settings: ''
	});

	const fetchData = useCallback(async () => {
		const config = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				authorization: `Bearer ${access_token}`
			}
		};

		const data = await fetch(url, config).then((res) => res.json());
		const formData = await fetch(formUrl, config).then((res) => res.json());
		setdropdownList(data.data);
		setformData(formData.data.length ? formData.data : [DataAppend]);
		setIsLoading(false);
	}, [DataAppend, access_token, formUrl, url]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		let urlPatch = `${process.env.API_URL}/form/data`;

		const config = {
			method: 'PATCH',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				authorization: `Bearer ${access_token}`
			},
			body: JSON.stringify(formData)
		};

		const data = await fetch(urlPatch, config).then((res) => res.json());
		if (data.success) {
			navigate(-1);
		}
	};

	const addMoreData = (data) => (e) => {
		e.preventDefault();
		setformData([...data, DataAppend]);
	};

	return (
		<React.Fragment>
			<PageHeader />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id="new-form">
					<Container fluid>
						<Row className="mb-3">
							<Col className="text-center" sm={12}>
								<Form.Text className="fs-6 fw-bold text-black">
									<Form.Label>{t('global:edit-form.translation')}</Form.Label>
								</Form.Text>
							</Col>
						</Row>
						<Row>
							<Col sm={6}></Col>
							<Col sm={6}>
								<Container style={{ textAlign: 'right' }}>
									<Button onClick={handleSubmit} className="mx-2 tango-green-button">
										{t('global:apply-changes.translation')}
									</Button>
									<Button
										variant="light"
										size="sm"
										onClick={() => navigate(-1)}
										style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
									>
										{t('global:cancel.translation')}
									</Button>
								</Container>
							</Col>
						</Row>
					</Container>
					<Container fluid>
						<Row>
							<Col sm={6}>
								<FormTable dropdownList={dropdownList} formData={formData} onClickButton={addMoreData} />
							</Col>
							<Col sm={6}></Col>
						</Row>
					</Container>
				</Container>
			)}
		</React.Fragment>
	);
};

export default NewForm;
