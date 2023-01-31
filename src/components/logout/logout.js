import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@reducers';

const Logout = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		window.sessionStorage.clear();

		dispatch(logout());
	}, [dispatch]);

	return <React.Fragment />;
};

export default Logout;
