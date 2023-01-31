import request from './fetch/request';

export const getEditHistory = async (table, id) => {
	const options = {
		url: `/edit-history/${table}/${id}`,
		method: 'get'
	};

	return request(options);
};

export const getEditHistoryFields = async (table) => {
	const options = {
		url: `/v2/fields/${table}`,
		method: 'get'
	};

	return request(options);
};
