import { createSlice } from '@reduxjs/toolkit';
import { apiRequestIsValid, getPermissions as apiGetPermissions } from '@apis';

const Permissiondata = {
	add: null,
	created_by: null,
	date_created: null,
	date_modified: null,
	delete: null,
	edit_field_properties: null,
	fields: null,
	is_active: null,
	modified_by: null,
	modify: null,
	role_id: null,
	role_name: null,
	save_common_reports: null,
	table: null,
	total_rows: null,
	view: null
};

const slice = createSlice({
	name: 'userpermissions',
	initialState: {
		action: null,
		data: Permissiondata,
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
			state.data = payload.data || state.data;
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

export const getUserPermissions = (table, id) => async (dispatch) => {
	if (!table) throw Error('table param is required');

	try {
		dispatch(fetching());

		apiGetPermissions(table, id).then((response) => {
			if (apiRequestIsValid(response)) {
				const { role_id } = JSON.parse(window.sessionStorage.getItem('login')).data[0];
				dispatch(fetched({ ...response, data: response.data.find((row) => row.role_id === role_id) }));
			} else dispatch(failure(response));
		});
	} catch (error) {
		dispatch(failure(error));
	}
};
