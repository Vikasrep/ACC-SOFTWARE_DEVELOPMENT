export const apiRequestIsValid = (response) => response.success;

export const getFetchCollectionParams = (params = {}, pagintaion = true) => {
	const defaults = pagintaion ? { pageIndex: 1, pageSize: 25 } : {};

	Object.keys(params).forEach((key) => {
		const newKey = key
			.replaceAll('_', ' ')
			.replaceAll(/(^\w|\s\w)/g, (firstChar) => firstChar.toUpperCase())
			.replaceAll(' ', '')
			.replaceAll(/(^\w|\s\w)/g, (firstChar) => firstChar.toLowerCase());

		params[newKey] = params[key];

		delete params[key];
	});

	params = Object.assign(defaults, params);

	delete params.totalRows;

	!params.sortColumn && delete params.sortColumn;
	!params.sortDirection && delete params.sortDirection;
	!params.searchColumn && delete params.searchColumn;
	!params.searchText && delete params.searchText;
	!params.searchColumn && delete params.searchColumn;
	!params.filterText && delete params.filterText;
	!params.filterColumn && delete params.filterColumn;
	!params.whereClause && delete params.whereClause;

	return `?${new URLSearchParams(params)}`;
};
