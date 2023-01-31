import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, updateuser } from '@apis';

const slice = createSlice({
	name: 'user',
	initialState: {
		action: null,
		data: null,
		error: null,
		message: null,
		metadata: null,
		success: null
	},
	reducers: {
		fetching: (state, { type }) => {
			state.action = type;
			state.error = null;
			state.message = null;
			state.metadata = null;
			state.success = null;
		},
		fetched: (state, { type, payload }) => {
			state.action = type;
			state.data = payload.data[0];
			state.error = payload.error;
			state.message = payload.message;
			state.metadata = payload.metadata;
			state.success = payload.success;
		},
		failure: (state, { type, payload }) => {
			state.action = type;
			state.error = payload.error;
			state.message = payload.message;
			state.success = payload.success;
		},
		saving: (state, { type }) => {
			state.action = type;
			state.error = null;
			state.message = null;
			state.metadata = null;
			state.success = null;
		},
		saved: (state, { type, payload }) => {
			state.action = type;
			state.error = payload.error;
			state.message = payload.message;
			state.metadata = payload.metadata;
			state.success = payload.success;
		}
	}
});

export default slice.reducer;

export const updateUser = (body) => async () => {
	if (!body) throw Error('body param is required');

	try {
		return updateuser(body).then((response) => {
			if (apiRequestIsValid(response)) {
				return { ...response };
			} else {
				return { ...response };
			}
		});
	} catch (error) {
		return { ...error };
	}
};
