import React from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row, Card, ListGroup, Form } from 'react-bootstrap';
import { Icon } from '@components/core';
import { useNavigate, useLocation } from 'react-router-dom';

const MenusList = ({ icon, list, title }) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<Container fluid>
			<Container fluid className="px-4 mt-5">
				<Row>
					<Col md={12}>
						<Container fluid className="title-head h6 text-left" style={{ marginBottom: '10px' }}>
							<Card.Title
								className="fst-normal fw-bold mb-0"
								style={{
									fontSize: '20px',
									lineHeight: '30px',
									color: 'var(--tango-color-pink)',
									paddingBottom: '35px'
								}}
							>
								<Icon name={icon} />
								{title}
							</Card.Title>
						</Container>

						<ListGroup className="menu-list row flex-sm-row align-items-stretch g-lg-4 g-3">
							{list &&
								list.map((item, index) => (
									<ListGroup.Item className="col-sm-6 col-md-12 col-lg-6 col-xxl-4 border-0 py-0" key={index}>
										<Container
											fluid
											className="list-item-wrap h-100 d-flex align-items-center"
											style={{
												boxSizing: 'border-box',
												backgroundColor: 'var(--tango-color-white)',
												border: '1px solid #c8c8c80d',
												boxShadow: '0 0 10px 1px #0000001a',
												borderRadius: '2px',
												minHeight: '170px',
												padding: '22px 30px'
											}}
										>
											<Row className="g-lg-4 g-3">
												<Col xs="auto">
													<Container
														fluid
														className="svg-icon d-flex align-items-center justify-content-center"
														style={{ width: '125px', height: '100px', background: '#aabf695e', borderRadius: '19px' }}
													>
														{item.icon && <Icon name={item.icon} style={{ width: '80%', height: '70%' }} />}
													</Container>
												</Col>
												<Col md>
													<Container fluid>
														<Card.Title
															style={
																item.Link && {
																	cursor: 'pointer',
																	fontSize: '18px',
																	color: 'var(--tango-color-dark-green)',
																	lineHeight: '16px',
																	transition: 'color 0.1s, backgroundColor 0.1s'
																}
															}
															onClick={(e) => {
																e.preventDefault();
																item.Link && navigate(`${pathname}${item.Link}`);
															}}
															className="h6 bg-transparent border-0 p-0 pb-2 hover-effect-link fst-normal fw-bold position-relative"
														>
															{item.title}
														</Card.Title>
													</Container>
													<Container fluid className="pb-3 lh-1">
														<Form.Text
															className="fst-normal fw-light lh-smallm mt-0"
															style={{ fontSize: '12px', color: 'var(--tango-color-gray)' }}
														>
															{item.desc}
														</Form.Text>
													</Container>
													{item.path}
												</Col>
											</Row>
										</Container>
									</ListGroup.Item>
								))}
						</ListGroup>
					</Col>
				</Row>
			</Container>
		</Container>
	);
};

MenusList.propTypes = {
	icon: PropTypes.string,
	list: PropTypes.array,
	title: PropTypes.string
};

export default MenusList;
