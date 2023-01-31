import React from 'react';
import { useParams } from 'react-router-dom';
import ReportsAndCharts from './reports-and-charts';
import Relationships from './relationships';
import Forms from './forms';
import Fields from './fields';
import Access from './access';
import AdvancedSettings from './advanced-settings';

const Setting = () => {
	const params = useParams();

	return (
		<React.Fragment>
			{
				{
					reports: <ReportsAndCharts />,
					relationships: <Relationships />,
					forms: <Forms />,
					fields: <Fields />,
					access: <Access />,
					advancedSettings: <AdvancedSettings />
				}[params.setting]
			}
		</React.Fragment>
	);
};

export default Setting;
