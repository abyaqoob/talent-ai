import { IAuthRepository, LoginCredentials, AuthSession } from '../../../domain/repositories/IAuthRepository';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthSession> {
    // Validate credentials
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Authenticate user
    const session = await this.authRepository.login(credentials);

    return session;
  }
}
