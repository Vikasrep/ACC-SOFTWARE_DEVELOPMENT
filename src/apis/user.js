import request from './fetch/request';

export const updateuser = async (body) => {
	const options = {
		url: '/user-role-membership',
		method: 'PATCH',
		body
	};

	return request(options);
};
