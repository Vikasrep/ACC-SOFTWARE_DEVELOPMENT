const { test } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/login');
const { LogoutPage } = require('../../page-objects/logout');

test.describe('logout', () => {
	test('should be able to log out', async ({ page }) => {
		const loginPage = new LoginPage(page);
		const logoutPage = new LogoutPage(page);

		await loginPage.login();
		await logoutPage.logout();
	});
});
