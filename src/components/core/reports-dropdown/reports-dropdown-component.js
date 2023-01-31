import React, { useState, useEffect } from 'react';
import { getQueries } from '@reducers';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '@components/core';
import ReportsDropdown from './reports-dropdown';
import { useParams } from 'react-router-dom';

const ReportsDropdownComponent = () => {
	const dispatch = useDispatch();

	const params = useParams();
	const queries = useSelector((state) => state.queries);

	const [isLoading, setIsLoading] = useState(true);
	const [metadata, setMetadata] = useState();
	const [pagination, setPagination] = useState();
	const paramsTable = params['*'].split('/')[0];

	useEffect(() => {
		dispatch(getQueries(paramsTable));
	}, [dispatch, paramsTable]);

	useEffect(() => {
		const { metadata } = queries;
		setMetadata(metadata);
		setPagination(metadata);
	}, [queries]);

	useEffect(() => {
		if (queries.action === 'queries/fetched' && isLoading && metadata && pagination) {
			setIsLoading(false);
		}
	}, [metadata, pagination, isLoading, queries]);

	return (
		<React.Fragment>
			{isLoading ? (
				<Loader />
			) : (
				<ReportsDropdown
					reportbar={{
						search: {
							text: metadata.search_text,
							func: (text) => {
								const meta = { ...metadata };

								meta['search_text'] = text;

								window.sessionStorage.setItem('dropdown-metadata', JSON.stringify(meta));

								dispatch(getQueries(paramsTable, meta));
							}
						}
					}}
					pagination={pagination}
					onFetch={(meta) => {
						window.sessionStorage.setItem('dropdown-metadata', JSON.stringify(meta));

						dispatch(getQueries(paramsTable, meta));
					}}
				/>
			)}
		</React.Fragment>
	);
};

export default ReportsDropdownComponent;
