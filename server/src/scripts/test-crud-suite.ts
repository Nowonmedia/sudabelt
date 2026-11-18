import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE CRM/CMS CRUD TEST SUITE ---');

  // 1. Authenticate as Super Admin
  console.log('\n1. Testing Superadmin Login...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@sudabelt.com',
      password: 'SudabeltAdmin2026!',
    }),
  });
  const loginData = await loginRes.json();
  assert.equal(loginRes.status, 200, `Login failed: ${JSON.stringify(loginData)}`);
  assert.ok(loginData.token, 'Expected JWT token in response');
  assert.equal(loginData.user.role, 'superadmin', 'Expected superadmin role');
  const token = loginData.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  console.log('✓ Superadmin login successful. Token acquired.');

  // 2. Test Products CRUD
  console.log('\n2. Testing Products CRUD...');
  // GET
  const getProdsRes = await fetch(`${BASE_URL}/admin/products`, { headers: authHeaders });
  const prodsData = await getProdsRes.json();
  assert.equal(getProdsRes.status, 200);
  console.log(`  Initial products count: ${prodsData.count}`);

  // CREATE
  const newProdRes = await fetch(`${BASE_URL}/admin/products`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Terumo Trima Accel Automated Blood Collection System',
      modelNumber: 'TRIMA-ACCEL-V7',
      brand: 'Terumo BCT',
      category: 'blood-banking-apheresis',
      shortDescription: 'Multi-component apheresis system for platelets, plasma, and RBC collection.',
      fullOverview: 'The Trima Accel system is an industry benchmark in cell therapy and automated apheresis.',
      isConsumable: false,
      datasheetUrl: '/docs/datasheets/terumo-trima-accel.pdf',
      published: true,
    }),
  });
  const createdProd = await newProdRes.json();
  assert.equal(newProdRes.status, 201, `Create product failed: ${JSON.stringify(createdProd)}`);
  const createdProdId = createdProd.data._id;
  console.log(`  ✓ Created product ID: ${createdProdId}`);

  // UPDATE
  const updateProdRes = await fetch(`${BASE_URL}/admin/products/${createdProdId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      shortDescription: 'Updated: Multi-component apheresis system with enhanced donor ergonomics.',
    }),
  });
  const updatedProd = await updateProdRes.json();
  assert.equal(updateProdRes.status, 200);
  assert.equal(updatedProd.data.shortDescription, 'Updated: Multi-component apheresis system with enhanced donor ergonomics.');
  console.log('  ✓ Updated product description.');

  // DELETE
  const delProdRes = await fetch(`${BASE_URL}/admin/products/${createdProdId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert.equal(delProdRes.status, 200);
  console.log('  ✓ Marked product as deleted.');

  // 3. Test Projects CRUD
  console.log('\n3. Testing Projects CRUD...');
  // GET
  const getProjRes = await fetch(`${BASE_URL}/admin/projects`, { headers: authHeaders });
  const projData = await getProjRes.json();
  assert.equal(getProjRes.status, 200);
  console.log(`  Initial projects count: ${projData.count}`);

  // CREATE
  const newProjRes = await fetch(`${BASE_URL}/admin/projects`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: `Delta State Teaching Hospital ICU Equipping ${Date.now()}`,
      category: 'Hospital Equipping',
      facilityName: 'Delta State University Teaching Hospital',
      locationState: 'Delta',
      city: 'Oghara',
      completionYear: 2024,
      isFeatured: false,
      heroImage: '/images/projects/featured-adeboye.webp',
      shortDescription: 'Turnkey 12-bed ICU installation with central monitoring station and medical air piping.',
      fullDescription: 'Comprehensive high-dependency and intensive care unit turnkey expansion delivered in Oghara.',
      scopeOfWork: ['ICU electrical isolation transformers', '12-bed patient monitoring network'],
      equipmentSupplied: ['GE Carescape Monitors', 'Airvo 2 High Flow'],
      published: true,
    }),
  });
  const createdProj = await newProjRes.json();
  assert.equal(newProjRes.status, 201, `Create project failed: ${JSON.stringify(createdProj)}`);
  const createdProjId = createdProj.data._id;
  console.log(`  ✓ Created project ID: ${createdProjId}`);

  // UPDATE
  const updateProjRes = await fetch(`${BASE_URL}/admin/projects/${createdProjId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      isFeatured: true,
      city: 'Oghara, Delta State',
    }),
  });
  const updatedProj = await updateProjRes.json();
  assert.equal(updateProjRes.status, 200);
  assert.equal(updatedProj.data.isFeatured, true);
  console.log('  ✓ Updated project isFeatured.');

  // DELETE
  const delProjRes = await fetch(`${BASE_URL}/admin/projects/${createdProjId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert.equal(delProjRes.status, 200);
  console.log('  ✓ Marked project as deleted.');

  // 4. Test Articles / Blogs CRUD
  console.log('\n4. Testing Articles / Blogs CRUD...');
  // GET
  const getArticlesRes = await fetch(`${BASE_URL}/admin/articles`, { headers: authHeaders });
  const articlesData = await getArticlesRes.json();
  assert.equal(getArticlesRes.status, 200);
  console.log(`  Initial articles count: ${articlesData.count}`);

  // CREATE
  const newArtRes = await fetch(`${BASE_URL}/admin/articles`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: `Automated Apheresis Best Practices ${Date.now()}`,
      type: 'blog',
      category: 'Blood Banking',
      summary: 'Optimizing platelet yields and safety protocols with Terumo BCT systems.',
      content: '## Comprehensive protocols for platelet and plasma collection.\n\nAutomated apheresis reduces donor exposure.',
      coverImage: '/images/services/service-1-tech.jpg',
      readTimeMinutes: 5,
      publishedDate: new Date().toISOString(),
      published: true,
    }),
  });
  const createdArt = await newArtRes.json();
  assert.equal(newArtRes.status, 201, `Create article failed: ${JSON.stringify(createdArt)}`);
  const createdArtId = createdArt.data._id;
  console.log(`  ✓ Created article ID: ${createdArtId}`);

  // UPDATE
  const updateArtRes = await fetch(`${BASE_URL}/admin/articles/${createdArtId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      readTimeMinutes: 7,
    }),
  });
  const updatedArt = await updateArtRes.json();
  assert.equal(updateArtRes.status, 200);
  assert.equal(updatedArt.data.readTimeMinutes, 7);
  console.log('  ✓ Updated article read time.');

  // DELETE
  const delArtRes = await fetch(`${BASE_URL}/admin/articles/${createdArtId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert.equal(delArtRes.status, 200);
  console.log('  ✓ Deleted article.');

  // 5. Test Newsletters CRUD
  console.log('\n5. Testing Newsletters CRUD...');
  // SUBSCRIBERS
  const getSubsRes = await fetch(`${BASE_URL}/admin/newsletter/subscribers`, { headers: authHeaders });
  const subsData = await getSubsRes.json();
  assert.equal(getSubsRes.status, 200);
  console.log(`  Subscribers count: ${subsData.count}`);

  const testEmail = `test-doctor-${Date.now()}@hospital.ng`;
  const addSubRes = await fetch(`${BASE_URL}/admin/newsletter/subscribers`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      email: testEmail,
      name: 'Dr. Test Specialist',
      institution: 'Lagos University Teaching Hospital',
    }),
  });
  const addedSub = await addSubRes.json();
  assert.equal(addSubRes.status, 201);
  console.log('  ✓ Added subscriber.');

  // CAMPAIGNS
  const getCampsRes = await fetch(`${BASE_URL}/admin/newsletter/campaigns`, { headers: authHeaders });
  const campsData = await getCampsRes.json();
  assert.equal(getCampsRes.status, 200);
  console.log(`  Campaigns count: ${campsData.count}`);

  const newCampRes = await fetch(`${BASE_URL}/admin/newsletter/campaigns`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: `Sudabelt Clinical Dispatch ${Date.now()}`,
      subject: 'Critical Care Ventilation and Oxygen Innovations',
      issueNumber: Math.floor(Date.now() / 1000) % 10000,
      quarter: 'Q3',
      year: 2026,
      summary: 'Quarterly review of neonatal humidification and high flow oxygen therapy.',
      content: 'Draft content for Q3 newsletter.',
      status: 'draft',
      published: false,
    }),
  });
  const createdCamp = await newCampRes.json();
  assert.equal(newCampRes.status, 201);
  const createdCampId = createdCamp.data._id;
  console.log('  ✓ Created campaign draft.');

  // SEND CAMPAIGN
  const sendCampRes = await fetch(`${BASE_URL}/admin/newsletter/campaigns/${createdCampId}/send`, {
    method: 'POST',
    headers: authHeaders,
  });
  const sentCamp = await sendCampRes.json();
  assert.equal(sendCampRes.status, 200);
  assert.equal(sentCamp.data.status, 'sent');
  console.log(`  ✓ Dispatched campaign: ${sentCamp.message}`);

  // 6. Test Admin User Management (SUPER ADMIN ONLY)
  console.log('\n6. Testing Admin User Management (Super Admin RBAC)...');
  const getUsersRes = await fetch(`${BASE_URL}/admin/users`, { headers: authHeaders });
  const usersData = await getUsersRes.json();
  assert.equal(getUsersRes.status, 200);
  console.log(`  Current admin users count: ${usersData.count}`);

  // CREATE NEW ADMIN
  const newAdminRes = await fetch(`${BASE_URL}/admin/users`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'Dr. Chinedu Eze (Regional Director)',
      email: 'c.eze@sudabelt.com',
      password: 'SecureAdminPassword2026!',
      role: 'admin',
    }),
  });
  const createdAdmin = await newAdminRes.json();
  assert.equal(newAdminRes.status, 201, `Create admin failed: ${JSON.stringify(createdAdmin)}`);
  const createdAdminId = createdAdmin.data._id;
  console.log(`  ✓ Created new admin user: ${createdAdmin.data.email} (${createdAdmin.data.role})`);

  // UPDATE ADMIN ROLE
  const updateAdminRes = await fetch(`${BASE_URL}/admin/users/${createdAdminId}`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      role: 'editor',
    }),
  });
  const updatedAdmin = await updateAdminRes.json();
  assert.equal(updateAdminRes.status, 200);
  assert.equal(updatedAdmin.data.role, 'editor');
  console.log('  ✓ Updated admin role to editor.');

  // VERIFY NON-SUPERADMIN CANNOT MANAGE ADMINS
  console.log('\n7. Verifying Role-Based Access Control (Editor Cannot Manage Admins)...');
  const editorLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'editor@sudabelt.com',
      password: 'SudabeltEditor2026!',
    }),
  });
  const editorData = await editorLoginRes.json();
  assert.equal(editorLoginRes.status, 200);
  const editorToken = editorData.token;

  // Editor attempts to access /admin/users -> MUST BE 403 FORBIDDEN
  const forbiddenRes = await fetch(`${BASE_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${editorToken}`,
    },
  });
  assert.equal(forbiddenRes.status, 403, `Expected 403 for non-superadmin, got ${forbiddenRes.status}`);
  console.log('  ✓ Confirmed: Non-superadmin is blocked with 403 Forbidden on /admin/users.');

  // Clean up created test admin
  const delAdminRes = await fetch(`${BASE_URL}/admin/users/${createdAdminId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert.equal(delAdminRes.status, 200);
  console.log('  ✓ Deleted test admin user.');

  console.log('\n======================================================');
  console.log('✅ ALL BACKEND CRUD ENDPOINTS VERIFIED & WORKING 100%');
  console.log('======================================================');
}

runTests().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
