import React from 'react';
import PropTypes from 'prop-types';
import {
	Announcement,
	ArrowBack,
	ArrowForward,
	Close,
	Dashboard,
	Delete,
	Edit,
	ExitToApp,
	FirstPage,
	KeyboardArrowDown,
	KeyboardArrowRight,
	Laptop,
	LastPage,
	Link,
	Menu,
	NavigateBefore,
	NavigateNext,
	People,
	PersonOutline,
	RemoveCircle,
	SentimentSatisfied,
	Settings,
	TableChart,
	Visibility,
	VpnKey,
	Layers,
	Group,
	Dvr,
	Grain,
	Tune,
	Add,
	FileCopy,
	DeviceHub,
	Fingerprint,
	Assignment,
	Assessment,
	CompareArrows,
	Ballot,
	Contacts,
	PersonAdd,
	AlternateEmailOutlined,
	Lock,
	SystemUpdateAlt,
	AccountCircle,
	VisibilityOff,
	DashboardOutlined,
	TableChartOutlined,
	SettingsOutlined,
	SearchOutlined
} from '@material-ui/icons';

const Icon = ({ dataTestId, name, color, style, className }) => (
	<React.Fragment>
		{
			{
				'arrow-back': <ArrowBack data-test-id={dataTestId} color={color} style={{ ...style }} className={className} />,
				'arrow-down': (
					<KeyboardArrowDown data-test-id={dataTestId} color={color} style={{ ...style }} className={className} />
				),
				'arrow-forward': <ArrowForward data-test-id={dataTestId} color={color} style={{ ...style }} />,
				'arrow-right': (
					<KeyboardArrowRight data-test-id={dataTestId} color={color} style={{ ...style }} className={className} />
				),
				'first-page': <FirstPage data-test-id={dataTestId} color={color} style={{ ...style }} />,
				'human-resources': <SentimentSatisfied data-test-id={dataTestId} color={color} style={{ ...style }} />,
				'last-page': <LastPage data-test-id={dataTestId} color={color} style={{ ...style }} />,
				'navigate-before': <NavigateBefore data-test-id={dataTestId} color={color} style={{ ...style }} />,
				'navigate-next': <NavigateNext data-test-id={dataTestId} color={color} style={{ ...style }} />,
				'quick-links': <Link data-test-id={dataTestId} color={color} style={{ ...style }} />,
				'social-media': <People data-test-id={dataTestId} color={color} style={{ ...style }} />,
				'account-circle': <AccountCircle data-test-id={dataTestId} color={color} style={{ ...style }} />,

				announcements: <Announcement data-test-id={dataTestId} color={color} style={{ ...style }} />,
				close: <Close data-test-id={dataTestId} color={color} style={{ ...style }} />,
				dashboard: <Dashboard data-test-id={dataTestId} color={color} style={{ ...style }} />,
				edit: <Edit data-test-id={dataTestId} color={color} style={{ ...style }} />,
				delete: <Delete data-test-id={dataTestId} color={color} style={{ ...style }} />,
				it: <Laptop data-test-id={dataTestId} color={color} style={{ ...style }} />,
				logout: <ExitToApp data-test-id={dataTestId} color={color} style={{ ...style }} />,
				menu: <Menu data-test-id={dataTestId} color={color} style={{ ...style }} />,
				remove: <RemoveCircle data-test-id={dataTestId} color={color} style={{ ...style }} />,
				settings: <Settings data-test-id={dataTestId} color={color} style={{ ...style }} />,
				tables: <TableChart data-test-id={dataTestId} color={color} style={{ ...style }} />,
				view: <Visibility data-test-id={dataTestId} color={color} style={{ ...style }} />,
				key: <VpnKey data-test-id={dataTestId} color={color} style={{ ...style }} />,
				copy: <FileCopy data-test-id={dataTestId} color={color} style={{ ...style }} />,
				overview: <DeviceHub data-test-id={dataTestId} color={color} style={{ ...style }} />,
				import: <SystemUpdateAlt data-test-id={dataTestId} color={color} style={{ ...style }} />,
				account: <PersonOutline data-test-id={dataTestId} color={color} style={{ ...style }} />,

				Layers: <Layers data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Group: <Group data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Dvr: <Dvr data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Grain: <Grain data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Tune: <Tune data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Add: <Add data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Fingerprint: <Fingerprint data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Assignment: <Assignment data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Assessment: <Assessment data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Ballot: <Ballot data-test-id={dataTestId} color={color} style={{ ...style }} />,
				CompareArrows: <CompareArrows data-test-id={dataTestId} color={color} style={{ ...style }} />,
				contact: <Contacts data-test-id={dataTestId} color={color} style={{ ...style }} />,
				adduser: <PersonAdd data-test-id={dataTestId} color={color} style={{ ...style }} />,
				EmailAtRate: <AlternateEmailOutlined data-test-id={dataTestId} color={color} style={{ ...style }} />,
				Lock: <Lock data-test-id={dataTestId} color={color} style={{ ...style }} />,
				VisibilityOff: <VisibilityOff data-test-id={dataTestId} color={color} style={{ ...style }} />,
				DashboardOutlined: <DashboardOutlined data-test-id={dataTestId} color={color} style={{ ...style }} />,
				TableChartOutlined: <TableChartOutlined data-test-id={dataTestId} color={color} style={{ ...style }} />,
				SettingsOutlined: <SettingsOutlined data-test-id={dataTestId} color={color} style={{ ...style }} />,
				SearchOutlined: <SearchOutlined data-test-id={dataTestId} color={color} style={{ ...style }} />,
				null: <React.Fragment />
			}[name]
		}
	</React.Fragment>
);

Icon.propTypes = {
	color: PropTypes.string,
	dataTestId: PropTypes.string,
	name: PropTypes.string.isRequired,
	style: PropTypes.object,
	className: PropTypes.string
};

export default Icon;
