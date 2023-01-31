import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, getReport as apiGetReport } from '@apis';
import { catchObject } from '@utilities';

const slice = createSlice({
	name: 'report',
	initialState: {
		action: null,
		data: null,
		fields: null,
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
			state.fields = payload.fields;
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
		},
		saving: (state, { type }) => {
			state.action = type;
			state.error = null;
			state.message = null;
			state.success = null;
		},
		saved: (state, { type, payload }) => {
			state.action = type;
			state.data = payload.data;
			state.error = payload.error;
			state.message = payload.message;
			state.success = payload.success;
		}
	}
});

const { failure, fetched, fetching } = slice.actions;

export default slice.reducer;

export const getReport = (table, id, params) => async (dispatch) => {
	if (!table) throw Error('missing table parameter');
	if (!id) throw Error('missing table body');

	try {
		dispatch(fetching());

		apiGetReport(table, id, params).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};
