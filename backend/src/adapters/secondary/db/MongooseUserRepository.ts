import { IUserRepository } from '../../../domain/ports/secondary/IUserRepository';
import { User } from '../../../domain/models/User';
import { UserModel } from './UserSchema';
import { CandidateProfileModel } from './CandidateProfile';
import { CompanyProfileModel } from './CompanyProfile';
import { JobModel } from './JobSchema';
import { ApplicationModel } from './ApplicationSchema';
import { MessageModel } from './MessageSchema';
import { ICandidateProfile, ParsedCvData, ICompanyProfile } from '../../../domain/models/Profile';
export class MongooseUserRepository implements IUserRepository {

  async findByEmail(email: string) {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;
    return {
      id: userDoc.id,
      name: userDoc.name,
      email: userDoc.email,
      passwordHash: userDoc.passwordHash,
      role: userDoc.role as 'candidate' | 'recruiter' | 'admin',
      createdAt: userDoc.createdAt as Date,
      phone: userDoc.get('phone')?? null,    
      location: userDoc.get('location')?? null,
      profilePicture: userDoc.get('profilePicture') || ''
    };
  }

  async findById(id: string) {
    // Try custom `id` field first, then fall back to MongoDB `_id`
    const userDoc = await UserModel.findOne({ $or: [{ id }, { _id: id }] }).catch(() => null)
                  ?? await UserModel.findOne({ id });
    if (!userDoc) return null;
    return {
      id: userDoc.id,
      name: userDoc.name,
      email: userDoc.email,
      passwordHash: userDoc.passwordHash,
      role: userDoc.role as 'candidate' | 'recruiter' | 'admin',
      createdAt: userDoc.createdAt as Date,
      phone: userDoc.get('phone') ?? null,    
      location: userDoc.get('location') ?? null,
      profilePicture: userDoc.get('profilePicture') || ''
    };
  }

async save(user: User): Promise<User> {
  const created = await UserModel.create(user);
  
  return {
    id: created.id,
    name: created.name,
    email: created.email,
    passwordHash: created.passwordHash,
    role: created.role as 'candidate' | 'recruiter' | 'admin',
    createdAt: created.createdAt,
    phone: created.get('phone')?? null,
    location: created.get('location') ?? null,
    profilePicture: created.get('profilePicture') || ''
  };
}

  async exists(email: string) {
    return !!(await UserModel.findOne({ email }));
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
  const updatedDoc = await UserModel.findOneAndUpdate({ id }, { $set: data }, { returnDocument: 'after' });
  if (!updatedDoc) return null;

  return {
    id: updatedDoc.id,
    name: updatedDoc.name,
    email: updatedDoc.email,
    role: updatedDoc.role as 'candidate' | 'recruiter' | 'admin',
    createdAt: updatedDoc.createdAt,       
    phone: updatedDoc.get('phone')?? null,        
    location: updatedDoc.get('location')?? null,
    profilePicture: updatedDoc.get('profilePicture') || ''
  };
}

async delete(id: string): Promise<boolean> {
  // 1. Find the user first to determine the role
  const user = await UserModel.findOne({ id });
  if (!user) return false;

  try {
    // 2. Delete Profile (Candidate or Company)
    if (user.role === 'candidate') {
      await CandidateProfileModel.deleteOne({ userId: id });
      // 3. Delete Candidate Applications
      await ApplicationModel.deleteMany({ candidateId: id });
    } else if (user.role === 'recruiter') {
      await CompanyProfileModel.deleteOne({ userId: id });
      // 4. Delete Recruiter Jobs and their Applications
      const jobs = await JobModel.find({ recruiterId: id });
      const jobIds = jobs.map(j => j._id);
      await ApplicationModel.deleteMany({ jobId: { $in: jobIds } });
      await JobModel.deleteMany({ recruiterId: id });
    }

    // 5. Delete Messages (Sent or Received)
    await MessageModel.deleteMany({
      $or: [{ senderId: id }, { recipientId: id }]
    });

    // 6. Delete User record
    const result = await UserModel.deleteOne({ id });
    return result.deletedCount > 0;

  } catch (error) {
    console.error('Delete account failed:', error);
    throw error;
  }
}



    async saveCvData(userId: string, cvData: ParsedCvData): Promise<void> {
        await CandidateProfileModel.findOneAndUpdate(
            { userId },
            {
                $set: {
                    about: cvData.about,
                    skills: cvData.skills,
                    links: cvData.links,
                    experience: cvData.experience,
                    yearsOfExperience: cvData.yearsOfExperience,
                    education: cvData.education,
                    certifications: cvData.certifications,
                    updatedAt: new Date()
                }
            },
            { 
                upsert: true, 
                returnDocument: 'after',
                setDefaultsOnInsert: true 
            }
        );
    }

    async getProfile(userId: string): Promise<ICandidateProfile | null> {
        return CandidateProfileModel.findOne({ userId }).lean();
    }

    async saveCompanyProfile(userId: string, data: ICompanyProfile): Promise<void> {
        await CompanyProfileModel.findOneAndUpdate(
            { userId },
            { $set: { ...data, updatedAt: new Date() } },
            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
        );
    }

    async getCompanyProfile(userId: string): Promise<ICompanyProfile | null> {
        return CompanyProfileModel.findOne({ userId }).lean();
    }
}
