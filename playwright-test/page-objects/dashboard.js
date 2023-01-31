/* eslint-disable space-before-function-paren */

class DashboardPage {
	constructor(page) {
		this.page = page;
	}

	async navigate() {
		await this.page.locator('[data-test-id=navigation-item] > [data-test-id=dashboard]').click();
	}
}

module.exports = { DashboardPage };
