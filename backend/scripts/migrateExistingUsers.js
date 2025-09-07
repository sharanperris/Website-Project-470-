import mongoose from 'mongoose';
import userModel from '../models/userModel.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function to update existing users
const migrateExistingUsers = async () => {
  try {
    console.log('🔄 Starting migration for existing users...');
    
    // Find all users who don't have the isVerified field or have it as undefined/null
    const usersToUpdate = await userModel.find({
      $or: [
        { isVerified: { $exists: false } },
        { isVerified: null },
        { isVerified: undefined }
      ]
    });

    console.log(`📊 Found ${usersToUpdate.length} users to update`);

    if (usersToUpdate.length === 0) {
      console.log('✅ No users need migration');
      return;
    }

    // Update all existing users to be verified (since they were created before verification was required)
    const updateResult = await userModel.updateMany(
      {
        $or: [
          { isVerified: { $exists: false } },
          { isVerified: null },
          { isVerified: undefined }
        ]
      },
      {
        $set: { 
          isVerified: true,  // Set existing users as verified
          otp: null,
          otpExpires: null
        }
      }
    );

    console.log(`✅ Successfully updated ${updateResult.modifiedCount} users`);
    console.log('📋 Migration Summary:');
    console.log('   - Existing users are now marked as verified');
    console.log('   - They can login without OTP verification');
    console.log('   - New users will still need to verify with OTP');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Alternative: Set existing users as unverified (if you want them to verify too)
const migrateExistingUsersAsUnverified = async () => {
  try {
    console.log('🔄 Starting migration for existing users (as unverified)...');
    
    const usersToUpdate = await userModel.find({
      $or: [
        { isVerified: { $exists: false } },
        { isVerified: null },
        { isVerified: undefined }
      ]
    });

    console.log(`📊 Found ${usersToUpdate.length} users to update`);

    if (usersToUpdate.length === 0) {
      console.log('✅ No users need migration');
      return;
    }

    const updateResult = await userModel.updateMany(
      {
        $or: [
          { isVerified: { $exists: false } },
          { isVerified: null },
          { isVerified: undefined }
        ]
      },
      {
        $set: { 
          isVerified: false,  // Set existing users as unverified
          otp: null,
          otpExpires: null
        }
      }
    );

    console.log(`✅ Successfully updated ${updateResult.modifiedCount} users`);
    console.log('📋 Migration Summary:');
    console.log('   - Existing users are now marked as unverified');
    console.log('   - They will need to verify with OTP on next login');
    console.log('   - OTP will be generated when they try to login');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Main function
const runMigration = async () => {
  await connectDB();
  
  console.log('Choose migration option:');
  console.log('1. Mark existing users as VERIFIED (recommended)');
  console.log('2. Mark existing users as UNVERIFIED (they will need to verify)');
  
  // For this implementation, we'll mark existing users as verified
  // This is the recommended approach for existing production users
  await migrateExistingUsers();
  
  // Uncomment the line below if you want existing users to verify too:
  // await migrateExistingUsersAsUnverified();
  
  mongoose.connection.close();
  console.log('🔚 Migration completed and database connection closed');
};

// Run migration
runMigration();
