import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Col, Container, Form, Image, Row } from 'react-bootstrap';

const AuthenticateLayout = ({ children }) => {
	const { t } = useTranslation();
	const cdnUrl = process.env.CDN_URL;

	return (
		<Container data-test-id="authenticate" className="h-100 w-100">
			<Row className="justify-content-between h-100 algin-items-center">
				<Col lg={7}>
					<Container
						className="h-100 d-none	d-lg-block"
						style={{
							backgroundImage: `url("${cdnUrl}/images/login-with-logo.png")`,
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center',
							backgroundSize: 'contain'
						}}
					/>
				</Col>
				<Col
					lg={4}
					style={{
						background: 'var(--tango-color-white)',
						// overflowY: 'auto',
						margin: 'auto'
					}}
				>
					<Col>
						<Container
							fluid
							className="d-flex flex-column justify-content-center flex-grow-1 login-box p-5"
							style={{ borderRadius: '20px', boxShadow: '2px 2px 6px 2px #e0e4d8' }}
						>
							<Container fluid className="d-flex justify-content-center">
								<Image
									src={`${cdnUrl}/images/logo-icon.png`}
									alt="logo"
									style={{ height: '50px', width: '50px' }}
									className="mb-4"
								/>
							</Container>
							<Container fluid className="mt-2">
								{children}
							</Container>
						</Container>
						<Container fluid className="pt-lg-5">
							<Container fluid className="d-flex justify-content-center mt-5">
								<Image src={`${cdnUrl}/images/ssl.gif`} alt="ssl cert" style={{ height: '40px', width: '70px' }} />
							</Container>
							<Container fluid className="d-flex pt-lg-4 justify-content-center mt-3 small text-center">
								<Form.Label className="small">
									© {t('global:tango59.translation')}. {t('global:rights-reserved.translation')}
								</Form.Label>
							</Container>
							<Container fluid className="d-flex justify-content-center small text-center">
								<Form.Label
									className="me-1 small"
									onClick={() => window.open(`${cdnUrl}/pdfs/PCU%20Privacy.pdf`, '_blank')}
									style={{
										cursor: 'pointer',
										color: 'var(--tango-color-light-green)'
									}}
								>
									{t('global:privacy-notice.translation')}
								</Form.Label>
								{'|'}
								<Form.Label
									className="ms-1 small"
									onClick={() => window.open(`${cdnUrl}/pdfs/PCU%20Terms%20of%20Use.pdf`, '_blank')}
									style={{
										cursor: 'pointer',
										color: 'var(--tango-color-light-green)'
									}}
								>
									{t('global:terms-of-use.translation')}
								</Form.Label>
							</Container>
						</Container>
					</Col>
				</Col>
			</Row>
		</Container>
	);
};

AuthenticateLayout.propTypes = {
	children: PropTypes.element
};

export default AuthenticateLayout;
