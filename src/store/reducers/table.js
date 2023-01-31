import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, getTable as apiGetTable, saveTable as apiSaveTable } from '@apis';
import { catchObject } from '@utilities';

const slice = createSlice({
	name: 'table',
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

const { failure, fetched, fetching, saved, saving } = slice.actions;

export default slice.reducer;

export const getTable = (table, id) => async (dispatch) => {
	if (!table) throw Error('table param is required');
	if (!id) throw Error('id param is required');

	try {
		dispatch(fetching());

		apiGetTable(table, id).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};

export const saveTable = (table, body) => async (dispatch) => {
	if (!table) throw Error('table param is required');
	if (!body) throw Error('body param is required');

	try {
		dispatch(saving());

		apiSaveTable(table, body).then((response) => {
			if (apiRequestIsValid(response)) dispatch(saved(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(error));
	}
};
