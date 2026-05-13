import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import { JobModel } from './adapters/secondary/db/JobSchema';
import { ApplicationModel } from './adapters/secondary/db/ApplicationSchema';
import { MessageModel } from './adapters/secondary/db/MessageSchema';
import { NotificationModel } from './adapters/secondary/db/NotificationSchema';
import { UserModel } from './adapters/secondary/db/UserSchema';
import { CandidateProfileModel } from './adapters/secondary/db/CandidateProfile';

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ MONGO_URI is not defined in backend/.env file');
  process.exit(1);
}

async function clearDatabase() {
  console.log(`🔌 Connecting to MongoDB at: ${mongoUri}`);
  try {
    await mongoose.connect(mongoUri!);
    console.log('✅ Connected to MongoDB successfully.');

    // 1. Delete all jobs
    console.log('🧹 Clearing all Jobs...');
    const jobsResult = await JobModel.deleteMany({});
    console.log(`   Deleted ${jobsResult.deletedCount} job postings.`);

    // 2. Delete all job applications
    console.log('🧹 Clearing all Job Applications...');
    const appsResult = await ApplicationModel.deleteMany({});
    console.log(`   Deleted ${appsResult.deletedCount} job applications.`);

    // 3. Delete all messages (often linked to jobs/applications)
    console.log('🧹 Clearing all Messages...');
    const messagesResult = await MessageModel.deleteMany({});
    console.log(`   Deleted ${messagesResult.deletedCount} messages.`);

    // 4. Delete all notifications (often linked to jobs/applications)
    console.log('🧹 Clearing all Notifications...');
    const notificationsResult = await NotificationModel.deleteMany({});
    console.log(`   Deleted ${notificationsResult.deletedCount} notifications.`);

    // 5. Reset savedJobs list on all users
    console.log('🔄 Resetting saved jobs lists for all users...');
    const usersResult = await UserModel.updateMany({}, { $set: { savedJobs: [] } });
    console.log(`   Reset savedJobs list for ${usersResult.modifiedCount} users.`);

    // 6. Reset applicationsSent count on all candidate profiles
    console.log('🔄 Resetting applications sent count for all candidates...');
    const profilesResult = await CandidateProfileModel.updateMany({}, { $set: { applicationsSent: 0 } });
    console.log(`   Reset applicationsSent count for ${profilesResult.modifiedCount} candidate profiles.`);

    console.log('\n✨ Database cleanup completed successfully! The jobs and application-related data have been fully cleared.');
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

clearDatabase();
