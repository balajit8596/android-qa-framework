import { test as base, expect } from '@playwright/test';

export interface Diagnostics {
  consoleErrors: string[];
  failedRequests: string[];
  insecureRequests: string[];
}

/**
 * Auto fixture that watches every test.
 * It records console errors, failed requests and any plain-HTTP requests,
 * and on failure attaches them as "defect evidence" to the report,
 * ready to paste into a bug report next to the screenshot and video.
 */
export const test = base.extend<{ diagnostics: Diagnostics }>({
  diagnostics: [
    async ({ page }, use, testInfo) => {
      const data: Diagnostics = { consoleErrors: [], failedRequests: [], insecureRequests: [] };

      page.on('console', (msg) => {
        if (msg.type() === 'error') data.consoleErrors.push(msg.text());
      });
      page.on('requestfailed', (req) => {
        data.failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText ?? 'failed'}`);
      });
      page.on('request', (req) => {
        if (req.url().startsWith('http://')) data.insecureRequests.push(req.url());
      });

      await use(data);

      if (testInfo.status !== testInfo.expectedStatus) {
        await testInfo.attach('defect-evidence.json', {
          contentType: 'application/json',
          body: JSON.stringify(
            {
              test: testInfo.title,
              device: testInfo.project.name,
              pageUrl: page.url(),
              ...data,
            },
            null,
            2,
          ),
        });
      }
    },
    { auto: true },
  ],
});

export { expect };
