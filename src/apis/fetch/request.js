const request = async ({ body, headers = {}, method, signal, url }) => {
	const store = require('../../store').default;
	const storeAction = require('../../store/reducers');
	const token = store.getState().auth.data ? store.getState().auth.data.access_token : null;

	if (token) headers['authorization'] = `Bearer ${token}`;

	headers['content-type'] = 'application/json;charset-UTF-8';

	url = `${process.env.API_URL}${url}`;
	try {
		return await fetch(url, {
			method,
			headers,
			body: body ? JSON.stringify(body) : null,
			signal
		})
			.then((response) => {
				if (response.status === 401) {
					throw response;
				}
				return response.clone().json();
			})
			.then((data) => data);
	} catch (error) {
		if (error.status === 401) {
			store.dispatch(storeAction.logout());
		}

		return { error };
	}
};

export default request;
