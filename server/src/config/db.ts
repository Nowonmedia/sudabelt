import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 2000;

/**
 * Connects to MongoDB with automatic exponential-backoff retry logic.
 */
export const connectDB = async (retryCount = 0): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sudabelt_medical';

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} (${conn.connection.name})`);

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Runtime connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection disconnected.');
    });

    return conn;
  } catch (error) {
    const nextRetry = retryCount + 1;
    console.error(
      `[MongoDB] Connection attempt ${nextRetry}/${MAX_RETRIES} failed:`,
      error instanceof Error ? error.message : error
    );

    if (nextRetry < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount);
      console.log(`[MongoDB] Retrying connection in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return connectDB(nextRetry);
    }

    console.error('[MongoDB] Exhausted all connection retries. Exiting process.');
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed gracefully.');
  }
};
