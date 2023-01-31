/* eslint-disable space-before-function-paren */

const { expect } = require('@playwright/test');

class LogoutPage {
	constructor(page) {
		this.page = page;
	}

	async navigate() {
		await this.page.locator('[data-test-id=navigation-item] > [data-test-id=logout]').click();
	}

	async logout() {
		await this.navigate();
		await expect(this.page.locator('#username')).toHaveCount(1);
	}
}

module.exports = { LogoutPage };
