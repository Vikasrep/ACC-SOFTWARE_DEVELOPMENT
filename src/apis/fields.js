import request from './fetch/request';
import { getFetchCollectionParams } from './utilities';

export const getField = async (table, id) => {
	const options = {
		url: `/v2/fields/${table}/${id}`,
		method: 'get'
	};

	return request(options);
};

export const getKeyFields = async (table) => {
	const options = {
		url: `/v2/fields/${table}/unique`,
		method: 'get'
	};

	return request(options);
};

export const getFieldsTable = async (table, params) => {
	const options = {
		url: `/v2/fields/${table}/${getFetchCollectionParams(params)}`,
		method: 'get'
	};

	return request(options);
};

//new tango field apis
export const getTangoFields = async (table) => {
	const options = {
		url: `/v2/fields/${table}`,
		method: 'get'
	};

	return request(options);
};

export const getFieldTypes = async () => {
	const options = {
		url: '/tango59fieldtypes',
		method: 'get'
	};

	return request(options);
};
