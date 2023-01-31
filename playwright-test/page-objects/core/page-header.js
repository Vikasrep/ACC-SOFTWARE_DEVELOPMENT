/* eslint-disable space-before-function-paren */

class PageHeader {
	constructor(page) {
		this.page = page;
	}

	async breadcrumb() {
		return await this.page.locator('[data-test-id=breadcrumb] > label:last-child');
	}
}

module.exports = { PageHeader };
