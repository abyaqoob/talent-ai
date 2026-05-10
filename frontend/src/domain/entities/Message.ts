export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  jobId?: string;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  hasProposal: boolean;
  proposalSlots?: InterviewSlot[];
}

export interface InterviewSlot {
  id: string;
  day: string;
  time: string;
  duration: number;
  notes?: string;
}
