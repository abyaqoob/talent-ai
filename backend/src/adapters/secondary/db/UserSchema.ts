import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id:           { type: String,  required: true, unique: true },
  name:         { type: String,  required: true },
  email:        { type: String,  required: true, unique: true },
  passwordHash: { type: String,  required: true },
  role:         { type: String,  enum: ['candidate', 'recruiter'] },
  phone:        { type: String }, 
  location:     { type: String }, 
  savedJobs:    { type: [String], default: [] }, // ✅ Added for Bug 3
  notificationPrefs: {
    jobMatches:          { type: Boolean, default: true },
    applicationUpdates:  { type: Boolean, default: true },
    messages:            { type: Boolean, default: true },
  },
  profilePicture: { type: String, default: '' },
  createdAt:    { type: Date,    default: Date.now },
});

export const UserModel = mongoose.model('User', UserSchema);