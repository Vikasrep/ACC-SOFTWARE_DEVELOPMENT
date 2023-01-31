const { expect, test } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/login');
const { PageHeader } = require('../../page-objects/core/page-header');

test.describe('dashboard', () => {
	test('should render', async ({ page }) => {
		const loginPage = new LoginPage(page);
		const pageHeader = new PageHeader(page);
		const breadcrumb = await pageHeader.breadcrumb();

		await loginPage.login();
		await expect(breadcrumb).toHaveText('Dashboard');
	});
});
