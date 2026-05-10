// Infrastructure
import { InMemoryAuthRepository } from '../repositories/InMemoryAuthRepository';
import { InMemoryJobRepository } from '../repositories/InMemoryJobRepository';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { InMemoryMessageRepository } from '../repositories/InMemoryMessageRepository';
import { InMemoryNotificationRepository } from '../repositories/InMemoryNotificationRepository';

// Auth Use Cases
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { LogoutUseCase } from '../../application/use-cases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../application/use-cases/auth/GetCurrentUserUseCase';

// Job Use Cases
import { GetAllJobsUseCase } from '../../application/use-cases/jobs/GetAllJobsUseCase';
import { GetJobByIdUseCase } from '../../application/use-cases/jobs/GetJobByIdUseCase';
import { GetMatchingJobsUseCase } from '../../application/use-cases/jobs/GetMatchingJobsUseCase';
import { CreateJobUseCase } from '../../application/use-cases/jobs/CreateJobUseCase';

// Application Use Cases
import { GetCandidateApplicationsUseCase } from '../../application/use-cases/applications/GetCandidateApplicationsUseCase';
import { ApplyToJobUseCase } from '../../application/use-cases/applications/ApplyToJobUseCase';
import { UpdateApplicationStatusUseCase } from '../../application/use-cases/applications/UpdateApplicationStatusUseCase';

// Profile Use Cases
import { GetUserProfileUseCase } from '../../application/use-cases/profile/GetUserProfileUseCase';

// Message Use Cases
import { GetUserMessagesUseCase } from '../../application/use-cases/messages/GetUserMessagesUseCase';

// Notification Use Cases
import { GetUserNotificationsUseCase } from '../../application/use-cases/notifications/GetUserNotificationsUseCase';

/**
 * Dependency Injection Container
 * Creates and manages all use case instances with their dependencies
 */
export class Container {
  // Repositories (singletons)
  private static authRepository = new InMemoryAuthRepository();
  private static jobRepository = new InMemoryJobRepository();
  private static userRepository = new InMemoryUserRepository();
  private static messageRepository = new InMemoryMessageRepository();
  private static notificationRepository = new InMemoryNotificationRepository();

  // Auth Use Cases
  static getLoginUseCase(): LoginUseCase {
    return new LoginUseCase(this.authRepository);
  }

  static getRegisterUseCase(): RegisterUseCase {
    return new RegisterUseCase(this.authRepository);
  }

  static getLogoutUseCase(): LogoutUseCase {
    return new LogoutUseCase(this.authRepository);
  }

  static getCurrentUserUseCase(): GetCurrentUserUseCase {
    return new GetCurrentUserUseCase(this.authRepository);
  }

  // Job Use Cases
  static getGetAllJobsUseCase(): GetAllJobsUseCase {
    return new GetAllJobsUseCase(this.jobRepository);
  }

  static getGetJobByIdUseCase(): GetJobByIdUseCase {
    return new GetJobByIdUseCase(this.jobRepository);
  }

  static getGetMatchingJobsUseCase(): GetMatchingJobsUseCase {
    return new GetMatchingJobsUseCase(this.jobRepository);
  }

  static getCreateJobUseCase(): CreateJobUseCase {
    return new CreateJobUseCase(this.jobRepository);
  }

  // Application Use Cases
  static getGetCandidateApplicationsUseCase(): GetCandidateApplicationsUseCase {
    return new GetCandidateApplicationsUseCase(this.jobRepository);
  }

  static getApplyToJobUseCase(): ApplyToJobUseCase {
    return new ApplyToJobUseCase(this.jobRepository);
  }

  static getUpdateApplicationStatusUseCase(): UpdateApplicationStatusUseCase {
    return new UpdateApplicationStatusUseCase(this.jobRepository);
  }

  // Profile Use Cases
  static getGetUserProfileUseCase(): GetUserProfileUseCase {
    return new GetUserProfileUseCase(this.userRepository);
  }

  // Message Use Cases
  static getGetUserMessagesUseCase(): GetUserMessagesUseCase {
    return new GetUserMessagesUseCase(this.messageRepository);
  }

  // Notification Use Cases
  static getGetUserNotificationsUseCase(): GetUserNotificationsUseCase {
    return new GetUserNotificationsUseCase(this.notificationRepository);
  }
}
