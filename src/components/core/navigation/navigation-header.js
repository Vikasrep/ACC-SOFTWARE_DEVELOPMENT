import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form } from 'react-bootstrap';
import { Icon } from '@components/core';
import { isMobile } from '@utilities';
import { useTranslation } from 'react-i18next';

const NavigationHeader = ({ onClick, user, show }) => {
	const { t } = useTranslation();
	const cdnUrl = process.env.CDN_URL;

	return (
		<Container
			fluid
			data-test-id="navigation-header"
			className="p-3 d-flex align-items-center"
			style={
				{
					// height: 'var(--tango-navigation-header-height)',
					// borderBottom: 'var(--tango-border)'
				}
			}
		>
			{isMobile() ? (
				<>
					<Container fluid data-test-id="header-label" className="d-flex align-items-center text-nowrap text-truncate">
						<Form.Label
							style={{ color: 'var(--tango-color-green-dark)' }}
							dangerouslySetInnerHTML={{
								__html: t('global:welcome-name.translation', { name: user.first_name || '' })
							}}
						/>
					</Container>
					<Container
						fluid
						data-test-id="header-icon"
						className="d-flex align-items-center"
						onClick={() => {
							onClick((prev) => !prev);
						}}
						style={{
							width: 'auto',
							cursor: 'pointer'
						}}
					>
						{show ? <Icon name="close" /> : <Icon name="menu" />}
					</Container>
				</>
			) : (
				<Container
					className="mobile-logo"
					style={{
						backgroundImage: `url("${cdnUrl}/images/tango-logo.png")`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						backgroundSize: '130px',
						height: '130px !important'
					}}
				/>
			)}
		</Container>
	);
};

NavigationHeader.defaultProps = {
	user: {}
};

NavigationHeader.propTypes = {
	user: PropTypes.object,
	onClick: PropTypes.func,
	show: PropTypes.bool
};

export default NavigationHeader;
