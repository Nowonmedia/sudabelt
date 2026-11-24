import assert from 'node:assert/strict';
import http from 'node:http';
import mongoose from 'mongoose';
import app from '../app';
import {
  RFQ,
  TrainingRegistration,
  AfterSalesTicket,
  ContactInquiry,
  LeadMagnet,
  Product,
} from '../models';

interface TestResponse {
  status: number;
  body: Record<string, unknown>;
}

const postJson = (port: number, path: string, payload: unknown): Promise<TestResponse> => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
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
              body: JSON.parse(raw) as Record<string, unknown>,
            });
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

const setupDatabaseOrMock = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sudabelt_medical_test';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
    console.log('[Test] Connected to live MongoDB instance.');
    return true;
  } catch {
    console.log('[Test] Local MongoDB not running; using in-memory Mongoose model stubs for route verification.');

    // Stub Mongoose .create() and .findOne() so the HTTP route handlers execute end-to-end
    const stubCreate = <T extends Record<string, unknown>>(model: unknown) => {
      (model as { create: (doc: T) => Promise<T & { _id: mongoose.Types.ObjectId }> }).create =
        async (doc: T) => ({
          _id: new mongoose.Types.ObjectId(),
          ...doc,
        });
    };

    stubCreate(RFQ);
    stubCreate(TrainingRegistration);
    stubCreate(AfterSalesTicket);
    stubCreate(ContactInquiry);
    stubCreate(LeadMagnet);

    (Product as unknown as { findOne: () => { lean: () => { exec: () => Promise<null> } } }).findOne =
      () => ({
        lean: () => ({
          exec: async () => null,
        }),
      });

    return false;
  }
};

