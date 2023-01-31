import React, { useEffect, useState } from 'react';
import { Container, Form, Alert, Button } from 'react-bootstrap';
import { PageHeader, UserDropDown, Loader } from '@components/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getField, blankField, getFieldTypes, showNotification } from '@reducers';

const ChangeFieldType = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();

	const { access_token } = useSelector((state) => state.auth.data);
	const { field, fieldTypes } = useSelector((state) => state);
	const { data } = field;

	const [type, setType] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const paramsTable = params.table;
	const paramsId = params.id;

	useEffect(() => {
		dispatch(getField(paramsTable, paramsId));
		dispatch(getFieldTypes());
		return () => {
			dispatch(blankField());
		};
	}, [dispatch, paramsTable, paramsId]);

	useEffect(() => {
		if (field.action === 'field/fetched' && fieldTypes.action === 'fieldTypes/fetched') {
			setIsLoading(false);
		}
	}, [field, fieldTypes]);

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid className="p-5">
					<Container fluid className="d-flex flex-column">
						<Form.Label className="text-wrap">
							{t('global:change-the-field-type.translation')}: <b>{data?.label}</b>
						</Form.Label>
						<Form.Label className="text-wrap" style={{ marginLeft: '9.5rem' }}>
							from: <b>{data?.field_type}</b>
						</Form.Label>
					</Container>
					<Container fluid className="d-flex flex-row w-100">
						<Form.Label style={{ marginLeft: '9.5rem' }} className="text-wrap me-2">
							to:{' '}
						</Form.Label>
						<Form.Select
							size="sm"
							style={{ maxWidth: '300px' }}
							onChange={(e) => {
								setType(e.currentTarget.value);
							}}
						>
							<option value="0">{t('global:select-type.translation')}</option>
							{fieldTypes &&
								fieldTypes.data &&
								fieldTypes.data.map((type, index) => (
									<option key={index} value={type.property_name}>
										{type.display_name}
									</option>
								))}
						</Form.Select>
					</Container>
					<Container fluid className="mt-2">
						<Button
							className="me-2 tango-green-button"
							size="sm"
							onClick={() => {
								const url = `${process.env.API_URL}/v2/fields/${paramsTable}/${paramsId}`;
								const config = {
									method: 'PATCH',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
										authorization: `Bearer ${access_token}`
									},
									body: JSON.stringify({
										field_type: type
									})
								};

								return fetch(url, config)
									.then((response) => response.json())
									.then((response) => {
										const notification = {
											title: 'Field Type Updated',
											message: 'Field updated successfully.',
											show: true,
											type: 'success'
										};

										if (!response.success) {
											notification.message = response.message;
											notification.type = 'danger';
										}

										navigate(-1);
										dispatch(showNotification(notification));

										return true;
									});
							}}
						>
							{t('global:change-type.translation')}
						</Button>
						<Button
							variant="light"
							size="sm"
							style={{ borderRadius: '4px', padding: '5px 10px', fontSize: '14px' }}
							onClick={() => {
								navigate(-1);
							}}
						>
							{t('global:cancel.translation')}
						</Button>
					</Container>
					<Container fluid>
						<Alert variant="danger" className="mt-4">
							<Alert.Heading>{t('global:caution.translation')}</Alert.Heading>
							<Form.Label className="text-wrap mb-2">{t('global:field-caution-1.translation')}</Form.Label>
							<Form.Label className="text-wrap">{t('global:field-caution-2.translation')}</Form.Label>
						</Alert>
					</Container>
				</Container>
			)}
		</React.Fragment>
	);
};

export default ChangeFieldType;
