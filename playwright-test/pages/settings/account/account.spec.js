const { expect, test } = require('@playwright/test');
const { LoginPage } = require('../../../page-objects/login');
const { AccountPage } = require('../../../page-objects/settings/account');
const { PageHeader } = require('../../../page-objects/core/page-header');

test.describe('settings', () => {
	test.describe('account', () => {
		test('should render', async ({ page }) => {
			const loginPage = new LoginPage(page);
			const accountPage = new AccountPage(page);
			const pageHeader = new PageHeader(page);
			const breadcrumb = await pageHeader.breadcrumb();

			await loginPage.login();
			await accountPage.navigate();
			await expect(breadcrumb).toHaveText('Account');
		});
	});
});
