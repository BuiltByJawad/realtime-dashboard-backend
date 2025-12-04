import request from 'supertest';
import app from '../src/app';

const DEMO_EMAIL = 'admin@example.com';
const DEMO_PASSWORD = 'Admin@123';

jest.setTimeout(20000);

async function loginAndGetCookie() {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD });

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);

  const cookies = res.headers['set-cookie'];
  expect(cookies).toBeDefined();
  const cookie = cookies[0].split(';')[0];
  return cookie;
}

describe('Analytics overview API', () => {
  it('should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/analytics/overview');

    expect(res.status).toBe(401);
  });

  it('should return overview analytics for authenticated user', async () => {
    const cookie = await loginAndGetCookie();

    const res = await request(app)
      .get('/api/analytics/overview')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();

    const overview = res.body.data;
    expect(Array.isArray(overview.byStatus)).toBe(true);
    expect(Array.isArray(overview.byCategory)).toBe(true);
    expect(typeof overview.totalInventoryValue).toBe('number');
  });
});