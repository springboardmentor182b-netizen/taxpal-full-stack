import mongoose from "mongoose";
import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: '.env.test' });

/**
 * Connect to MongoDB Atlas Test Database
 */
export const setupTestDb = async (): Promise<void> => {
  try {
    // Force disconnect and cleanup any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(true);
    }

    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env.test');
    }

    // Safety check: Ensure we're using a test database
    if (!mongoUri.includes('test') && !mongoUri.includes('Test') && !mongoUri.includes('TEST')) {
      throw new Error('⚠️ SAFETY CHECK FAILED: Database name must contain "test", "Test", or "TEST"');
    }

    // Safety check: Ensure NODE_ENV is test
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('⚠️ SAFETY CHECK FAILED: NODE_ENV must be "test"');
    }

    console.log('🚀 Connecting to MongoDB Atlas Test Database...');
    
    // Optimized connection settings to prevent memory leaks
    await mongoose.connect(mongoUri, {
      maxPoolSize: 5,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ Test MongoDB Atlas connected');
  } catch (error) {
    console.error('❌ Test DB setup failed:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB Atlas and cleanup
 */
export const teardownTestDb = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      // Optional: Clear all data before disconnecting
      await clearTestDb();
      await mongoose.connection.close();
    }
    console.log('✅ Test MongoDB Atlas disconnected');
  } catch (error) {
    console.error('❌ Test DB teardown failed:', error);
    throw error;
  }
};

/**
 * Clear all collections in the test database
 */
export const clearTestDb = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      
      // Delete all documents from all collections
      await Promise.all(
        Object.keys(collections).map(key => collections[key].deleteMany({}))
      );
      
      console.log('🧹 Test database cleared');
    }
  } catch (error) {
    console.error('❌ Test DB clear failed:', error);
    throw error;
  }
};