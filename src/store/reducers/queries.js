import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, getQueries as apiGetQueries } from '@apis';
import { catchObject } from '@utilities';

const slice = createSlice({
	name: 'queries',
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
			state.success = null;
		},
		fetched: (state, { type, payload }) => {
			state.action = type;
			state.controller = null;
			state.data = payload.data;
			state.error = payload.error;
			state.message = payload.message;
			state.metadata = payload.metadata;
			state.success = payload.success;
		},
		failure: (state, { type, payload }) => {
			state.action = type;
			state.controller = null;
			state.error = payload.error;
			state.message = payload.message;
			state.success = payload.success;
		}
	}
});

const { failure, fetched, fetching } = slice.actions;

export default slice.reducer;

export const getQueries = (table, params) => async (dispatch) => {
	if (!table) throw Error('missing table parameter');

	try {
		dispatch(fetching());

		apiGetQueries(table, params).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};
