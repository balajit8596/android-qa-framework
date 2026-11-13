import { test, expect } from '../../src/web/fixtures';
import { LoginPage, signIn } from '../../src/web/pages';

/**
 * Networking behaviour on an emulated Android device:
 * going offline, slow connections, and failed requests.
 */
test.describe('Network conditions', () => {
  test('TC-064 offline: page fails to load, then recovers when back online', async ({ page, context }) => {
    const products = await signIn(page);

    await context.setOffline(true);
    await expect(page.reload()).rejects.toThrow(/ERR_INTERNET_DISCONNECTED|net::/);

    await context.setOffline(false);
    await page.reload();
    await products.expectLoaded();
  });

  test('TC-065 slow 3G: the login page still loads', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Network throttling uses Chrome DevTools Protocol');
    test.setTimeout(90_000);

    const client = await context.newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 400, // ms round trip
      downloadThroughput: (400 * 1024) / 8, // about 400 kbit/s
      uploadThroughput: (400 * 1024) / 8,
    });

    const login = new LoginPage(page);
    const started = Date.now();
    await login.open();
    await expect(login.username).toBeVisible({ timeout: 60_000 });
    test.info().annotations.push({
      type: 'load-time',
      description: `${Date.now() - started} ms on emulated slow 3G`,
    });
  });

  test('TC-066 blocked image requests do not break the app', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg,svg,webp}', (route) => route.abort());
    const products = await signIn(page);
    await expect(products.title).toBeVisible();
  });
});
