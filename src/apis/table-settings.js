import request from './fetch/request';

export const getTableSetting = async (table, id) => {
	const options = {
		url: `/table-settings/${table}/${id}`,
		method: 'get'
	};

	return request(options);
};

export const getTableSettings = async (table) => {
	const options = {
		url: `/table-settings/${table}`,
		method: 'get'
	};

	return request(options);
};

export const postTableSetting = async (table, body) => {
	const options = {
		url: `/table-settings/${table}`,
		method: 'post',
		body
	};

	return request(options);
};

export const putTableSetting = async (table, body) => {
	const options = {
		url: `/table-settings/${table}/${body.id}`,
		method: 'put',
		body
	};

	return request(options);
};
