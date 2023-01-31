export const hideSelector = (selector, hide = true, type = 'block') => {
	const element = document.querySelector(selector);

	if (element) {
		if (hide) type = 'none';

		element.style.setProperty('display', type, 'important');
	}
};
