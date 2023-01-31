import React from 'react';
import { PageHeader, Icon, UserDropDown } from '@components/core';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MenusList from './menus-list';
import * as Constants from '@constants';

const Application = () => {
	const { t } = useTranslation();
	const listItem = Constants.APPLICATION_SETTING_LIST;

	return (
		<>
			<PageHeader actions={<UserDropDown />} />
			<Container fluid data-test-id="application">
				<Container fluid>
					<Form.Text className="fs-6 fw-bold" style={{ color: 'var(--tango-color-pink)' }}>
						<Icon name="overview" style={{ fill: 'var(--tango-color-black)' }} /> {t('global:overview.translation')}
					</Form.Text>
				</Container>
				<Container fluid>
					<Row>
						{listItem &&
							listItem.map((item, index) => (
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

export default Application;
