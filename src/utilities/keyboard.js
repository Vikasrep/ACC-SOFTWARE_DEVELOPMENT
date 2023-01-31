/*
	params:
		event: action event
		element: to click

	usage:
		const ref = useRef();

		onKeyDown={(event) => onEnterClick(event, ref.current)}
*/
export const onEnterClick = (event, element) => {
	if (event.key === 'Enter') element.click();
};
