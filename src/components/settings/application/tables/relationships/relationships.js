import React, { useEffect, useState } from 'react';
import { PageHeader, DataTable, Loader, UserDropDown } from '@components/core';
import { useDispatch, useSelector } from 'react-redux';
import { getTangoFields, getRelationships } from '@reducers';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Relationships = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();
	const { pathname } = useLocation();
	const { t } = useTranslation();

	const { relationships, fields } = useSelector((state) => state);

	const [columns, setColumns] = useState();
	const [rows, setRows] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [metadata, setMetadata] = useState();

	const tableName = params.table;

	//fetch fields & relationships
	useEffect(() => {
		dispatch(getTangoFields('tango59-table-relationships'));
		dispatch(getRelationships(tableName));
	}, [dispatch, tableName]);

	// //set columns
	useEffect(() => {
		if (fields.data && relationships.data) {
			if (relationships.data.length === 0) {
				setColumns([]);
				setRows([]);
			} else {
				const keys = Object.keys(relationships.data[0]);

				const cols = keys
					.filter(
						(key) =>
							[
								'_rid_',
								'total_rows',
								'is_active',
								'record_owner',
								'last_modified',
								'date_created',
								'date_modified',
								'last_modified_by'
								// 'on_clause',
								// 'parent_table',
								// 'child_table',
								// 'parent_table_ref_column'
							].indexOf(key) === -1
					)
					.map((key) => ({
						key,
						label: key.label
					}));

				setColumns(cols.filter((col) => col));

				const relationshipFields = JSON.parse(JSON.stringify(relationships.data)).map((relationship) => {
					const parentField = relationship.parent_table;
					const childField = relationship.child_table;
					let tableField = relationship.table;
					tableField = '';

					const newField = `${parentField} -< ${childField}`;

					relationship.relationship_type = relationship.relationship_type.replace('one-to-many', newField);
					relationship.table = tableField
						.replace('', `Each ${parentField.slice(0, -1)} has many ${childField}`)
						.replace('ie', 'y')
						.replace('Line', 'Lines')
						.replace('Audit', 'Audits');

					return relationship;
				});
				setRows(relationshipFields);
			}
		}
	}, [fields.data, relationships.data]);

	// // set rows & metadata
	useEffect(() => {
		if (relationships.data) {
			const { metadata } = relationships;
			setMetadata(metadata);
		}
	}, [relationships]);

	// //set is-loading
	useEffect(() => {
		if (columns && rows) setIsLoading(false);
	}, [columns, rows]);

	return (
		<React.Fragment>
			<PageHeader actions={<UserDropDown />} />
			{isLoading ? (
				<Loader />
			) : (
				<Container fluid data-test-id={tableName}>
					{relationships.action === 'relationships/fetching' && <Loader />}
					<DataTable
						style={{
							height: '68vh',
							boxShadow: '2px 4px 8px 1px rgba(0, 0, 0, 0.14)',
							borderRadius: '10px',
							border: '1px solid #DFDFDF'
						}}
						actions={
							<Button
								data-test-id="new"
								size="sm"
								disabled
								className="tango-green-button"
								onClick={() => {
									navigate(`${pathname}/new`);
								}}
							>
								+ {t('global:new.translation')} {t('global:relationships.translation').slice(14, -1)}
							</Button>
						}
						columns={columns}
						rows={rows}
						columnOptions={{
							resizable: true,
							sortable: false,
							disabled: true
						}}
					/>
					<Form.Group data-test-id="total-rows" className="d-flex justify-content-start align-items-center mt-4">
						<Form.Label className="overflow-visible">{t('global:total.translation')}:</Form.Label>
						<Form.Group className="ms-2 fw-bold ">{metadata.total_rows}</Form.Group>
					</Form.Group>
				</Container>
			)}
		</React.Fragment>
	);
};

export default Relationships;
