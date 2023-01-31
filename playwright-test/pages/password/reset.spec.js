const { expect, test } = require('@playwright/test');

test.describe('password', () => {
	test.describe('reset', () => {
		test('should be able to reset their password', async ({ page }) => {
			await page.goto('/password/reset');
			await page.fill('#new-password', process.env.PLAYWRIGHT_PASSWORD);
			await page.fill('#confirm-new-password', process.env.PLAYWRIGHT_PASSWORD);
			await page.locator('[data-test-id=submit]').click();
			await expect(page.locator('[data-test-id=alert]')).toHaveCount(1);
		});
	});
});
