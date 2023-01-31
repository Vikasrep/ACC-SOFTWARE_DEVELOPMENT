import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

const NavigationMenuSubItem = ({ active, id, label, locale, route, onClick }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const name = locale ? t(`global:${locale}.translation`) : label;

	return (
		<Container fluid data-test-id="navigation-menu-sub-item" className="submenu">
			<OverlayTrigger placement="right" overlay={<Tooltip>{name}</Tooltip>}>
				{({ ...triggerHandler }) => (
					<Container
						fluid
						data-test-id={id}
						data-test-active={active}
						{...triggerHandler}
						className="p-3 d-flex align-items-center submenu-inner my-2"
						onClick={() => {
							onClick(false);
							navigate(route);
						}}
						style={{
							height: 'var(--tango-navigation-menu-item-height)',
							cursor: 'pointer',
							fontSize: '14px',
							borderRadius: '10px',
							width: '180px'
						}}
					>
						<Container fluid className="d-flex justify-content-start align-items-center">
							<Form.Label
								style={{
									cursor: 'pointer'
									// paddingLeft: '2rem'
								}}
							>
								{name}
							</Form.Label>
						</Container>
					</Container>
				)}
			</OverlayTrigger>
		</Container>
	);
};

NavigationMenuSubItem.defaultProps = {
	id: `navigation-sub-item-${performance.now()}`
};

NavigationMenuSubItem.propTypes = {
	active: PropTypes.bool,
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
	locale: PropTypes.string,
	route: PropTypes.string.isRequired,
	onClick: PropTypes.func
};

export default NavigationMenuSubItem;
