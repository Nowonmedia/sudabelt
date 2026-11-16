import 'dotenv/config';
import app from './app';
import { connectDB, disconnectDB } from './config/db';

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[Sudabelt Server] Running in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`
    );
    console.log(`[Sudabelt Server] Health check: http://localhost:${PORT}/api/v1/health`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`\n[Sudabelt Server] ${signal} received. Closing HTTP server and MongoDB connection...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
};

void startServer();
