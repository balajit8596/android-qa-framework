import { test, expect } from '../../src/web/fixtures';
import { LoginPage, signIn } from '../../src/web/pages';

/**
 * Android device compatibility: the same web app on a phone and a tablet profile.
 * Runs once per emulated device (see projects in playwright.config.ts).
 */
test.describe('Android device compatibility @smoke', () => {
  test('TC-060 emulated device reports Android and touch support', async ({ page }) => {
    await new LoginPage(page).open();
    const ua = await page.evaluate(() => navigator.userAgent);
    const touchPoints = await page.evaluate(() => navigator.maxTouchPoints);
    expect(ua).toContain('Android');
    expect(touchPoints).toBeGreaterThan(0);
  });

  test('TC-061 login works and the product list renders', async ({ page }) => {
    const products = await signIn(page);
    expect(await products.items.count()).toBeGreaterThan(0);
  });

  test('TC-062 tapping Add to cart updates the cart badge', async ({ page }) => {
    const products = await signIn(page);
    await products.addToCart('sauce-labs-backpack');
    await expect(products.cartBadge).toHaveText('1');
  });

  test('TC-063 layout still works after rotating the device', async ({ page }) => {
    const products = await signIn(page);
    const size = page.viewportSize();
    expect(size).not.toBeNull();

    // Simulate rotation by swapping width and height.
    await page.setViewportSize({ width: size!.height, height: size!.width });
    await expect(products.title).toBeVisible();
    await expect(products.cartLink).toBeVisible();

    await page.setViewportSize({ width: size!.width, height: size!.height });
    await expect(products.items.first()).toBeVisible();
  });
});
