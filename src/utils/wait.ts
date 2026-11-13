/**
 * Poll a condition until it returns a truthy value or the timeout expires.
 * Use this instead of fixed sleeps so tests are fast and not flaky.
 */
export async function pollUntil<T>(
  fn: () => Promise<T | undefined | false>,
  { timeoutMs = 15_000, intervalMs = 500, message = 'Condition not met in time' } = {},
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (err) {
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`${message}${lastError ? ` (last error: ${String(lastError)})` : ''}`);
}
