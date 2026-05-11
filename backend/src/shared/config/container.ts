// shared/config/container.ts
import { OpenRouterService } from '../../adapters/secondary/ai/OpenAIService';
import { MongooseUserRepository } from '../../adapters/secondary/db/MongooseUserRepository';
import { ParseCvUseCase } from '../../domain/use-cases/ParseCvUseCase';
import { SaveProfileUseCase } from '../../domain/use-cases/SaveProfileUseCase';
import { GetProfileUseCase } from '../../domain/use-cases/GetProfileUseCase';
import { RegisterUser } from '../../domain/use-cases/RegisterUser';
import { LoginUser } from '../../domain/use-cases/LoginUser';
import { UpdateProfile } from '../../domain/use-cases/UpdateProfile';
import { DeleteUser } from '../../domain/use-cases/DeleteUser';
import { AnalyzeCvUseCase } from '../../domain/use-cases/AnalyzeCvUseCase';
import { SaveCompanyProfileUseCase } from '../../domain/use-cases/SaveCompanyProfileUseCase';
import { GetCompanyProfileUseCase } from '../../domain/use-cases/GetCompanyProfileUseCase';
import { UserController } from '../../adapters/primary/rest/controllers/UserController';

// Adapters
const aiService = new OpenRouterService();
const userRepository = new MongooseUserRepository();

// Use cases
const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);
const updateProfile = new UpdateProfile(userRepository);
const deleteUser = new DeleteUser(userRepository);
const parseCvUseCase = new ParseCvUseCase(aiService);
const saveProfileUseCase = new SaveProfileUseCase(userRepository);
const getProfileUseCase = new GetProfileUseCase(userRepository);
const analyzeCvUseCase = new AnalyzeCvUseCase(aiService);
const saveCompanyProfileUseCase = new SaveCompanyProfileUseCase(userRepository);
const getCompanyProfileUseCase = new GetCompanyProfileUseCase(userRepository);

// Controller with all 10 dependencies
export const userController = new UserController(
  registerUser,
  loginUser,
  updateProfile,
  deleteUser,
  parseCvUseCase,
  saveProfileUseCase,
  getProfileUseCase,
  analyzeCvUseCase,
  saveCompanyProfileUseCase,
  getCompanyProfileUseCase,
);