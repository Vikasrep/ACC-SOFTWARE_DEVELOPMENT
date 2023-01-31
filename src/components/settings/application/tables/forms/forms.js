import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { PageHeader, DataTable, Loader } from '@components/core';
import { getForms, getTangoFields, deleteForm, showNotification } from '@reducers';
import NewForm from './new-form';
import FormAdd from './form-add';

const Forms = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();

	const forms = useSelector((state) => state.forms);
	const fields = useSelector((state) => state.fields);

	const [columns, setColumns] = useState();
	const [rows, setRows] = useState();
	const [isLoading, setIsLoading] = useState(true);

	const tableName = params.table;

	useEffect(() => {
		tableListRefresh();
		dispatch(getTangoFields('tango59_forms'));
	}, [dispatch, tableListRefresh, tableName]);

	const tableListRefresh = useCallback(() => {
		dispatch(getForms(tableName));
	}, [dispatch, tableName]);

	//set columns
	useEffect(() => {
		if (fields.data && forms.data) {
			if (forms.data.length === 0) {
				setColumns([]);
			} else {
				const keys = Object.keys(forms.data[0]);
				const cols = keys
					.filter((key) => ['_rid_', 'total_rows', 'table_name'].indexOf(key) === -1)
					.map((key) => ({
						key,
						label: key.label
					}));

				setColumns(cols.filter((col) => col));
			}
		}
	}, [fields.data, forms.data]);

	//fetch rows
	useEffect(() => {
		if (forms.data) {
			const { data } = forms;
			setRows(data);
		}
	}, [forms]);

	// set is-loading
	useEffect(() => {
		if (columns && rows) {
			setIsLoading(false);
		}
	}, [columns, rows]);

	return (
		<React.Fragment>
			<PageHeader actions={<FormAdd />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id="forms">
					{
						{
							others: (
								<DataTable
									rows={rows}
									columns={columns}
									columnOptions={{
										resizable: true,
										sortable: false,
										disabled: true
									}}
									columnActions={[
										{
											id: 'edit',
											action: (val) => {
												navigate(`/settings/application/tables/${tableName}/forms/${val.form_id}/edit`);
											}
										},
										{
											id: 'delete',
											action: async (row) => {
												const data = await dispatch(deleteForm(row.form_id));

												const notification = {
													title: 'Form Created',
													message: data.message,
													show: true,
													type: 'success'
												};

												if (!data.success) {
													notification.message = 'Form has not been created. Please try again.';
													notification.type = 'danger';
												} else {
													tableListRefresh();
												}
												dispatch(showNotification(notification));
											}
										}
									]}
								/>
							),
							new: <NewForm />
						}[params.action === 'new' ? params.action : 'others']
					}
				</Container>
			)}
		</React.Fragment>
	);
};

export default Forms;
