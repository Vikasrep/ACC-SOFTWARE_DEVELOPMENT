import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, getField as apiGetField } from '@apis';
import { catchObject } from '@utilities';

const slice = createSlice({
	name: 'field',
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
		reset: (state) => {
			state.action = null;
			state.data = null;
			state.error = null;
			state.message = null;
			state.metadata = null;
			state.success = null;
		}
	}
});

const { failure, fetched, fetching, reset } = slice.actions;

export default slice.reducer;

export const getField = (table, id) => async (dispatch) => {
	if (!table) throw Error('missing table parameter');
	if (!id) throw Error('missing table body');

	try {
		dispatch(fetching());

		apiGetField(table, id).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};

export const blankField = () => async (dispatch) => {
	try {
		dispatch(reset());
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};
