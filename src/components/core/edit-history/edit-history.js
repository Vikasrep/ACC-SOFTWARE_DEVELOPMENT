import React, { useState, useEffect } from 'react';
import { DataTable } from '@components/core';
import { Modal, Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getEditHistory, getEditHistoryFields } from '@reducers';
import { useTranslation } from 'react-i18next';

const EditHistory = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [columns, setColumns] = useState();
	const [rows, setRows] = useState();
	const editHistory = useSelector((state) => state.editHistory);
	const editHistoryFields = useSelector((state) => state.editHistoryFields);
	const [modalShow, setModalShow] = useState(false);
	const params = useParams();
	const paramsId = params.id;
	const paramsTable = params['*'].split('/')[0];

	//set columns & rows
	useEffect(() => {
		if (editHistory.data && editHistoryFields.data) {
			if (editHistory.data.length === 0) {
				setColumns([]);
				setRows([]);
			} else {
				const keys = Object.keys(editHistory.data[0]);
				const cols = keys.map((key) => {
					const field = editHistoryFields.data.find((field) => field.property_name === key);

					if (!field) return null;

					return {
						key,
						label: field.label,
						field_type: field.field_type
					};
				});

				setColumns(cols.filter((col) => col));

				const historyRows = JSON.parse(JSON.stringify(editHistory.data)).map((history) => {
					const oldField = history.old;
					const newField = history.new;

					history.old = Object.values(JSON.parse(oldField)).join(', ');
					history.new = Object.values(JSON.parse(newField)).join(', ');

					return history;
				});

				setRows(historyRows);
			}
		}
	}, [editHistory.data, editHistoryFields.data]);

	return (
		<React.Fragment>
			<Container fluid data-test-id="edit-history-modal">
				<Button
					style={{ color: 'var(--tango-color-lighter-green)' }}
					variant="link"
					onClick={() => {
						setModalShow(true);
						dispatch(getEditHistory(paramsTable, paramsId));
						dispatch(getEditHistoryFields('edit_history'));
					}}
				>
					{t('global:view-edit-history.translation')}
				</Button>
				<Modal
					size="xl"
					centered
					data-test-id="edit-history-modal"
					show={modalShow}
					onHide={() => {
						setModalShow(false);
					}}
				>
					<Modal.Header closeButton style={{ borderBottom: '0 none' }}>
						<Modal.Title id="contained-modal-title-vcenter" className="text-capitalize">
							{t('global:edit-history-of.translation')} {paramsTable}: #{paramsId}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<DataTable
							columns={columns || []}
							rows={rows || []}
							columnOptions={{
								resizable: true,
								disabled: true
							}}
							onFetch={() => {
								dispatch(getEditHistory(paramsTable, paramsId));
							}}
						/>
					</Modal.Body>
				</Modal>
			</Container>
		</React.Fragment>
	);
};

export default EditHistory;
