import React from 'react';
import AddRole from '@components/settings/application/roles/add-role';
import AddReport from '@components/settings/application/tables/reports-and-charts/add-report';
import AddField from '@components/settings/application/tables/fields/add-field';
import AddTable from '@components/settings/application/tables/add-table';
import FormAdd from '@components/settings/application/tables/forms/form-add';

export const APPLICATION_SETTING_LIST = [
	{
		icon: 'Layers',
		title: '  Basics',
		list: [
			{
				icon: 'Group',
				BtnIcon: 'Add',
				title: 'Roles',
				desc: 'Define the way users are allowed to access data in your app',
				BtnTitle: 'New Role',
				Link: '/roles',
				path: <AddRole />
			},
			{
				icon: 'tables',
				BtnIcon: 'Add',
				title: 'Tables',
				desc: 'Define tables for each type of data in your app',
				BtnTitle: 'New Table',
				Link: '/tables',
				path: <AddTable />
			}
		]
	},
	{
		icon: 'Dvr',
		title: '  User Interface',
		list: [
			{
				icon: 'dashboard',
				BtnIcon: 'Add',
				title: 'Dashboard',
				desc: 'Create or customize dashboard pages',
				BtnTitle: 'New Setting'
			}
		]
	},
	{
		icon: 'Grain',
		title: '  Advanced Features',
		list: [
			{
				icon: 'Tune',
				BtnIcon: 'Add',
				title: 'Automations',
				desc: 'Add and manage business logic for your app',
				BtnTitle: 'New Automation'
			}
			// {
			// 	icon: 'Assessment',
			// 	BtnIcon: 'Add',
			// 	title: 'Schedule Reports',
			// 	desc: 'Manage schedule reports',
			// },
			// {
			// 	icon: 'edit',
			// 	BtnIcon: 'Add',
			// 	title: 'Edit History',
			// 	desc: 'View all of the edit history',
			// }
		]
	}
];

export const TABLE_SETTINGS_LIST = [
	{
		icon: 'Layers',
		title: '  Table Structure',
		list: [
			{
				icon: 'Ballot',
				BtnIcon: 'Add',
				title: 'Fields',
				desc: 'Define how your data is stored in this table',
				BtnTitle: 'New Field',
				Link: '/fields',
				path: <AddField />
			},
			{
				icon: 'CompareArrows',
				BtnIcon: 'Add',
				title: 'Table-to-table relationships',
				desc: 'Define how this table is linked to other tables',
				BtnTitle: 'New Relationship',
				Link: '/relationships'
			},
			{
				icon: 'SettingsOutlined',
				title: 'Advanced settings',
				desc: 'Configure options for this table',
				Link: '/advanced-settings'
			}
		]
	},
	{
		icon: 'Dvr',
		title: '  User Interface',
		list: [
			{
				icon: 'Assessment',
				BtnIcon: 'Add',
				title: 'Reports & charts',
				desc: 'Create lists, charts, and other views of data in this table',
				BtnTitle: 'New Report',
				Link: '/reports',
				path: <AddReport />
			},
			{
				icon: 'Assignment',
				BtnIcon: 'Add',
				title: 'Forms',
				desc: 'Create forms to view, add, and edit records',
				BtnTitle: 'New Form',
				Link: '/forms',
				path: <FormAdd />
			}
		]
	},
	{
		icon: 'Workspaces',
		title: '  Workflow & Permissions',
		list: [
			{
				icon: 'Fingerprint',
				title: 'Access',
				desc: 'Define how users in different roles access data in this table',
				Link: '/access'
			}
		]
	}
];
