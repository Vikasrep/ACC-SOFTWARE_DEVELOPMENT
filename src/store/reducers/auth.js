import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, login as apiLogin, logout as apiLogout, UserProfile, refreshToken } from '@apis';
import { catchObject } from '@utilities';
import { showNotification } from '@reducers';
const slice = createSlice({
	name: 'auth',
	initialState: {
		action: null,
		data: null,
		error: null,
		message: null,
		success: null,
		isLoggedIn: false,
		sideBar: true
	},
	reducers: {
		fetching: (state, { type }) => {
			state.action = type;
			state.error = null;
			state.message = null;
			state.success = null;
			state.isLoggedIn = false;
		},
		fetched: (state, { type, payload }) => {
			state.action = type;
			state.data = payload.data[0];
			state.error = payload.error;
			state.message = payload.message;
			state.success = payload.success;
			state.isLoggedIn = true;
		},
		failure: (state, { type, payload }) => {
			state.action = type;
			state.error = payload.error;
			state.message = payload.message;
			state.success = payload.success;
			state.isLoggedIn = false;
		},
		refresh: (state, { type, payload }) => {
			state.action = type;
			state.data = payload.data[0];
			state.error = payload.error;
			state.message = payload.message;
			state.isLoggedIn = true;
		},
		unauthenticated: (state, { type }) => {
			state.action = type;
			state.data = null;
			state.error = null;
			state.message = null;
			state.success = null;
			state.isLoggedIn = false;
		},
		sideBarUpdateChange: (state, { payload }) => {
			state.sideBar = payload;
		}
	}
});

const { failure, fetched, fetching, refresh, unauthenticated, sideBarUpdateChange } = slice.actions;

export default slice.reducer;

export const login = (username, password) => async (dispatch) => {
	try {
		dispatch(fetching());

		apiLogin(username, password).then((response) => {
			if (apiRequestIsValid(response)) {
				window.localStorage.setItem('login', JSON.stringify(response));

				dispatch(fetched(response));
			} else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};

export const logout = () => async (dispatch) => {
	window.localStorage.removeItem('login');

	apiLogout();

	dispatch(unauthenticated());
};

export const relogin = () => async (dispatch) => {
	const auth = window.localStorage.getItem('login');

	auth && dispatch(refresh(JSON.parse(auth)));
};

export const UserProfileUpdate = (body) => async (dispatch) => {
	try {
		dispatch(fetching());

		UserProfile(body).then((response) => {
			if (apiRequestIsValid(response)) {
				let Data = [...response.data];
				Data[0]['access_token'] = JSON.parse(window.localStorage.getItem('login')).data[0].access_token;
				let responseChange = { ...response, data: [...Data] };
				dispatch(refresh(responseChange));
			} else dispatch(failure(response));

			const notification = {
				title: 'User Update',
				message: response.message,
				show: true,
				type: 'success'
			};

			if (!response.success) {
				// notification.message = response.message;
				notification.type = 'danger';
			}
			dispatch(showNotification(notification));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};

export const sideBarUpdate = (value) => async (dispatch) => {
	dispatch(sideBarUpdateChange(value));
};

export const access_token = () => async (dispatch) => {
	const data = await refreshToken().then((data) => data);
	const login = JSON.parse(window.localStorage.getItem('login'));

	login &&
		data &&
		dispatch(
			refresh({
				...login,
				data: [{ ...login?.data[0], access_token: data?.data[0]?.access_token }]
			})
		);
};
