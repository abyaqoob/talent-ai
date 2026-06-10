import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { RegisterUser } from '../../../../domain/use-cases/RegisterUser';
import { AppError } from '../../../../shared/errors/AppError';
import { LoginUser } from '@/domain/use-cases/LoginUser';
import { DeleteUser } from '@/domain/use-cases/DeleteUser';
import { UpdateProfile } from '@/domain/use-cases/UpdateProfile';
import { SaveProfileUseCase } from '@/domain/use-cases/SaveProfileUseCase';
import { ParseCvUseCase } from '@/domain/use-cases/ParseCvUseCase';
import { GetProfileUseCase } from '@/domain/use-cases/GetProfileUseCase';
import { AnalyzeCvUseCase } from '@/domain/use-cases/AnalyzeCvUseCase';
import { SaveCompanyProfileUseCase } from '@/domain/use-cases/SaveCompanyProfileUseCase';
import { GetCompanyProfileUseCase } from '@/domain/use-cases/GetCompanyProfileUseCase';
import { UserModel } from '../../../secondary/db/UserSchema';
import { CandidateProfileModel } from '../../../secondary/db/CandidateProfile';
import { IUserRepository } from '@/domain/ports/secondary/IUserRepository';
export class UserController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private updateProfile: UpdateProfile,
    private deleteUser: DeleteUser,
    private parseCvUseCase: ParseCvUseCase,      
    private saveProfileUseCase: SaveProfileUseCase,  
    private getProfileUseCase: GetProfileUseCase,
    private analyzeCvUseCase: AnalyzeCvUseCase,
    private saveCompanyProfileUseCase: SaveCompanyProfileUseCase,
    private getCompanyProfileUseCase: GetCompanyProfileUseCase,
    private userRepository?: IUserRepository
  ) {}

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, companyName, companySize, industry, website } = req.body;

      // Validate role
      if (!role || !['candidate', 'recruiter'].includes(role)) {
        return res.status(400).json({ error: 'Role must be either candidate or recruiter' });
      }

      // Validate password length
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      const user = await this.registerUser.execute({ name, email, password, role });

      // ✅ BUG FIX: Save company profile during recruiter registration
      if (role === 'recruiter' && companyName) {
        try {
          await this.saveCompanyProfileUseCase.execute(user.id!, {
            userId: user.id!,
            companyName: companyName || '',
            industry: industry || 'Technology',
            companySize: companySize || '1-10',
            website: website || '',
            description: '',
          });
        } catch (profileErr) {
          console.warn('Company profile save failed (non-critical):', profileErr);
        }
      }

      res.status(201).json({
        message: 'Registered successfully',
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (err) {
      this.handleError(res, err);
    }
  };
  
  login = async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;
      // Pass role so LoginUser can enforce role separation
      const result = await this.loginUser.execute({ email, password, role });
      res.status(200).json(result);
    } catch (err) {
      this.handleError(res, err);
    }
  };
  
  delete = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id; 
      const result = await this.deleteUser.execute(userId);
      res.status(200).json(result);
    } catch (err) {
      this.handleError(res, err);
    }
  };
  
  update = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id; 
      const result = await this.updateProfile.execute(userId, req.body);
      res.status(200).json(result);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  parseCv = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No file uploaded' 
        });
      }

      // Get userId from JWT token (set by authMiddleware)
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      console.log('📄 Parsing CV for user:', userId);
      const cvData = await this.parseCvUseCase.execute(
        req.file.buffer, 
        req.file.mimetype
      );

      // ✅ CRITICAL FIX: Save parsed CV data to MongoDB immediately after parsing
      console.log('💾 Saving parsed CV data to MongoDB for user:', userId);
      await this.saveProfileUseCase.execute(userId, cvData);
      console.log('✅ CV data saved to MongoDB successfully');

      res.json({ 
        success: true, 
        data: cvData 
      });
    } catch (err: any) {
      console.error('CV Upload Error:', err.message, err.stack);
      return res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
      });
    }
  };

  saveCv = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { cvData } = req.body;

      if (!cvData) {
        return res.status(400).json({ 
          success: false, 
          error: 'cvData is required' 
        });
      }

      await this.saveProfileUseCase.execute(userId, cvData);

      res.json({ 
        success: true, 
        message: 'Profile saved successfully' 
      });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const profile = await this.getProfileUseCase.execute(userId);

      if (!profile) {
        return res.status(404).json({ 
          success: false, 
          error: 'Profile not found' 
        });
      }

      res.json({ 
        success: true, 
        data: profile 
      });
    } catch (err) {
      this.handleError(res, err);
    }
  };
  
  private handleError(res: Response, err: any) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message, code: err.code });
    } else {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  analyzeCv = async (req: Request, res: Response) => {
    try {
      const { cvData } = req.body;

      if (!cvData) {
        return res.status(400).json({ 
          success: false, 
          error: 'cvData is required' 
        });
      }

      const feedback = await this.analyzeCvUseCase.execute(cvData);

      res.json({ 
        success: true, 
        data: feedback 
      });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  saveCompanyProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      await this.saveCompanyProfileUseCase.execute(userId, req.body);
      res.json({ success: true, message: 'Company profile saved successfully' });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  getCompanyProfile = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const profile = await this.getCompanyProfileUseCase.execute(userId);
      if (!profile) {
        return res.status(404).json({ success: false, error: 'Company profile not found' });
      }
      res.json({ success: true, data: profile });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  saveJob = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const jobId = req.params.jobId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!jobId) return res.status(400).json({ error: 'Job ID is required' });
      await UserModel.findOneAndUpdate({ id: userId }, { $addToSet: { savedJobs: jobId } });
      res.json({ success: true, message: 'Job saved successfully' });
    } catch (err: any) {
      console.error('saveJob error:', err);
      res.status(500).json({ error: err.message });
    }
  };

  incrementProfileViews = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      await CandidateProfileModel.findOneAndUpdate(
        { userId },
        { $inc: { profileViews: 1 } }
      );
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const { currentPassword, newPassword } = req.body;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'currentPassword and newPassword are required' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }
      const user = await this.userRepository?.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash!);
      if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });
      const hash = await bcrypt.hash(newPassword, 10);
      await UserModel.findOneAndUpdate({ id: userId }, { passwordHash: hash });
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (err: any) {
      console.error('changePassword error:', err);
      res.status(500).json({ error: err.message });
    }
  };

  getNotificationPrefs = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const userDoc = await UserModel.findOne({ id: userId }).select('notificationPrefs').lean();
      const prefs = userDoc?.notificationPrefs || { jobMatches: true, applicationUpdates: true, messages: true };
      res.json(prefs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  saveNotificationPrefs = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });
      const { jobMatches, applicationUpdates, messages } = req.body;
      await UserModel.findOneAndUpdate(
        { id: userId },
        { $set: { notificationPrefs: { jobMatches, applicationUpdates, messages } } }
      );
      res.json({ success: true, message: 'Notification preferences saved' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  uploadProfilePicture = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Generate clean filename
      const ext = path.extname(req.file.originalname) || '.png';
      const filename = `profile-${userId}-${Date.now()}${ext}`;
      const destDir = path.join(__dirname, '../../../../../uploads');
      
      // Ensure folder exists
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const filePath = path.join(destDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);

      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.get('host');
      const url = `${protocol}://${host}/uploads/${filename}`;
      await UserModel.findOneAndUpdate({ id: userId }, { $set: { profilePicture: url } });

      res.json({ success: true, profilePicture: url });
    } catch (err: any) {
      console.error('uploadProfilePicture error:', err);
      res.status(500).json({ error: err.message });
    }
  };
}