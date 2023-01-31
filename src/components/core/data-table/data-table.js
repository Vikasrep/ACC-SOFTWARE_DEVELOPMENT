import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Container, Spinner } from 'react-bootstrap';
import ReactDataGrid, { SelectColumn } from 'react-data-grid';
import DataTableActionsFormatter from './data-table-actions-formatter';
import DataTableCheckboxFormatter from './data-table-checkbox-formatter';
import DataTableDetails from './data-table-details';
import DataTablePagination from './data-table-pagination';
import DataTableSelectEditor from './data-table-select-editor';
import DataTableTextEditor from './data-table-text-editor';
import DataTableToolbar from './data-table-toolbar';
import { headerLabel, currencyFormatter, dateFormatter, datetimeFormatter } from '@utilities';

import './data-table.scss';
import AccessSelect from '@components/settings/application/tables/access/access-select';
import RoleSelect from '@components/settings/users/role-select';

const ActionColumn = (columnActions) => {
	if (!columnActions) return null;

	const length = columnActions.length;

	return {
		key: 'actions',
		name: headerLabel('actions'),
		frozen: true,
		width: length > 2 ? length * 35 : 50,
		formatter: (props) => <DataTableActionsFormatter {...props} actions={columnActions} />
	};
};

//==================================================
// no-records
//==================================================
const NoRecords = () => {
	const { t } = useTranslation();

	return (
		<Container fluid className="position-absolute h-100 d-flex justify-content-center align-items-center fs-5">
			{t('global:no-records.translation')}
		</Container>
	);
};

//==================================================
// loader
//==================================================
const Loader = () => (
	<Container fluid className="position-absolute h-100 d-flex justify-content-center align-items-center fs-5">
		<Spinner animation="border" role="status" style={{ color: 'var(--tango-color-light-green)' }}>
			<Container className="visually-hidden">Loading..</Container>
		</Spinner>
	</Container>
);

