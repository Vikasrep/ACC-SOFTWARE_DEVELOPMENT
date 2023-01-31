import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'notification',
	initialState: {
		autohide: null,
		message: null,
		show: null,
		title: null,
		type: null
	},
	reducers: {
		hide: (state) => {
			state.autohide = null;
			state.message = null;
			state.show = false;
			state.title = null;
			state.type = null;
		},
		show: (state, { payload }) => {
			state.autohide = payload.autohide;
			state.message = payload.message;
			state.show = true;
			state.title = payload.title;
			state.type = payload.type;
		}
	}
});

const { hide, show } = slice.actions;

export default slice.reducer;

export const hideNotification = () => async (dispatch) => {
	dispatch(hide());
};

export const showNotification = (options) => async (dispatch) => {
	dispatch(show(options));
};
