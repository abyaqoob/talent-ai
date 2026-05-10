import { IUserRepository } from '../ports/secondary/IUserRepository';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../shared/errors/AppError';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'candidate' | 'recruiter';
}

export class RegisterUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: RegisterInput): Promise<User> {
    const taken = await this.userRepo.exists(input.email);
    if (taken) {
      throw new AppError('Email already in use', 'DUPLICATE_EMAIL', 409);
    }
    const passwordHash = await bcrypt.hash(input.password, 10);

    const newUser: User = {
      id: uuidv4(),
      name: input.name,
      email: input.email,
      passwordHash:passwordHash,
      role: input.role,
      createdAt: new Date(),
    };

    return this.userRepo.save(newUser);
  }
}