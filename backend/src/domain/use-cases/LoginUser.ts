import { IUserRepository } from '../ports/secondary/IUserRepository';
import { AppError } from '../../shared/errors/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginInput {
  email: string;
  password: string;
  role?: string; // optional — if provided, must match stored role
}

interface LoginOutput {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
  };
}

export class LoginUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new AppError('Incorrect email or password', 'AUTH_FAILED', 401);
    }

    // ✅ BUG FIX: Role separation — if role provided, it must match
    if (input.role && user.role !== input.role) {
      console.log(`❌ Role mismatch: Expected ${input.role}, found ${user.role} for user ${user.email}`);
      throw new AppError(
        'Access denied. Invalid role for this account.',
        'ROLE_MISMATCH',
        403
      );
    }

    const isMatch = await bcrypt.compare(input.password, user.passwordHash!);
    if (!isMatch) {
      throw new AppError('Incorrect email or password', 'AUTH_FAILED', 401);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as any || '7d' }
    );

    return {
      token,
      user: { id: user.id!, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture }
    };
  }
}