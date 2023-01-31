export const queryParams = (param) => {
	const params = new URLSearchParams(window.location.search);

	return params.get(param);
};

export const isMobile = () => Boolean(Number(window.sessionStorage.getItem('mobile')));
