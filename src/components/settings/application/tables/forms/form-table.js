import React from 'react';
import { Button, Container, Form, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const FormTable = ({ dropdownList, formData, onClickButton }) => {
	const { t } = useTranslation();

	return (
		<Container style={{ maxHeight: '80vh', overflow: 'auto' }}>
			<Table>
				<thead>
					<tr>
						<th></th>
						<th>
							<Form.Label>{t('global:form-element.translation')}</Form.Label>
						</th>
						<th></th>
						<th className="text-center">
							<Form.Label>{t('global:same-row.translation')}</Form.Label>
						</th>
					</tr>
				</thead>
				<tbody>
					{formData?.map((element, item) => (
						<tr key={item + 1}>
							<th className="text-center">{item + 1}</th>
							<td>
								<Form.Select size="sm" id="disabledSelect">
									<option value={''}>{'Make a selection'}</option>
									{dropdownList?.map((dropdownItem, index) => (
										<option
											key={index}
											selected={element.property_name === dropdownItem.property_name ? true : false}
											value={dropdownItem.value}
										>
											{dropdownItem.label}
										</option>
									))}
								</Form.Select>
							</td>
							<td className="text-center">
								{/* <div style={{ width: '120px' }} dangerouslySetInnerHTML={{ __html: element.label }}></div> */}
							</td>
							<td className="text-center">
								<Form.Check type="checkbox" value={element.checkBoxValue} id="disabledFieldsetCheck" />
							</td>
						</tr>
					))}
					<tr>
						<th className="text-center"></th>
						<td>
							<Button size="sm" data-test-id="import" className="tango-green-button" onClick={onClickButton(formData)}>
								{t('global:add.translation')}
							</Button>
						</td>
						<td className="text-center"></td>
						<td className="text-center"></td>
					</tr>
				</tbody>
			</Table>
		</Container>
	);
};

FormTable.propTypes = {
	listItem: PropTypes.any.isRequired,
	dropdownList: PropTypes.any.isRequired,
	formData: PropTypes.any.isRequired,
	onClickButton: PropTypes.func
};

export default FormTable;
