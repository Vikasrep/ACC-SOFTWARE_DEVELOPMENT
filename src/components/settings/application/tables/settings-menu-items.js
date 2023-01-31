import React from 'react';
import { PageHeader, Icon, UserDropDown } from '@components/core';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import * as Constants from '@constants';
import MenusList from '../menus-list';

const SettingsMenuItems = () => {
	const { t } = useTranslation();
	const params = useParams();
	const tableName = params.table;
	const tableSettings = Constants.TABLE_SETTINGS_LIST;

	return (
		<>
			<PageHeader actions={<UserDropDown />} />
			<Container fluid data-test-id="table-settings">
				<Container fluid>
					<Form.Text className="fs-6 fw-bold text-capitalize" style={{ color: 'var(--tango-color-pink)' }}>
						<Icon name="overview" style={{ fill: 'var(--tango-color-black)' }} /> {tableName.replaceAll('-', ' ')}{' '}
						{t('global:overview.translation')}
					</Form.Text>
				</Container>
				<Container fluid>
					<Row>
						{tableSettings &&
							tableSettings.map((item, index) => (
								<Col key={index} md={12}>
									<MenusList {...item} />
								</Col>
							))}
					</Row>
				</Container>
			</Container>
		</>
	);
};

export default SettingsMenuItems;
