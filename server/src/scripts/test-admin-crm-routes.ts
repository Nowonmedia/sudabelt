import assert from 'node:assert/strict';
import http from 'node:http';
import mongoose from 'mongoose';
import app from '../app';
import {
  Product,
  Article,
  RFQ,
  AfterSalesTicket,
  LeadMagnet,
  User,
} from '../models';

interface HttpTestResult {
  status: number;
  body: Record<string, unknown>;
}

const requestJson = (
  port: number,
  method: string,
  path: string,
  payload?: unknown,
  headers: Record<string, string> = {}
): Promise<HttpTestResult> => {
  return new Promise((resolve, reject) => {
    const bodyStr = payload !== undefined ? JSON.stringify(payload) : '';
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(bodyStr ? { 'Content-Length': String(Buffer.byteLength(bodyStr)) } : {}),
          ...headers,
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode || 0,
              body: raw ? (JSON.parse(raw) as Record<string, unknown>) : {},
            });
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
};

const setupInMemoryStore = () => {
  const productsStore: Record<string, unknown>[] = [];
  const articlesStore: Record<string, unknown>[] = [];
  const rfqsStore: Record<string, unknown>[] = [
    {
      _id: new mongoose.Types.ObjectId().toString(),
      referenceId: 'SBM-RFQ-100201',
      facilityName: 'University College Hospital (UCH) Ibadan',
      status: 'pending',
    },
  ];
  const ticketsStore: Record<string, unknown>[] = [
    {
      _id: new mongoose.Types.ObjectId().toString(),
      ticketId: 'SBM-SRV-100301',
      hospitalName: 'National Hospital Abuja',
      urgencyLevel: 'critical_patient_impact',
      status: 'open',
    },
  ];
  const leadsStore: Record<string, unknown>[] = [
    {
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Dr. Ibrahim Danjuma',
      workEmail: 'i.danjuma@akth.org.ng',
      downloadedAssetSlug: 'baxter-artis-physio-hemodialysis-system',
    },
  ];

  // User stub
  (User as unknown as { findOne: () => { exec: () => Promise<null> } }).findOne = () => ({
    exec: async () => null,
  });

  const makeChain = <T>(result: T) => ({
    sort: () => makeChain(result),
    lean: () => ({
      exec: async () => result,
    }),
    exec: async () => result,
  });

  const wireMockCollection = (model: unknown, store: Record<string, unknown>[]) => {
    const m = model as Record<string, unknown>;
    m.create = async (doc: Record<string, unknown>) => {
      const created = {
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...doc,
      };
      store.unshift(created);
      return created;
    };
    m.find = (filter: Record<string, unknown> = {}) => {
      const filtered = store.filter((item) => {
        if (filter.published !== undefined && item.published !== filter.published) return false;
        if (filter.category && item.category !== filter.category) return false;
        if (filter.type && item.type !== filter.type) return false;
        return true;
      });
      return makeChain(filtered);
    };
    m.findOne = (filter: Record<string, unknown> = {}) => {
      const found =
        store.find(
          (item) =>
            (filter._id && String(item._id) === String(filter._id)) ||
            (filter.slug && item.slug === filter.slug)
        ) || null;
      if (found && filter.published === true && found.published !== true) {
        return makeChain(null);
      }
      return makeChain(found);
    };
    m.findOneAndUpdate = (
      filter: Record<string, unknown>,
      update: { $set?: Record<string, unknown> }
    ) => {
      const idx = store.findIndex(
        (item) =>
          (filter._id && String(item._id) === String(filter._id)) ||
          (filter.slug && item.slug === filter.slug)
      );
      if (idx === -1) return makeChain(null);
      store[idx] = { ...store[idx], ...(update.$set || {}), updatedAt: new Date() };
      return makeChain(store[idx]);
    };
    m.findOneAndDelete = (filter: Record<string, unknown>) => {
      const idx = store.findIndex(
        (item) =>
          (filter._id && String(item._id) === String(filter._id)) ||
          (filter.slug && item.slug === filter.slug)
      );
      if (idx === -1) return makeChain(null);
      const [removed] = store.splice(idx, 1);
      return makeChain(removed);
    };
  };

  wireMockCollection(Product, productsStore);
  wireMockCollection(Article, articlesStore);
  wireMockCollection(RFQ, rfqsStore);
  wireMockCollection(AfterSalesTicket, ticketsStore);
  wireMockCollection(LeadMagnet, leadsStore);
};

