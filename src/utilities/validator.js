export const isDate = (value) => {
	const rgx = /^\d{1,2}-\d{1,2}-\d{4}$/;

	return new Date(value) && rgx.test(value);
};

export const isDateTime = (value) => {
	const rgx = /^\d{2}:\d{2}:\d{2}$/;
	const rgx2 = /^([ap|AP])(m|M)$/;
	const splits = value.split(' ');

	return isDate(splits[0]) && rgx.test(splits[1]) && rgx2.test(splits[2]);
};
