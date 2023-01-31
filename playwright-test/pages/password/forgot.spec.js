const { expect, test } = require('@playwright/test');

test.describe('password', () => {
	test.describe('forgot', () => {
		test('should be able to enter email to get password reset email', async ({ page }) => {
			await page.goto('/login');
			await page.locator('[data-test-id=forgot-password]').click();
			await page.fill('#email', process.env.PLAYWRIGHT_USERNAME);
			await page.locator('[data-test-id=submit]').click();
			await expect(page.locator('[data-test-id=alert]')).toHaveCount(1);
		});
	});
});
