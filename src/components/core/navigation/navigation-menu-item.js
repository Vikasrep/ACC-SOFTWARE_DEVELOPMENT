import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@components/core';
import NavigationMenuSubItem from './navigation-menu-sub-item';
import { useSelector } from 'react-redux';

const NavigationMenuItem = ({ active, icon, id, label, locale, route, subItems, className, onClick }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const name = locale ? t(`global:${locale}.translation`) : label;
	const subActive = subItems.find((item) => item.active) || false;
	const [Access, setAccess] = useState(true);

	const { role_id } = useSelector((state) => state.auth.data);

	useEffect(() => {
		if (role_id !== 1) {
			setAccess(false);
		}
	}, [role_id]);

	return (
		<Container fluid data-test-id="navigation-menu-item" className={`${className} px-2`}>
			<OverlayTrigger placement="right" overlay={<Tooltip>{name}</Tooltip>}>
				<Container
					fluid
					data-test-id={id}
					data-test-active={active || false}
					className="p-3 d-flex align-items-center"
					onClick={() => {
						onClick(false);
						navigate(route);
					}}
					style={{
						height: 'var(--tango-navigation-menu-item-height)',
						cursor: 'pointer',
						borderRadius: '10px'
					}}
				>
					<Icon name={icon} />
					<Container fluid className="ms-2 d-flex justify-content-start align-items-center">
						<Form.Label
							style={{
								cursor: 'pointer',
								fontSize: '14px'
							}}
						>
							{name}
						</Form.Label>
					</Container>
					{subItems.length > 0 &&
						(active || subActive ? (
							<Icon className="arrow-hide" name={'arrow-down'} />
						) : (
							<Icon className="arrow-hide" name={'arrow-right'} />
						))}
				</Container>
			</OverlayTrigger>
			{(active || subActive) &&
				subItems.map((subItem, index) => {
					if (subItem.id === 'users' && !Access) {
						return null;
					}
					return subItem.visible && <NavigationMenuSubItem key={index} {...subItem} onClick={onClick} />;
				})}
		</Container>
	);
};

NavigationMenuItem.defaultProps = {
	id: `navigation-item-${performance.now()}`,
	subItems: [],
	className: ''
};

NavigationMenuItem.propTypes = {
	active: PropTypes.bool,
	icon: PropTypes.string,
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
	locale: PropTypes.string,
	route: PropTypes.string.isRequired,
	subItems: PropTypes.array,
	className: PropTypes.string,
	onClick: PropTypes.func
};

export default NavigationMenuItem;
