import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

/** Backend service checks: the "services" half of "apps and services". */
describe('Posts service', () => {
  it('TC-040 GET /posts returns 200, JSON and a non-empty list', async () => {
    const res = await fetch(`${base}/posts`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') ?? '', /application\/json/);
    const body = (await res.json()) as unknown[];
    assert.ok(Array.isArray(body) && body.length > 0);
  });

  it('TC-041 GET /posts/1 matches the expected schema', async () => {
    const res = await fetch(`${base}/posts/1`);
    assert.equal(res.status, 200);
    const post = (await res.json()) as Record<string, unknown>;
    assert.equal(post.id, 1);
    assert.equal(typeof post.userId, 'number');
    assert.equal(typeof post.title, 'string');
    assert.equal(typeof post.body, 'string');
  });

  it('TC-042 POST /posts creates a resource (201)', async () => {
    const payload = { userId: 1, title: 'qa post', body: 'created by test' };
    const res = await fetch(`${base}/posts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res.status, 201);
    const body = (await res.json()) as Record<string, unknown>;
    assert.equal(body.title, payload.title);
    assert.ok(body.id);
  });

  it('TC-043 unknown resource returns 404', async () => {
    const res = await fetch(`${base}/posts/999999`);
    assert.equal(res.status, 404);
  });

  it('TC-044 response time is under 2 seconds', async () => {
    const start = Date.now();
    await fetch(`${base}/posts/1`);
    const elapsed = Date.now() - start;
    assert.ok(elapsed < 2000, `took ${elapsed} ms`);
  });
});
