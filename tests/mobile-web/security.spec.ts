import { test, expect } from '../../src/web/fixtures';
import { LoginPage, PASSWORD, USER, signIn } from '../../src/web/pages';

/** Basic, QA-level security checks on the web app as seen from an Android device. */
test.describe('Security basics', () => {
  test('TC-067 the app is served over HTTPS', async ({ page }) => {
    await new LoginPage(page).open();
    expect(page.url()).toMatch(/^https:\/\//);
  });

  test('TC-068 the password field is masked', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await expect(login.password).toHaveAttribute('type', 'password');
  });

  test('TC-069 credentials never appear in the URL after login', async ({ page }) => {
    await signIn(page);
    const url = page.url();
    expect(url).not.toContain(PASSWORD);
    expect(url).not.toContain(USER);
  });

  test('TC-070 no plain-HTTP (mixed content) requests are made', async ({ page, diagnostics }) => {
    await signIn(page);
    expect(diagnostics.insecureRequests).toEqual([]);
  });

  test('TC-071 script injection in the username field does not execute', async ({ page }) => {
    let dialogSeen = false;
    page.on('dialog', async (dialog) => {
      dialogSeen = true;
      await dialog.dismiss();
    });

    const login = new LoginPage(page);
    await login.open();
    await login.login('<script>alert(1)</script>', 'x');

    await expect(login.error).toBeVisible();
    expect(dialogSeen).toBe(false);
  });

  test('TC-072 security response headers (informational)', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBe(true);

    const headers = response!.headers();
    const wanted = ['strict-transport-security', 'x-content-type-options', 'content-security-policy', 'x-frame-options'];
    const missing = wanted.filter((h) => !(h in headers));

    // Reported in the HTML report, but does not fail the run: it is a finding to raise, not a regression.
    test.info().annotations.push({
      type: 'missing-security-headers',
      description: missing.length ? missing.join(', ') : 'none',
    });
  });
});
