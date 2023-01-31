import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, getQuery as apiGetQuery } from '@apis';
import { catchObject } from '@utilities';

const slice = createSlice({
	name: 'query',
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
		reset: (state) => {
			state.action = null;
			state.data = null;
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
		}
	}
});

const { failure, fetched, fetching, reset } = slice.actions;

export default slice.reducer;

export const getQuery = (table, id) => async (dispatch) => {
	if (!table) throw Error('missing table parameter');
	if (!id) throw Error('missing id parameter');

	try {
		dispatch(fetching());

		apiGetQuery(table, id).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};

export const blankQuery = () => async (dispatch) => {
	try {
		dispatch(reset());
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};
