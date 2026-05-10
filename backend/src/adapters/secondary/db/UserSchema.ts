import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id:           { type: String,  required: true, unique: true },
  name:         { type: String,  required: true },
  email:        { type: String,  required: true, unique: true },
  passwordHash: { type: String,  required: true },
  role:         { type: String,  enum: ['candidate', 'recruiter'] },
  phone:        { type: String }, 
  location:     { type: String }, 
  createdAt:    { type: Date,    default: Date.now },
});

export const UserModel = mongoose.model('User', UserSchema);