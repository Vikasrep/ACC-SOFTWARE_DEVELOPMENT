const dateOptions = {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit'
};

const datetimeOptions = {
	...dateOptions,
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
};

const formatDate = (value) => value.replaceAll('/', '-').replaceAll(',', '');

export const currencyFormatter = (value, currency) => {
	const formatter = new Intl.NumberFormat(navigator.language, {
		style: 'currency',
		currency: currency || 'USD'
	});

	return formatter.format(value || 0);
};

export const dateFormatter = (value) => {
	const formatter = new Intl.DateTimeFormat(navigator.language, dateOptions);

	return formatDate(formatter.format(new Date(value)));
};

export const datetimeFormatter = (value) => {
	const formatter = new Intl.DateTimeFormat(navigator.language, datetimeOptions);

	return value === null ? '' : formatDate(formatter.format(new Date(value)));
};
