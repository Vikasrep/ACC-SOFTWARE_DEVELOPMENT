/* eslint-disable space-before-function-paren */
const { expect } = require('@playwright/test');
const { PageHeader } = require('../core/page-header');

class ClaimsPage {
	constructor(page) {
		this.page = page;
	}

	async navigate() {
		const pageHeader = new PageHeader(this.page);
		const breadcrumb = await pageHeader.breadcrumb();

		await this.page.locator('[data-test-id=navigation-item] > [data-test-id=tables]').click();

		if ((await expect(breadcrumb).toHaveText('Claims')) === false) {
			await this.page.locator('[data-test-id=navigation-item] > [data-test-id=claims]').click();
		}
	}
}

module.exports = { ClaimsPage };
