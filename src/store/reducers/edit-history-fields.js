import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, getEditHistoryFields as apiGetEditHistoryFields } from '@apis';
import { catchObject } from '@utilities';

const slice = createSlice({
	name: 'editHistoryFields',
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
			(state.data = null), (state.error = null);
			state.message = null;
			state.metadata = null;
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
		}
	}
});

const { failure, fetched, fetching } = slice.actions;

export default slice.reducer;

export const getEditHistoryFields = (table) => async (dispatch) => {
	if (!table) throw Error('table param is required');

	try {
		dispatch(fetching());

		apiGetEditHistoryFields(table).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};