//==================================================
// data-table
//==================================================
const DataTable = ({
	columnActions,
	columnOptions,
	columns,
	dataTestId,
	isFetching,
	onRowSelect,
	onFetch,
	onRowsChange,
	onSortColumnsChange,
	pagination,
	rows,
	sortColumns,
	style,
	toolbar,
	actions,
	leftSideAction
}) => {
	const [gridColumns, setGridColumns] = useState();
	const [gridRows, setGridRows] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [selectedRows, setSelectedRows] = useState(() => new Set());

	// paginate
	const handleOnPaginate = (event) => {
		const { page_size, total_rows } = pagination;
		const pageCount = Math.ceil(total_rows / page_size);
		const action = event.currentTarget.getAttribute('data-test-id');
		const value = event.currentTarget.value;
		const params = { ...pagination };

		switch (action) {
			case 'first-page':
				params.page_index = 1;
				break;

			case 'previous-page':
				params.page_index = parseInt(params.page_index, 10) - 1;
				break;

			case 'next-page':
				params.page_index = parseInt(params.page_index, 10) + 1;
				break;

			case 'last-page':
				params.page_index = parseInt(pageCount, 10);
				break;

			case 'page-index':
				params.page_index = value;
				break;

			case 'page-size':
				params.page_size = value;
				break;

			default:
				break;
		}

		if (!isFetching) onFetch(params);
	};

	// set cols and rows
	useEffect(() => {
		if (columns && rows) {
			let cols = columns.map((column) => {
				const col = Object.assign({ ...column }, { ...columnOptions });
				const { disabled, field_type, key, label, options, width } = col;

				const formatter = () => {
					switch (field_type) {
						case 'bit':
						case 'checkbox':
							return (p) => <DataTableCheckboxFormatter {...p} />;

						case 'boolean':
						case 'currency':
							return (p) => currencyFormatter(p.row[column.key]);

						case 'date':
							return (p) => (p.row[column.key] ? dateFormatter(p.row[column.key]) : '');

						case 'datetime':
							return (p) => datetimeFormatter(p.row[column.key]);

						case 'timestamp':
							return (p) => datetimeFormatter(p.row[column.key]);

						case 'dropdown':
							return (p) => {
								if (key === 'modify' || key === 'view') {
									return p.row[column.key] === true
										? 'All Records'
										: null || (p.row[column.key] === false ? 'None' : null);
								}
							};

						default:
							return (p) => <DataTableTextEditor {...p} disabled={disabled} />;
					}
				};

				const editor = () => {
					switch (field_type) {
						case 'bit':
						case 'currency':
							return (p) => <DataTableTextEditor type="number" {...p} disabled={disabled} />;

						case 'date':
							return (p) => <DataTableTextEditor isDate={true} {...p} disabled={disabled} />;

						case 'boolean':
						case 'dropdown':
							return (p) => {
								let opts = options || [];

								if (field_type === 'boolean') opts = ['', 'false', 'true'];

								if (key === 'view' || key === 'modify') {
									return <AccessSelect {...p} options={opts} />;
								} else {
									if (key === 'role') {
										return <RoleSelect {...p} options={opts} />;
									} else {
										return <DataTableSelectEditor {...p} options={opts} disabled={disabled} />;
									}
								}
							};

						case 'number':
							return (p) => <DataTableTextEditor type="number" {...p} disabled={disabled} />;

						case 'text':
							return (p) => <DataTableTextEditor {...p} disabled={disabled} />;

						case 'timestamp':
							return (p) => datetimeFormatter(p.row[column.key]);

						default:
							return (p) => <DataTableTextEditor {...p} disabled={disabled} />;
					}
				};

				switch (field_type) {
					case 'bit':
					case 'checkbox':
						col['formatter'] = formatter();
						break;

					case 'currency':
					case 'date':
					case 'datetime':
					case 'timestamp':
						col['formatter'] = formatter();
						col['editor'] = editor();
						break;

					case 'boolean':
					case 'dropdown':
						col['editor'] = editor();
						if (key === 'view' || key === 'modify') {
							col['formatter'] = formatter();
						}
						col['editorOptions'] = {
							editOnClick: true
						};
						break;

					default:
						col['editor'] = editor();
				}

				col['minWidth'] = width || 200;
				col['name'] = label || headerLabel(key);

				return col;
			});

			const actionColumn = ActionColumn(columnActions);

			cols = cols.length > 0 && actionColumn ? [actionColumn].concat(cols) : cols;

			if (onRowSelect) {
				cols = [SelectColumn].concat(cols);
			}

			setGridColumns(cols);
			setGridRows(rows);
		}
	}, [onRowSelect, rows, columns, columnActions, columnOptions]);

	// return selected columns
	useEffect(() => {
		if (onRowSelect) onRowSelect([...selectedRows]);
	}, [onRowSelect, selectedRows]);

	// set is-loading
	useEffect(() => {
		setIsLoading(true);

		window.setTimeout(() => {
			setIsLoading(false);
		}, [1000]);
	}, [isFetching]);

	return (
		<React.Fragment>
			<Container
				fluid
				data-test-id={dataTestId ? `data-table-${dataTestId}` : 'data-table'}
				style={{
					pointerEvents: isLoading ? 'none' : 'unset'
				}}
			>
				<div className="justify-content-between row data-table-header">
					{toolbar && (
						<DataTableToolbar
							addField={toolbar.addField}
							search={toolbar.search}
							title={toolbar.title}
							showdropdown={toolbar.showdropdown}
							actions={actions}
							leftSideAction={leftSideAction}
						/>
					)}
				</div>

				{isLoading && gridColumns && (
					<ReactDataGrid
						columns={gridColumns}
						rows={[]}
						components={{ noRowsFallback: <Loader /> }}
						className="rdg-light overflow-hidden"
						style={{
							...style
						}}
					/>
				)}
				{gridColumns && gridRows && (
					<ReactDataGrid
						key={Math.random()}
						columns={gridColumns}
						rows={gridRows}
						components={{ noRowsFallback: <NoRecords /> }}
						onRowsChange={onRowsChange}
						sortColumns={sortColumns}
						onSortColumnsChange={(columns) => {
							onSortColumnsChange(columns);
						}}
						rowKeyGetter={(row) => row.id}
						selectedRows={selectedRows}
						onSelectedRowsChange={setSelectedRows}
						className={`rdg-light ${rows.length === 0 && 'overflow-hidden'}`}
						style={{
							...style,
							display: isLoading ? 'none' : 'grid'
						}}
					/>
				)}
				{pagination && <DataTableDetails metadata={pagination} onPaginate={handleOnPaginate} />}
				{pagination && <DataTablePagination metadata={pagination} onPaginate={handleOnPaginate} />}
			</Container>
		</React.Fragment>
	);
};

DataTable.propTypes = {
	columns: PropTypes.array.isRequired,
	dataTestId: PropTypes.string,
	isFetching: PropTypes.bool,
	onRowSelect: PropTypes.func,
	onFetch: PropTypes.func,
	onRowsChange: PropTypes.func,
	onSortColumnsChange: PropTypes.func,
	pagination: PropTypes.object,
	rows: PropTypes.array.isRequired,
	sortColumns: PropTypes.array,
	style: PropTypes.object,
	columnOptions: PropTypes.shape({
		resizable: PropTypes.bool,
		sortable: PropTypes.bool,
		disabled: PropTypes.bool
	}),
	columnActions: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			action: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired
		})
	),
	toolbar: PropTypes.shape({
		addField: PropTypes.shape({
			func: PropTypes.func.isRequired,
			options: PropTypes.array.isRequired
		}),
		search: PropTypes.shape({
			column: PropTypes.string,
			text: PropTypes.string,
			func: PropTypes.func.isRequired,
			options: PropTypes.array
		}),
		showdropdown: PropTypes.shape({
			column: PropTypes.string,
			text: PropTypes.string,
			func: PropTypes.func.isRequired,
			options: PropTypes.array
		}),
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
	}),
	actions: PropTypes.element,
	leftSideAction: PropTypes.element
};

export default DataTable;
