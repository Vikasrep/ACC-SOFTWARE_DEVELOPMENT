export const APP_NAVIGATION = [
	{
		id: 'dashboard',
		icon: 'DashboardOutlined',
		label: 'Dashboard',
		locale: 'dashboard',
		route: '/dashboard',
		visible: true,
		className: 'my-1'
	},
	{
		id: 'announcements',
		icon: 'announcements',
		label: 'Announcements',
		locale: 'announcements',
		route: '/announcements',
		visible: false,
		className: 'my-1'
	},
	{
		id: 'tables',
		icon: 'TableChartOutlined',
		label: 'Tables',
		locale: 'tables',
		route: '/tables',
		visible: true,
		className: 'my-1',
		subItems: [
			{
				id: 'companies',
				label: 'Companies',
				locale: 'companies',
				route: '/tables/companies',
				routeField: '_rid_',
				visible: false
			},
			{
				id: 'contacts',
				label: 'Contacts',
				locale: 'contacts',
				route: '/tables/contacts',
				routeField: '_rid_',
				visible: false
			},
			{
				id: 'claims',
				label: 'Claims',
				locale: 'claims',
				route: '/tables/claims',
				routeField: 'claim_',
				visible: true
			},
			{
				id: 'customers',
				label: 'Customers',
				locale: 'customers',
				route: '/tables/customers',
				routeField: 'customer_name',
				visible: true
			},
			{
				id: 'providers',
				label: 'Providers',
				locale: 'providers',
				route: '/tables/providers',
				routeField: '_rid_',
				visible: false
			},
			{
				id: 'travelers',
				label: 'Travelers',
				locale: 'travelers',
				route: '/tables/travelers',
				routeField: '_rid_',
				visible: false
			},
			{
				id: 'service-lines',
				label: 'Service Lines',
				locale: 'service-lines',
				route: '/tables/service-lines',
				routeField: 'customer_identifier_',
				visible: true
			},
			{
				id: 'tars',
				label: 'TARs',
				locale: 'tars',
				route: '/tables/tars',
				routeField: 'tar_',
				visible: true
			},
			{
				id: 'triptime-login',
				label: 'TripTime Login',
				locale: 'triptime-login',
				route: '/tables/triptime-login',
				routeField: '_rid_',
				visible: false
			},
			{
				id: 'pre-certifications',
				label: 'Pre-Certifications',
				locale: 'pre-certifications',
				route: '/tables/pre-certifications',
				routeField: 'pre_certification_id_',
				visible: true
			},
			{
				id: 'travel-service-line',
				label: 'Travel Service Line',
				locale: 'travel-service-line',
				route: '/tables/travel-service-line',
				routeField: '',
				visible: false
			},
			{
				id: 'notes',
				label: 'Notes',
				locale: 'notes',
				route: '/tables/notes',
				routeField: '_rid_',
				visible: true
			},
			{
				id: 'documents',
				label: 'Documents',
				locale: 'documents',
				route: '/tables/documents',
				routeField: '_rid_',
				visible: true
			}
		]
	},
	{
		id: 'human-resources',
		icon: 'human-resources',
		label: 'Human Resources',
		locale: 'human-resource',
		route: '/human-resources',
		visible: false,
		className: 'my-1'
	},
	{
		id: 'it',
		icon: 'it',
		label: 'IT',
		locale: 'it',
		route: '/it',
		visible: false,
		className: 'my-1'
	},
	{
		id: 'quick-links',
		icon: 'quick-links',
		label: 'Quick Links',
		locale: 'quick-links',
		route: '/quick-links',
		visible: false,
		subItems: [
			{
				id: 'executive-summary',
				label: 'Executive-Summary',
				locale: 'executive-summary',
				route: '/quick-links/executive-summary',
				visible: false
			},
			{
				id: 'pcu-website',
				label: 'PCU Website',
				locale: 'pcu-website',
				route: 'https://www.pointcomfort.com/',
				visible: false
			},
			{
				id: 'pcu-email',
				label: 'PCU Email',
				locale: 'pcu-email',
				route: 'https://outlook.office365.com/mail/inbox',
				visible: false
			},
			{
				id: 'maps-resource-portal',
				label: 'MAPs-Resource-Portal',
				locale: 'maps-resource-portal',
				route: 'https://maps.pointcomfort.com/login',
				visible: false
			},
			{
				id: 'purecloud',
				label: 'Purecloud',
				locale: 'purecloud',
				route: 'https://login.mypurecloud.com/',
				visible: false
			},
			{
				id: 'paycor-timeclock',
				label: 'Paycor-Timeclock',
				locale: 'paycor-timeclock',
				route: 'https://www.paycor.com/',
				visible: false
			},
			{
				id: 'pcu-safety-&-security-policy',
				label: 'PCU-Safety-&-Security-Policy',
				locale: 'pcu-safety-&-security-policy',
				route: '/quick-links/pcu-safety-and-security-policy',
				visible: false
			}
		],
		className: 'my-1'
	},
	{
		id: 'social-media',
		icon: 'social-media',
		label: 'Social-Media',
		locale: 'social-media',
		route: '/social-media',
		visible: false,
		subItems: [
			{
				id: 'twitter-triptime',
				label: 'Twitter | TripTime',
				locale: 'twitter-triptime',
				route: 'https://twitter.com/PointComfort_Tr',
				visible: false
			},
			{
				id: 'facebook-triptime',
				label: 'Facebook | TripTime',
				locale: 'facebook-triptime',
				route: 'https://www.facebook.com/PointComfortTravel',
				visible: false
			},
			{
				id: 'facebook-pcu',
				label: 'Facebook | PCU',
				locale: 'facebook-pcu',
				route: 'https://www.facebook.com/PointComfortUnderwriters',
				visible: false
			},
			{
				id: 'instagram-triptime',
				label: 'Instagram | TripTime',
				locale: 'instagram-triptime',
				route: 'https://www.instagram.com/pointcomforttravel/',
				visible: false
			},
			{
				id: 'pinterest-triptime',
				label: 'Pinterest | TripTime',
				locale: 'pinterest-triptime',
				route: 'https://www.pinterest.com/pointcomforttravel/',
				visible: false
			},
			{
				id: 'linkedin-pcu',
				label: 'LinkedIn | PCU',
				locale: 'linkedin-pcu',
				route: 'https://www.linkedin.com/company/point-comfort-underwriters',
				visible: false
			},
			{
				id: 'linkedin-triptime',
				label: 'LinkedIn | TripTime',
				locale: 'linkedin-triptime',
				route: 'https://www.linkedin.com/showcase/triptimeinsurance.com',
				visible: false
			},
			{
				id: 'youtube-triptime',
				label: 'YouTube | TripTime',
				locale: 'youtube-triptime',
				route: 'https://www.youtube.com/channel/UC1tqzmNiJGzWWhZjRiDBMBA/featured?view_as=public',
				visible: false
			}
		],
		className: 'my-1'
	},
	{
		id: 'settings',
		icon: 'SettingsOutlined',
		label: 'Settings',
		locale: 'settings',
		route: '/settings',
		visible: true,
		subItems: [
			{
				id: 'application',
				label: 'Application',
				locale: 'application',
				route: '/settings/application',
				visible: true
			},
			{
				id: 'account',
				label: 'Account',
				locale: 'account',
				route: '/settings/account',
				visible: true
			},
			{
				id: 'users',
				label: 'Users',
				locale: 'users',
				route: '/settings/users',
				visible: true
			}
		],
		className: 'my-1'
	},
	{
		id: 'logout',
		icon: 'logout',
		label: 'Logout',
		locale: 'logout',
		route: '/logout',
		visible: true,
		className: 'mt-auto'
	}
];
