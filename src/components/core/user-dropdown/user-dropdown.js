/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable indent */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@components/core';
import { useTranslation } from 'react-i18next';
import { Container, Dropdown, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { Input } from '@material-ui/core';

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
	<Form.Text
		style={{ cursor: 'pointer' }}
		ref={ref}
		onClick={(e) => {
			e.preventDefault();
			onClick(e);
		}}
		className="btn d-flex justify-content-between p-1"
	>
		{children}
		<Form.Text style={{ margin: 'auto' }}>
			<Icon name="arrow-down" />
		</Form.Text>
	</Form.Text>
));

CustomToggle.propTypes = {
	children: PropTypes.element,
	onClick: PropTypes.func
};

const UserDropdown = () => {
	const navigate = useNavigate();
	const auth = useSelector((state) => state.auth);
	const { t } = useTranslation();

	return (
		<>
			<Container
				fluid
				className="search-box position-relative"
				style={{ maxWidth: '100%', width: '200px', margin: 'initial', marginRight: '10px' }}
			>
				<svg width="24" height="24" viewBox="0 0 24 24" role="presentation" fill="#6B778C">
					<path
						d="M16.436 15.085l3.94 4.01a1 1 0 01-1.425 1.402l-3.938-4.006a7.5 7.5 0 111.423-1.406zM10.5 16a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
						fill="currentColor"
						fillRule="evenodd"
					></path>
				</svg>
				<Form.Control
					style={{
						border: 'none',
						height: '32px',
						width: '100%',
						padding: '0 12px 0 30px',
						boxSizing: 'border-box',
						outline: 'none',
						borderRadius: '8px',
						fontSize: '14px',
						lineHeight: '20px',
						backgroundColor: 'var(--tango-color-white)',
						color: '#6b778c'
					}}
					placeholder="Search"
				/>
			</Container>
			<Dropdown
				className="header-dropdown"
				style={{
					/*border: '1px solid rgb(140 143 167 / 43%)',*/
					border: '1px solid #e9e9e9',
					borderRadius: '10px',
					width: '160px'
				}}
			>
				<Dropdown.Toggle as={CustomToggle} className="d-flex" id="dropdown-custom-components">
					<React.Fragment>
						<Container fluid className="user-icon" style={{ margin: 'auto', width: '30px' }}>
							<Icon
								name="account-circle"
								style={{
									fontSize: '32px',
									color: 'var(--tango-color-lighter-green)',
									marginBottom: '0',
									width: '.8em',
									height: '.8em'
								}}
							/>
						</Container>
						<Form.Text className="fs-6 fw-bold" style={{ color: '#595959', margin: 'auto' }}>
							{auth?.data?.first_name || ''}
						</Form.Text>
					</React.Fragment>
				</Dropdown.Toggle>

				<Dropdown.Menu style={{ border: '1px solid #E3E4E4', borderRadius: '10px' }}>
					<Dropdown.Item
						className="fst-normal fw-bold"
						style={{
							fontSize: '10px',
							lineHeight: '15px',
							color: 'var(--tango-color-gray)',
							paddingTop: '0.7rem',
							paddingBottom: '0.7rem'
						}}
					>
						{`${auth?.data?.first_name || ''} 
								${auth?.data?.middle_name || ''} 
								${auth?.data?.last_name || ''}`}
						<br />
						<Form.Text className="fw-bold" style={{ color: '#595959' }}>
							<>{`${auth?.data?.email1 || ''}`}</>
						</Form.Text>
					</Dropdown.Item>
					<Dropdown.Item
						className="fst-normal position-relative"
						style={{
							fontSize: '13px',
							fontWeight: '600',
							paddingTop: '0.7rem',
							paddingBottom: '0.7rem',
							lineHeight: '24px'
						}}
						onClick={(e) => {
							e.preventDefault();
							navigate('/settings/account');
						}}
					>
						{t('global:my-account.translation')}
					</Dropdown.Item>
					<Dropdown.Item
						className="fst-normal position-relative"
						style={{
							fontSize: '13px',
							fontWeight: '600',
							paddingTop: '0.7rem',
							paddingBottom: '0.7rem',
							lineHeight: '24px'
						}}
						onClick={(e) => {
							e.preventDefault();
							navigate('/logout');
						}}
					>
						{t('global:logout.translation')}
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</>
	);
};

export default UserDropdown;
