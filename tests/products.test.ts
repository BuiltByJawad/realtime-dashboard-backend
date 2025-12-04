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

describe('Products API', () => {
  it('should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(401);
  });

  it('should allow full CRUD flow for an authenticated user', async () => {
    const cookie = await loginAndGetCookie();

    // List products
    const listBefore = await request(app)
      .get('/api/products')
      .set('Cookie', cookie);

    expect(listBefore.status).toBe(200);
    expect(listBefore.body.success).toBe(true);
    expect(Array.isArray(listBefore.body.data)).toBe(true);

    // Create product
    const createRes = await request(app)
      .post('/api/products')
      .set('Cookie', cookie)
      .send({
        name: 'Test Product from Jest',
        price: 123.45,
        status: 'active',
        category: 'Test Category',
        stock: 5,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    const created = createRes.body.data;
    expect(created.id).toBeDefined();

    const productId: string = created.id;

    // Update product
    const updateRes = await request(app)
      .put(`/api/products/${productId}`)
      .set('Cookie', cookie)
      .send({
        name: 'Updated Product from Jest',
        price: 200,
        status: 'inactive',
        category: 'Updated Category',
        stock: 10,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.data.status).toBe('inactive');

    // Change status via dedicated endpoint
    const statusRes = await request(app)
      .patch(`/api/products/${productId}/status`)
      .set('Cookie', cookie)
      .send({ status: 'active' });

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.success).toBe(true);
    expect(statusRes.body.data.status).toBe('active');

    // Delete product
    const deleteRes = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Cookie', cookie);

    expect(deleteRes.status).toBe(204);

    // Ensure it no longer appears in the list
    const listAfter = await request(app)
      .get('/api/products')
      .set('Cookie', cookie);

    expect(listAfter.status).toBe(200);
    const idsAfter: string[] = listAfter.body.data.map((p: any) => p.id);
    expect(idsAfter).not.toContain(productId);
  });
});
