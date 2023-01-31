import { createSlice } from '@reduxjs/toolkit';
import {
	apiRequestIsValid,
	getTables as apiGetTables,
	saveTables as apiSaveTables,
	getAllTables as apiGetAllTables,
	getAllTangoTables as apiGetAllTangoTables
} from '@apis';
import { catchObject } from '@utilities';

const slice = createSlice({
	name: 'tables',
	initialState: {
		action: null,
		data: null,
		error: null,
		fields: null,
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
			state.fields = payload.fields;
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

export const getTables = (table, params) => async (dispatch) => {
	if (!table) throw Error('table param is required');

	try {
		dispatch(fetching());

		apiGetTables(table, params).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};

export const getAllTables = () => async (dispatch) => {
	try {
		dispatch(fetching());

		apiGetAllTables().then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};

export const getAllTangoTables = (params) => async (dispatch) => {
	try {
		dispatch(fetching());

		apiGetAllTangoTables(params).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(catchObject(error)));
	}
};

export const saveTables = (table, body) => async (dispatch) => {
	if (!table) throw Error('table param is required');
	if (!body) throw Error('body param is required');

	try {
		dispatch(fetching());

		apiSaveTables(table, body).then((response) => {
			if (apiRequestIsValid(response)) dispatch(fetched(response));
			else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(error));
	}
};
