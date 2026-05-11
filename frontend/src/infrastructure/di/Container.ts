// Infrastructure — API-backed repositories
import { ApiAuthRepository } from '../repositories/ApiAuthRepository';
import { ApiJobRepository } from '../repositories/ApiJobRepository';
import { ApiJobApplicationRepository } from '../repositories/ApiJobApplicationRepository';
import { ApiUserRepository } from '../repositories/ApiUserRepository';
import { ApiMessageRepository } from '../repositories/ApiMessageRepository';
import { ApiNotificationRepository } from '../repositories/ApiNotificationRepository';

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
 * All repositories now backed by real API calls (no more in-memory mocks).
 * Job and JobApplication use separate repositories to avoid interface conflicts.
 */
export class Container {
  // Repositories (singletons)
  private static authRepository = new ApiAuthRepository();
  private static jobRepository = new ApiJobRepository();
  private static jobApplicationRepository = new ApiJobApplicationRepository();
  private static userRepository = new ApiUserRepository();
  private static messageRepository = new ApiMessageRepository();
  private static notificationRepository = new ApiNotificationRepository();

  // ── Auth ──────────────────────────────────────────────────────────────────
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

  // ── Jobs ──────────────────────────────────────────────────────────────────
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

  // ── Applications ──────────────────────────────────────────────────────────
  static getGetCandidateApplicationsUseCase(): GetCandidateApplicationsUseCase {
    return new GetCandidateApplicationsUseCase(this.jobApplicationRepository);
  }

  static getApplyToJobUseCase(): ApplyToJobUseCase {
    return new ApplyToJobUseCase(this.jobApplicationRepository);
  }

  static getUpdateApplicationStatusUseCase(): UpdateApplicationStatusUseCase {
    return new UpdateApplicationStatusUseCase(this.jobApplicationRepository);
  }

  // ── Profile ───────────────────────────────────────────────────────────────
  static getGetUserProfileUseCase(): GetUserProfileUseCase {
    return new GetUserProfileUseCase(this.userRepository);
  }

  // ── Expose userRepository for direct use in pages ─────────────────────────
  static getUserRepository(): ApiUserRepository {
    return this.userRepository;
  }

  // ── Expose jobApplicationRepository for recruiter pages ───────────────────
  static getJobApplicationRepository(): ApiJobApplicationRepository {
    return this.jobApplicationRepository;
  }

  // ── Expose jobRepository for recruiter pages ──────────────────────────────
  static getJobRepository(): ApiJobRepository {
    return this.jobRepository;
  }

  // ── Messages ──────────────────────────────────────────────────────────────
  static getGetUserMessagesUseCase(): GetUserMessagesUseCase {
    return new GetUserMessagesUseCase(this.messageRepository);
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  static getGetUserNotificationsUseCase(): GetUserNotificationsUseCase {
    return new GetUserNotificationsUseCase(this.notificationRepository);
  }

  static getNotificationRepository(): ApiNotificationRepository {
    return this.notificationRepository;
  }
}