const runTests = async () => {
  setupInMemoryStore();

  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 5098;

  console.log(`[Test] Running Admin CRM & Public Content API tests on port ${port}...\n`);

  try {
    // 1. Unauthorized check on /api/v1/admin/products -> 401
    const unauth = await requestJson(port, 'GET', '/api/v1/admin/products');
    assert.equal(unauth.status, 401, 'Unauthenticated admin access must return 401');
    console.log('✓ Middleware requireAdminAuth blocks unauthenticated requests (401)');

    // 2. Admin Login -> 200 + JWT
    const loginRes = await requestJson(port, 'POST', '/api/v1/auth/login', {
      email: process.env.ADMIN_EMAIL || 'admin@sudabelt.com',
      password: process.env.ADMIN_PASSWORD || 'SudabeltAdmin2026!',
    });
    assert.equal(loginRes.status, 200, 'Admin login must return 200');
    const token = String(loginRes.body.token);
    assert.ok(token.split('.').length === 3, 'Returned JWT must have 3 segments');
    const authHeaders = { Authorization: `Bearer ${token}` };
    console.log('✓ POST /api/v1/auth/login returns valid 7-day signed HS256 JWT');

    // 3. GET /api/v1/auth/me -> 200
    const meRes = await requestJson(port, 'GET', '/api/v1/auth/me', undefined, authHeaders);
    assert.equal(meRes.status, 200);
    assert.equal((meRes.body.user as { role: string }).role, 'admin');
    console.log('✓ GET /api/v1/auth/me verifies active session token');

    // 4. POST /api/v1/admin/products -> 201
    const createProd = await requestJson(
      port,
      'POST',
      '/api/v1/admin/products',
      {
        name: 'Baxter Artis Physio Hemodialysis System',
        modelNumber: 'ARTIS-PHYSIO-HD',
        brand: 'Baxter International',
        category: 'renal-care',
        shortDescription: 'Multi-therapy HD/HDF delivery platform.',
        fullOverview:
          'Complete hemodialysis and online hemodiafiltration platform supplied and maintained by Sudabelt Medical.',
        specifications: { voltage: '220-240V AC', weight: '95 kg' },
        isConsumable: false,
        datasheetUrl: '/docs/datasheets/sudabelt-baxter-artis-physio-datasheet.pdf',
        published: true,
      },
      authHeaders
    );
    assert.equal(createProd.status, 201);
    const createdProductData = createProd.body.data as { _id: string; slug: string };
    assert.equal(createdProductData.slug, 'baxter-artis-physio-hemodialysis-system');
    console.log('✓ POST /api/v1/admin/products creates product with slug:', createdProductData.slug);

    // 5. Public GET /api/v1/products & GET /api/v1/products/:slug
    const pubProducts = await requestJson(port, 'GET', '/api/v1/products?category=renal-care');
    assert.equal(pubProducts.status, 200);
    assert.equal(pubProducts.body.count, 1);

    const pubSingleProd = await requestJson(
      port,
      'GET',
      `/api/v1/products/${createdProductData.slug}`
    );
    assert.equal(pubSingleProd.status, 200);
    console.log('✓ GET /api/v1/products & GET /api/v1/products/:slug return published product');

    // 6. PUT /api/v1/admin/products/:id (unpublish) -> hides from public
    const updateProd = await requestJson(
      port,
      'PUT',
      `/api/v1/admin/products/${createdProductData._id}`,
      { published: false, pricingNotes: 'Institutional RFQ Tier 1' },
      authHeaders
    );
    assert.equal(updateProd.status, 200);

    const pubHiddenCheck = await requestJson(
      port,
      'GET',
      `/api/v1/products/${createdProductData.slug}`
    );
    assert.equal(pubHiddenCheck.status, 404, 'Unpublished product must return 404 on public endpoint');
    console.log('✓ PUT /api/v1/admin/products/:id updates publication status immediately');

    // 7. POST /api/v1/admin/articles -> 201
    const createArt = await requestJson(
      port,
      'POST',
      '/api/v1/admin/articles',
      {
        title: 'Mirasol PRT Blood Safety Advances in Nigeria',
        type: 'newsletter',
        issueNumber: 14,
        quarter: 'Q1',
        year: 2026,
        category: 'Blood Safety & Hematology',
        summary: 'Reducing transfusion-transmitted infections across Nigerian blood banks.',
        content: '<article><p>Full indexable clinical newsletter content...</p></article>',
        takeaways: ['99.9% pathogen reduction', 'Preserves platelet efficacy'],
        pdfUrl: '/docs/newsletters/sudabelt-issue-14.pdf',
        published: true,
      },
      authHeaders
    );
    assert.equal(createArt.status, 201);
    const createdArticleData = createArt.body.data as { _id: string; slug: string };
    console.log('✓ POST /api/v1/admin/articles creates newsletter issue:', createdArticleData.slug);

    // 8. Public GET /api/v1/articles & GET /api/v1/articles/:slug
    const pubArticles = await requestJson(port, 'GET', '/api/v1/articles?type=newsletter');
    assert.equal(pubArticles.status, 200);
    assert.equal(pubArticles.body.count, 1);

    const pubSingleArt = await requestJson(
      port,
      'GET',
      `/api/v1/articles/${createdArticleData.slug}`
    );
    assert.equal(pubSingleArt.status, 200);
    console.log('✓ GET /api/v1/articles & GET /api/v1/articles/:slug return published newsletter');

    // 9. Admin Lead & Ticket Viewers (/rfqs, /support-tickets, /leads)
    const rfqsRes = await requestJson(port, 'GET', '/api/v1/admin/rfqs', undefined, authHeaders);
    assert.equal(rfqsRes.status, 200);
    assert.equal(rfqsRes.body.count, 1);

    const ticketsRes = await requestJson(
      port,
      'GET',
      '/api/v1/admin/support-tickets',
      undefined,
      authHeaders
    );
    assert.equal(ticketsRes.status, 200);
    assert.equal(ticketsRes.body.count, 1);

    const leadsRes = await requestJson(port, 'GET', '/api/v1/admin/leads', undefined, authHeaders);
    assert.equal(leadsRes.status, 200);
    assert.equal(leadsRes.body.count, 1);
    console.log('✓ GET /api/v1/admin/rfqs, /support-tickets, and /leads verified');

    // 10. DELETE /api/v1/admin/products/:id & /articles/:id
    const delProd = await requestJson(
      port,
      'DELETE',
      `/api/v1/admin/products/${createdProductData._id}`,
      undefined,
      authHeaders
    );
    assert.equal(delProd.status, 200);

    const delArt = await requestJson(
      port,
      'DELETE',
      `/api/v1/admin/articles/${createdArticleData._id}`,
      undefined,
      authHeaders
    );
    assert.equal(delArt.status, 200);
    console.log('✓ DELETE /api/v1/admin/products/:id and /articles/:id verified');

    console.log('\n🎉 All Admin CRM, Auth, and Public Content API tests passed!');
  } finally {
    server.close();
  }
};

void runTests();
