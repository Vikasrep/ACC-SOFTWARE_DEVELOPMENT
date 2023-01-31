import request from './fetch/request';

export const getForm = async (table, id) => {
	const options = {
		url: `/form/${table}/${id}`,
		method: 'get'
	};

	return request(options);
};

export const getForms = async (table) => {
	const options = {
		url: `/forms/${table}`,
		method: 'get'
	};

	return request(options);
};

export const deleteForms = async (table) => {
	const options = {
		url: `/form/${table}`,
		method: 'DELETE'
	};

	return request(options);
};
