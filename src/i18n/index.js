import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';

const locales = {
	en
};

const resources = {};

Object.keys(locales).forEach((locale) => {
	resources[locale] = {
		translation: locales[locale]
	};
});

i18n.use(initReactI18next).init({
	resources,
	lng: 'en',
	fallback: 'en',
	debug: false,
	interoplation: {
		prefix: '{',
		suffix: '}',
		escapeValue: false
	},
	nsSeparator: false,
	keySeparator: '.'
});

export default i18n;
