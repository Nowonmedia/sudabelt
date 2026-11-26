import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import apiV1Router from './routes';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler';

const app: Application = express();

// 1. Security & CORS Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: true, // Allow localhost, 127.0.0.1, LAN IP 192.168.100.164, etc.
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
  })
);

// 2. Body Parsing Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving with 7-day browser cache
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), { maxAge: '7d' }));

// 3. Health Check Endpoint
app.get('/api/v1/health', (_req: Request, res: Response) => {
  const dbStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    service: 'Sudabelt Medical API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStateMap[mongoose.connection.readyState] || 'unknown',
  });
});

// 4. API v1 Routes
app.use('/api/v1', apiV1Router);

// 5. 404 & Global Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
