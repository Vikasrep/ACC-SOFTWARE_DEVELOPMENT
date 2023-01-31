import request from './fetch/request';

export const login = async (username, password) => {
	const options = {
		url: '/login',
		method: 'post',
		body: {
			username,
			password
		}
	};

	return request(options);
};

export const logout = () => {
	const options = {
		url: '/logout',
		method: 'post'
	};

	return request(options);
};

export const UserProfile = (body) => {
	const options = {
		url: '/user',
		method: 'PATCH',
		body
	};

	return request(options);
};

export const refreshToken = (body) => {
	const options = {
		url: '/refresh-token',
		method: 'get',
		body
	};

	return request(options);
};
