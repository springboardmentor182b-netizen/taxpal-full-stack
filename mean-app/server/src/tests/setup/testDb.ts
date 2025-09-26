import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as os from "os";
import * as path from "path";

let mongoServer: MongoMemoryServer | null = null;

/**
 * Start MongoDB Memory Server and connect
 */
export const setupTestDb = async (): Promise<void> => {
  try {
    // Disconnect if already connected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create MongoMemoryServer if not exists
    if (!mongoServer) {
      console.log('🚀 Creating MongoDB Memory Server...');
      const cacheDir = path.join(os.homedir(), '.cache', 'mongodb-binaries');
      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '5.0.8',
          downloadDir: cacheDir,
          checkMD5: false,
        },
        instance: { dbName: 'testDb', launchTimeout: 120000 }
      });
      console.log('✅ MongoDB Memory Server created');
    }

    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Test MongoDB connected');
  } catch (error) {
    console.error('❌ Test DB setup failed:', error);
    throw error;
  }
};

/**
 * Disconnect and stop MongoMemoryServer
 */
export const teardownTestDb = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }
    console.log('✅ Test MongoDB disconnected');
  } catch (error) {
    console.error('❌ Test DB teardown failed:', error);
  }
};

/**
 * Clear all collections
 */
export const clearTestDb = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      await Promise.all(
        Object.keys(collections).map(key => collections[key].deleteMany({}))
      );
    }
  } catch (error) {
    console.error('❌ Test DB clear failed:', error);
    throw error;
  }
};
