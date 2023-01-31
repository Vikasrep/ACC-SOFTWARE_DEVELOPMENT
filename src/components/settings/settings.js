import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Account from './account';
import ApplicationRoute from './application/application-route';
import { PermissionAccess } from '@components/core';
import Users from './users';

const Settings = () => {
	const [Access, setAccess] = useState(false);

	const [UserAccess, setUserAccess] = useState(false);

	const { role_id } = useSelector((state) => state.auth.data);

	useEffect(() => {
		if ([1, 17].includes(role_id)) {
			setAccess(true);
		}
		if (role_id === 1) {
			setUserAccess(true);
		}
	}, [role_id]);

	return (
		<Routes>
			{Access ? (
				<>
					<Route path="/application/*" element={<ApplicationRoute />} />
					{UserAccess ? <Route path="/users" element={<Users />} /> : null}
					<Route path="/account" element={<Account />} />
					<Route path="*" element={<Navigate replace to="/settings/application" />} />
				</>
			) : (
				<>
					<Route path="*" element={<PermissionAccess />} />
				</>
			)}
		</Routes>
	);
};

export default Settings;
