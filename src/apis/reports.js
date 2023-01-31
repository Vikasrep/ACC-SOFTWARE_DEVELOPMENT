import request from './fetch/request';
import { getFetchCollectionParams } from './utilities';

export const getReport = async (table, id, params) => {
	const options = {
		url: `/table/report/${table}/${id}${getFetchCollectionParams(params)}`,
		method: 'get'
	};

	return request(options);
};

export const getReports = async (table) => {
	const options = {
		url: `/report/${table}`,
		method: 'get'
	};

	return request(options);
};

export const getReportsAndCharts = async (table, params) => {
	const options = {
		url: `/reports/${table}${getFetchCollectionParams(params)}`,
		method: 'get'
	};

	return request(options);
};
