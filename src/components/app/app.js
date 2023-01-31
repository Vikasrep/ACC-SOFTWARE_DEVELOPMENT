import React, { useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { logout, relogin } from '@reducers';
import { Alert, AuthenticateLayout, Loader } from '@components/core';
import {
	Dashboard,
	ForgotPassword,
	SetPassword,
	Login,
	Logout,
	ResetPassword,
	Settings,
	Tables,
	FileImport
} from '@components';
import { Navigation, Notification, SessionTimeout } from '@components/core';
import * as Constants from '@constants';
import './app.scss';
import FileImportStep2 from '@components/file-import/file-import-step2';

const App = () => {
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth);
	const { data, sideBar } = useSelector((state) => state.auth);
	const login = window.localStorage.getItem('login');
	const [state, setState] = useState(false);
	const navigationItems = Constants.APP_NAVIGATION;

	// login
	useEffect(() => {
		if (login) dispatch(relogin());
	}, [dispatch, login]);

	// resize
	useLayoutEffect(() => {
		const resize = () => {
			if (window.innerWidth > 720) {
				window.sessionStorage.setItem('mobile', 0);

				setState(false);
			} else {
				window.sessionStorage.setItem('mobile', 1);

				setState(true);
			}
		};

		window.addEventListener('resize', resize);

		resize();

		return () => window.removeEventListener('resize', resize);
	}, []);

	return (
		<BrowserRouter>
			<Alert />
			{login ? (
				<React.Fragment>
					{data && (
						<React.Fragment>
							<Navigation key={state} items={navigationItems} user={data} />
							<Container
								fluid
								data-test-id="main"
								className="h-100 d-flex flex-column jusify-content-center overflow-auto"
								style={{
									width: `calc(100vw - ${sideBar ? '90px' : 'var(--tango-navigation-width)'})`,
									left: sideBar ? '90px' : 'var(--tango-navigation-width)'
								}}
							>
								<Routes>
									<Route path="/dashboard" element={<Dashboard />} />
									<Route path="/import" element={<FileImport />} />
									<Route path="/import/step-2" element={<FileImportStep2 />} />
									<Route path="/tables/*" element={<Tables />} />
									<Route path="/settings/*" element={<Settings />} />
									<Route path="/logout" element={<Logout />} />
									<Route path="*" element={<Navigate replace to="/dashboard" />} />
								</Routes>
							</Container>
							<Notification />
							<SessionTimeout onIdle={() => dispatch(logout())} />
						</React.Fragment>
					)}
				</React.Fragment>
			) : (
				<React.Fragment>
					{auth.action === 'auth/fetching' && (
						<Loader style={{ backgroundColor: 'var(--tango-color-white)', opacity: '0.3' }} />
					)}
					<AuthenticateLayout>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/password/forgot" element={<ForgotPassword />} />
							<Route path="/password/reset" element={<ResetPassword />} />
							<Route path="/password/set" element={<SetPassword />} />
							<Route path="*" element={<Navigate replace to="/login" />} />
						</Routes>
					</AuthenticateLayout>
				</React.Fragment>
			)}
		</BrowserRouter>
	);
};

export default App;