const runTests = async (): Promise<void> => {
  const isLiveDb = await setupDatabaseOrMock();
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 5099;

  console.log(`[Test] Running Form Ingestion & Lead Capture API tests on port ${port}...\n`);

  try {
    // 1. POST /api/v1/rfq (Valid -> 201)
    const rfqValid = await postJson(port, '/api/v1/rfq', {
      facilityName: 'Lagos University Teaching Hospital (LUTH)',
      facilityType: 'Teaching Hospital',
      location: { city: 'Idi-Araba', state: 'Lagos' },
      urgency: 'Immediate (Within 30 Days)',
      selectedItems: [
        {
          equipmentId: 'prod-baxter-artis-physio',
          sku: 'SB-HD-BAX-AP01',
          name: 'Baxter Artis Physio Hemodialysis System',
          quantity: 4,
        },
        {
          equipmentId: 'prod-baxter-cleancart-c',
          sku: 'SB-CON-BAX-CC01',
          name: 'Baxter CleanCart C Cartridge',
          quantity: 20,
        },
      ],
      slaTier: 'Quarterly Preventive Maintenance + <24hr Emergency SLA',
      contact: {
        name: 'Dr. Adewale Ogunleye',
        role: 'Head of Nephrology & Dialysis Procurement',
        email: 'a.ogunleye@luth.gov.ng',
        phone: '+2348030001122',
      },
    });

    assert.equal(rfqValid.status, 201, 'POST /api/v1/rfq should return 201');
    assert.equal(rfqValid.body.success, true);
    assert.match(String(rfqValid.body.referenceId), /^SBM-RFQ-\d{6}$/);
    assert.match(String(rfqValid.body.whatsappUrl), /^https:\/\/wa\.me\//);
    console.log('✓ POST /api/v1/rfq (Valid Payload -> 201):', rfqValid.body.referenceId);

    // 2. POST /api/v1/rfq (Invalid -> 400)
    const rfqInvalid = await postJson(port, '/api/v1/rfq', {
      facilityName: 'A',
      selectedItems: [],
    });
    assert.equal(rfqInvalid.status, 400, 'Invalid POST /api/v1/rfq should return 400');
    assert.equal(rfqInvalid.body.success, false);
    assert.ok(Array.isArray(rfqInvalid.body.errors) && rfqInvalid.body.errors.length > 0);
    console.log('✓ POST /api/v1/rfq (Invalid Payload -> 400 with Zod errors verified)');

    // 3. POST /api/v1/training-booking (Valid -> 201 & Invalid -> 400)
    const trainingValid = await postJson(port, '/api/v1/training-booking', {
      institutionName: 'National Hospital Abuja',
      courseTrack: 'Renal Nursing & Hemodiafiltration (HDF) Clinical Certification',
      numberOfTrainees: 12,
      targetHospitalState: 'FCT Abuja',
      contactName: 'Matron Chidinma Okafor',
      contactRole: 'Chief Nursing Officer (Renal Unit)',
      email: 'c.okafor@nationalhospital.gov.ng',
      phone: '+2348091112233',
    });
    assert.equal(trainingValid.status, 201);
    assert.equal(trainingValid.body.success, true);
    assert.match(String(trainingValid.body.registrationId), /^SBM-TRN-\d{6}$/);
    console.log('✓ POST /api/v1/training-booking (Valid Payload -> 201):', trainingValid.body.registrationId);

    const trainingInvalid = await postJson(port, '/api/v1/training-booking', {
      institutionName: '',
      numberOfTrainees: 0,
    });
    assert.equal(trainingInvalid.status, 400);
    console.log('✓ POST /api/v1/training-booking (Invalid Payload -> 400 verified)');

    // 4. POST /api/v1/after-sales-support (Valid -> 201 & Invalid -> 400)
    const ticketValid = await postJson(port, '/api/v1/after-sales-support', {
      hospitalName: 'Aminu Kano Teaching Hospital',
      equipmentModel: 'Baxter Artis Physio',
      serialNumber: 'BAX-AP-2025-8841',
      issueType: 'breakdown',
      urgencyLevel: 'critical_patient_impact',
      description: 'Inlet water pressure transducer alarm triggered during morning dialysis shift.',
      contactName: 'Engr. Musa Abdullahi',
      email: 'm.abdullahi@akth.org.ng',
      phone: '+2348023334455',
      locationState: 'Kano',
    });
    assert.equal(ticketValid.status, 201);
    assert.equal(ticketValid.body.success, true);
    assert.match(String(ticketValid.body.ticketId), /^SBM-SRV-\d{6}$/);
    assert.match(String(ticketValid.body.whatsappUrgentUrl), /^https:\/\/wa\.me\//);
    console.log('✓ POST /api/v1/after-sales-support (Valid Payload -> 201):', ticketValid.body.ticketId);

    const ticketInvalid = await postJson(port, '/api/v1/after-sales-support', {
      hospitalName: 'AKTH',
      issueType: 'invalid_type',
    });
    assert.equal(ticketInvalid.status, 400);
    console.log('✓ POST /api/v1/after-sales-support (Invalid Payload -> 400 verified)');

    // 5. POST /api/v1/contact (Valid -> 201 & Invalid -> 400)
    const contactValid = await postJson(port, '/api/v1/contact', {
      name: 'Dr. Tonye Briggs',
      email: 't.briggs@rivershealth.gov.ng',
      phone: '+2348056667788',
      facilityName: 'Rivers State University Teaching Hospital',
      department: 'sales',
      message: 'We would like a turnkey consultation for setting up an apheresis unit.',
    });
    assert.equal(contactValid.status, 201);
    assert.equal(contactValid.body.success, true);
    console.log('✓ POST /api/v1/contact (Valid Payload -> 201)');

    const contactInvalid = await postJson(port, '/api/v1/contact', {
      name: 'Dr. Briggs',
      email: 'not-an-email',
    });
    assert.equal(contactInvalid.status, 400);
    console.log('✓ POST /api/v1/contact (Invalid Payload -> 400 verified)');

    // 6. POST /api/v1/lead-capture (Valid -> 201 & Invalid -> 400)
    const leadValid = await postJson(port, '/api/v1/lead-capture', {
      name: 'Pharm. Ngozi Eze',
      workEmail: 'n.eze@ Reddingtonhospital.com'.replace(/\s+/g, ''),
      phone: '+2348069990011',
      facilityName: 'Reddington Multi-Specialist Hospital',
      assetSlug: 'baxter-artis-physio-hemodialysis-system',
    });
    assert.equal(leadValid.status, 201);
    assert.equal(leadValid.body.success, true);
    assert.match(String(leadValid.body.downloadUrl), /\.pdf$/);
    console.log('✓ POST /api/v1/lead-capture (Valid Payload -> 201):', leadValid.body.downloadUrl);

    const leadInvalid = await postJson(port, '/api/v1/lead-capture', {
      name: 'Ngozi',
      workEmail: 'invalid-email',
    });
    assert.equal(leadInvalid.status, 400);
    console.log('✓ POST /api/v1/lead-capture (Invalid Payload -> 400 verified)');

    console.log('\n🎉 All 10 test assertions passed (201 on valid payloads, 400 with descriptive Zod errors on invalid payloads)!');
  } finally {
    server.close();
    if (isLiveDb) {
      await mongoose.connection.close();
    }
  }
};

void runTests();
