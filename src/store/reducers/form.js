import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, getForm as apiGetForm } from '@apis';
import { catchObject } from '@utilities';

const slice = createSlice({
	name: 'form',
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
			state.data = payload.data;
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

export const getForm = (table, id) => async (dispatch) => {
	if (!table) throw Error('missing table parameter');
	if (!id) throw Error('missing table body');

	try {
		dispatch(fetching());

		apiGetForm(table, id).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};
