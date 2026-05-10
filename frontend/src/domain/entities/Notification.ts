export interface Notification {
  id: string;
  userId: string;
  type: 'application_update' | 'message' | 'profile_view' | 'job_match' | 'interview_proposal';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}
