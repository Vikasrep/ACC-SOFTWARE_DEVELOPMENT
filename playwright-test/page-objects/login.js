/* eslint-disable space-before-function-paren */

class LoginPage {
	constructor(page) {
		this.page = page;
	}

	async navigate() {
		await this.page.goto('/login');
	}

	async login() {
		await this.navigate();
		await this.page.fill('#username', process.env.PLAYWRIGHT_USERNAME);
		await this.page.fill('#password', process.env.PLAYWRIGHT_PASSWORD);
		await this.page.locator('data-test-id=submit').click();
	}
}

module.exports = { LoginPage };
