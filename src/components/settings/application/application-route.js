import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Application from './application';
import Roles from './roles';
import UserRolePermissions from './roles/permissions';
import Tables from './tables';

const ApplicationRoute = () => (
	<Routes>
		<Route path="/" element={<Application />} />
		<Route path="/roles" element={<Roles />} />
		<Route path="/roles/:id/:action" element={<UserRolePermissions />} />
		<Route path="/tables/*" element={<Tables />} />
		<Route path="*" element={<Navigate replace to="/settings/application" />} />
	</Routes>
);

export default ApplicationRoute;
