import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from '@components/app';
import store from '@store';
import './i18n';
import './index.scss';

if (process.env.NODE_ENV === 'production' && !sessionStorage.getItem('debug')) console.log = () => {}; // eslint-disable-line no-console

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
	<Provider store={store}>
		<App />
	</Provider>
);
