import request from './fetch/request';
import { getFetchCollectionParams } from './utilities';

export const getQueries = async (table, params) => {
	const options = {
		url: `/queries/${table}${getFetchCollectionParams(params)}`,
		method: 'get'
	};

	return request(options);
};

export const getQuery = async (table, id) => {
	const options = {
		url: `/query/${table}/${id}`,
		method: 'get'
	};

	return request(options);
};
