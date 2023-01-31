/* eslint-disable space-before-function-paren */

const { expect } = require('@playwright/test');
const { PageHeader } = require('../core/page-header');

class AccountPage {
	constructor(page) {
		this.page = page;
	}

	async navigate() {
		const pageHeader = new PageHeader(this.page);
		const breadcrumb = await pageHeader.breadcrumb();

		await this.page.locator('[data-test-id=navigation-item] > [data-test-id=settings]').click();

		if ((await expect(breadcrumb).toHaveText('Account')) === false) {
			await this.page.locator('[data-test-id=navigation-item] > [data-test-id=account]').click();
		}
	}
}

module.exports = { AccountPage };
