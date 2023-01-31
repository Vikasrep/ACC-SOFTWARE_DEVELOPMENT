import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { isMobile } from '@utilities';
import NavigationHeader from './navigation-header';
import NavigationMenu from './navigation-menu';
import { useDispatch } from 'react-redux';
import { sideBarUpdate } from '../../../store/reducers/auth';

const Navigation = ({ items, user }) => {
	const cdnUrl = process.env.CDN_URL;
	const location = useLocation();
	const [show, setShow] = useState(!isMobile(false));
	const [menuItems, setMenuItems] = useState(items);
	const [showSide, setShowSide] = useState(false);

	const disptach = useDispatch();

	// set menu-items with an active menu-item
	useEffect(() => {
		const route = location.pathname;

		if (route) {
			const paths = route
				.split('/')
				.slice(1)
				.map((item) => `/${item}`);
			const navItems = JSON.parse(JSON.stringify(items));
			const navItem = navItems.find((item) => item.route === paths[0]);

			if (navItem) {
				navItem['active'] = true;

				if (paths.length > 1) {
					navItem['active'] = showSide ? true : false;
					navItem.subItems.find((item) => item.route.startsWith(paths[0].concat(paths[1])))['active'] = true;
				}

				setMenuItems([...navItems]);
			}
		}
	}, [items, location.pathname, showSide]);

	useEffect(() => {
		disptach(sideBarUpdate(showSide));
	}, [disptach, showSide]);
	return (
		<Container
			className={`${showSide ? 'hide-menu' : 'leftArrow'}`}
			fluid
			data-test-id="navigation"
			data-test-hide={!show}
			style={{
				width: isMobile() ? '100vw' : showSide ? '70px' : 'var(--tango-navigation-width)',
				// borderRight: isMobile() ? 'none' : 'var(--tango-border)',
				boxShadow: 'var(--tango-navigation)',
				transition: 'all 0.5s'
			}}
		>
			{!isMobile() && (
				<Container
					className="menu-arrow"
					style={{
						backgroundImage: `url("${cdnUrl}/images/left-arrow.png")`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						position: 'absolute',
						width: '28px',
						right: '-12px',
						zIndex: '44',
						height: '30px',
						top: '130px',
						cursor: 'pointer'
					}}
					onClick={() => setShowSide(!showSide)}
				/>
			)}
			<NavigationHeader user={user} onClick={setShow} show={showSide} />
			<NavigationMenu items={menuItems} onClick={setShow} />
		</Container>
	);
};

Navigation.defaultProps = {
	user: {}
};

Navigation.propTypes = {
	user: PropTypes.object,
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
			)
		})
	)
};

export default Navigation;
