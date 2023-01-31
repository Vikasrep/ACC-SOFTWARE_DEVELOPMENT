import request from './fetch/request';
import { getFetchCollectionParams } from './utilities';

export const getTable = async (table, id) => {
	const options = {
		url: `/${table}/${id}`,
		method: 'get'
	};
	return request(options);
};

export const getTables = async (table, params) => {
	const options = {
		url: `/${table}${getFetchCollectionParams(params)}`,
		method: 'get'
	};

	return request(options);
};

export const getPermissions = async (table, id) => {
	const options = {
		url: `/${table}/${id}`,
		method: 'get'
	};
	return request(options);
};

export const getRoles = async (table) => {
	const options = {
		url: `/${table}`,
		method: 'get'
	};
	return request(options);
};

export const getRelationships = async (table) => {
	const options = {
		url: `/tango59-table-relationships/${table}`,
		method: 'get'
	};
	return request(options);
};

export const getTablePermissions = async (table) => {
	const options = {
		url: `/user-role-permissions/${table}`,
		method: 'get'
	};
	return request(options);
};

export const updateTablePermission = async (body) => {
	const options = {
		url: '/user-role-permission',
		method: 'PATCH',
		body
	};
	return request(options);
};

export const getAllTables = async () => {
	const options = {
		url: '/tables',
		method: 'get'
	};
	return request(options);
};

export const getAllTangoTables = async (params) => {
	const options = {
		url: `/tables${getFetchCollectionParams(params)}`,
		method: 'get'
	};
	return request(options);
};

export const getExcelReports = async (table, params = {}) => {
	const options = {
		url: `/excelexport/${table}/1${getFetchCollectionParams(params, false)}`,
		method: 'POST'
	};

	return request(options);
};

export const saveTable = async (table, body) => {
	const options = {
		url: `/${table}`,
		method: 'PATCH',
		body
	};

	return request(options);
};

export const saveTables = async (table, body) => {
	const options = {
		url: `/${table}`,
		method: 'PATCH',
		body
	};

	return request(options);
};
