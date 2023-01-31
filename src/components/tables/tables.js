import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Loader } from '@components/core';
import TableList from './table-list';
import TableView from './table-view';
import * as Constants from '@constants';

const Tables = () => {
	const dispatch = useDispatch();
	const params = useParams();

	const [routes, setRoutes] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [reportId, setReportId] = useState();
	const [reportName, setReportName] = useState();

	// set report, report-name, routes, is-loading
	useEffect(() => {
		const routes = Constants.APP_NAVIGATION.find((item) => item.id === 'tables').subItems.filter(
			(item) => item.visible
		);

		// cleanup();
		setReportId(1);
		setReportName('list-all');
		setRoutes(routes);
		setIsLoading(false);

		// cleanup
		return () => {
			window.sessionStorage.removeItem('tables-metadata');
		};
	}, [dispatch]);

	// remove session-storage
	useEffect(() => {
		if (params['*'].split('/').length < 3) {
			window.sessionStorage.removeItem('tables-metadata');
		}
	}, [params]);

	return (
		<React.Fragment>
			{isLoading ? (
				<Loader />
			) : (
				<Routes>
					{routes.map((item, index) => {
						const table = item.id;
						const tableField = item.routeField;
						const path = `${item.route.replace('/tables', '')}/${reportName}`;

						return (
							<React.Fragment key={index}>
								<Route path={path} element={<TableList key={table} table={table} reportId={reportId} />} />
								<Route
									path={`${path}/:id/:action`}
									element={
										<TableView
											key={table}
											table={table}
											tableField={tableField}
											reportId={reportId}
											reportName={reportName}
										/>
									}
								/>
							</React.Fragment>
						);
					})}
					<Route
						key="*"
						path="*"
						element={<Navigate replace to={`/tables/${params['*'] || routes[0].id}/list-all`} />}
					/>
				</Routes>
			)}
		</React.Fragment>
	);
};

export default Tables;
