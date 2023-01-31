import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import {
	auth,
	fields,
	form,
	forms,
	notification,
	report,
	table,
	tables,
	tableSetting,
	tableSettings,
	queries,
	query,
	permissions,
	reportsAndCharts,
	relationships,
	editHistory,
	editHistoryFields,
	tablePermissions,
	fieldsTable,
	roles,
	userpermissions,
	keyFields,
	User,
	field,
	fieldTypes
} from './reducers';

const reducer = {
	auth,
	fields,
	form,
	forms,
	notification,
	report,
	table,
	tables,
	tableSetting,
	tableSettings,
	permissions,
	relationships,
	editHistory,
	editHistoryFields,
	queries,
	query,
	fieldsTable,
	reportsAndCharts,
	roles,
	userpermissions,
	tablePermissions,
	keyFields,
	User,
	field,
	fieldTypes
};

let middleware = () => getDefaultMiddleware({ serializableCheck: false }).concat(logger);

if (process.env.NODE_ENV === 'production') {
	middleware = (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false });
}

const store = configureStore({
	reducer,
	middleware
});

export default store;
