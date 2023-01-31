import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import NavigationMenuItem from './navigation-menu-item';
import { useSelector } from 'react-redux';

const NavigationMenu = ({ items, onClick }) => {
	const [Access, setAccess] = useState(false);

	const { role_id } = useSelector((state) => state.auth.data);

	useEffect(() => {
		if ([17, 1].includes(role_id)) {
			setAccess(true);
		}
	}, [role_id]);

	return (
		<Container fluid data-test-id="navigation-menu" className="overflow-auto " style={{ height: 'calc(100% - 200px' }}>
			{items.map((item, index) => {
				if (item.id === 'settings' && !Access) {
					return null;
				}

				return item.visible && <NavigationMenuItem key={index} {...item} onClick={onClick} />;
			})}
		</Container>
	);
};

NavigationMenu.defaultProps = {
	items: []
};

NavigationMenu.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			icon: PropTypes.string,
			id: PropTypes.string,
			label: PropTypes.string.isRequired,
			locale: PropTypes.string,
			route: PropTypes.string.isRequired,
			subItems: PropTypes.arrayOf(
				PropTypes.shape({
					icon: PropTypes.string,
					id: PropTypes.string,
					label: PropTypes.string.isRequired,
					locale: PropTypes.string,
					route: PropTypes.string.isRequired
				})
			),
			className: PropTypes.string
		})
	),
	onClick: PropTypes.func
};

export default NavigationMenu;
