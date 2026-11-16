import { Router } from 'express';
import formsRouter from './forms.routes';
import authRouter from './auth.routes';
import adminRouter from './admin.routes';
import publicContentRouter from './publicContent.routes';

const apiV1Router = Router();

// 1. Admin Authentication (/api/v1/auth/*)
apiV1Router.use('/auth', authRouter);

// 2. Protected Internal Admin CRM (/api/v1/admin/*)
apiV1Router.use('/admin', adminRouter);

// 3. Public Catalog & Content Retrieval (/api/v1/products*, /api/v1/articles*)
apiV1Router.use('/', publicContentRouter);

// 4. Public Form Ingestion, WhatsApp Payload & Lead Capture Routes (/api/v1/rfq, etc.)
apiV1Router.use('/', formsRouter);

export default apiV1Router;
