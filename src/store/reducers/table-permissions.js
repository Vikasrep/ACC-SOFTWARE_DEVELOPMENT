import { createSlice } from '@reduxjs/toolkit';
import {
	apiRequestIsValid,
	getTablePermissions as apiGetTablePermissions,
	updateTablePermission as apiUpdateTablePermission
} from '@apis';

const slice = createSlice({
	name: 'tablePermissions',
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
		}
	}
});

const { failure, fetched, fetching } = slice.actions;

export default slice.reducer;

export const getTablePermissions = (table) => async (dispatch) => {
	if (!table) throw Error('table param is required');

	try {
		dispatch(fetching());

		apiGetTablePermissions(table).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(error));
	}
};

export const updateTablePermission = (body) => async () => {
	if (!body) throw Error('body param is required');
	try {
		return apiUpdateTablePermission(body).then((response) => {
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
