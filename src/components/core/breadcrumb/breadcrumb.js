import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Container, Form } from 'react-bootstrap';
import BreadcrumbButtonLink from './breadcrumb-button-link';
import BreadcrumbCustomLink from './breadcrumb-custom-link';

// breadcrumb
const Breadcrumb = ({ children, buttonLinkList, path }) => {
	const location = useLocation();
	const { t } = useTranslation();
	const [crumbs, setCrumbs] = useState([]);

	// set crumbs
	useEffect(() => {
		if (location) {
			const pathname = path || location.pathname;
			const paths = pathname.split('/').splice(1);
			const crumbs = paths.map((path, index) => ({
				label: `${(path[0] || '').toUpperCase() + path.substring(1)}`,
				route: `/${[...paths].slice(0, index + 1).join('/')}`
			}));

			setCrumbs(crumbs);
		}
	}, [t, location, path]);

	return (
		<Container fluid data-test-id="breadcrumb" className="d-flex justify-content-start align-items-center">
			{children ||
				crumbs.map((crumb, index) => {
					const { label, route } = crumb;

					if (!route) return null;

					if (index < crumbs.length - 1) return <BreadcrumbCustomLink key={index} {...crumb} />;

					if (buttonLinkList) {
						return (
							<BreadcrumbButtonLink
								key={index}
								label={label}
								options={buttonLinkList}
								style={{ fontSize: 'var(--bs-body-font-size)' }}
							/>
						);
					}

					return (
						<Form.Label
							key={index}
							className="text-nowrap text-truncate fw-bold"
							style={{ color: 'var(--tango-color-pink)' }}
						>
							{label.replace('global:', '').replace('.translation', '')}
						</Form.Label>
					);
				})}
		</Container>
	);
};

Breadcrumb.propTypes = {
	children: PropTypes.element,
	path: PropTypes.string,
	buttonLinkList: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			route: PropTypes.string.isRequired
		})
	),
	id: PropTypes.string
};

export default Breadcrumb;
