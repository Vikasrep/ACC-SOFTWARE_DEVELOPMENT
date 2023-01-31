import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Setting from './setting';
import SettingsMenuItems from './settings-menu-items';
import AppTables from './app-tables';
import ReportView from './reports-and-charts/report-view';
import NewForm from './forms/new-form';
import FieldView from './fields/field-view';
import ChangeFieldType from './fields/change-field-type';
import AdvancedSettings from './advanced-settings';

const Tables = () => (
	<Routes>
		<Route path="/" element={<AppTables />} />
		<Route path="/:table" element={<SettingsMenuItems />} />
		<Route path="/:table/:setting" element={<Setting />} />
		<Route path="/:table/forms/:id/:action" element={<NewForm />} />
		<Route path="/:table/reports/:id/:action" element={<ReportView />} />
		<Route path="/:table/reports/:action" element={<ReportView />} />
		<Route path="/:table/fields/:id" element={<FieldView />} />
		<Route path="/:table/advanced-settings" element={<AdvancedSettings />} />
		<Route path="/:table/fields/:id/change-field-type" element={<ChangeFieldType />} />
	</Routes>
);

export default Tables;
