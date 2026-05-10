import { IAuthRepository, RegisterData, AuthSession } from '../../../domain/repositories/IAuthRepository';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<AuthSession> {
    // Validate data
    if (!data.email || !data.password || !data.name) {
      throw new Error('Name, email, and password are required');
    }

    if (!data.role) {
      throw new Error('Role selection is required');
    }

    // Register user
    const session = await this.authRepository.register(data);

    return session;
  }
}
