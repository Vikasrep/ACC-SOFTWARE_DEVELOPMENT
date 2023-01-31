const { expect, test } = require('@playwright/test');
const { LoginPage } = require('../../../page-objects/login');
const { ClaimsPage } = require('../../../page-objects/tables/claims');
const { PageHeader } = require('../../../page-objects/core/page-header');

test.describe('tables', () => {
	test.describe('claims', () => {
		test('should render', async ({ page }) => {
			const loginPage = new LoginPage(page);
			const claimsPage = new ClaimsPage(page);
			const pageHeader = new PageHeader(page);
			const breadcrumb = await pageHeader.breadcrumb();

			await loginPage.login();
			await claimsPage.navigate();
			await expect(breadcrumb).toHaveText('Claims');
		});
	});
});
