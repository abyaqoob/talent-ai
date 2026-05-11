import { Request, Response } from 'express';
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
    private getCompanyProfileUseCase: GetCompanyProfileUseCase
  ) {}

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, companyName, companySize, industry, website } = req.body;

      // Validate role
      if (!role || !['candidate', 'recruiter'].includes(role)) {
        return res.status(400).json({ error: 'Role must be either candidate or recruiter' });
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
          message: 'Upload failed',
          error: 'No file uploaded' 
        });
      }

      const cvData = await this.parseCvUseCase.execute(
        req.file.buffer, 
        req.file.mimetype
      );

      res.json({ 
        success: true, 
        data: cvData 
      });
    } catch (err: any) {
      console.error('CV Upload Error:', err);
      return res.status(500).json({
        message: 'Upload failed',
        error: err.message || 'Internal server error'
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
      const userId = (req as any).user.id;
      const jobId = req.params.jobId;
      if (!jobId) return res.status(400).json({ error: 'Job ID is required' });
      
      const { UserModel } = require('../../secondary/db/UserSchema');
      await UserModel.findOneAndUpdate(
        { id: userId },
        { $addToSet: { savedJobs: jobId } }
      );
      
      res.json({ success: true, message: 'Job saved successfully' });
    } catch (err) {
      this.handleError(res, err);
    }
  };
}