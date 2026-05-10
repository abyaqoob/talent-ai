import { Code, Palette, Rocket, FlaskConical, Zap, Cloud } from 'lucide-react';
import { Job } from '../../domain/entities/Job';
import { User, Candidate, Recruiter } from '../../domain/entities/User';
import { Message } from '../../domain/entities/Message';
import { Notification } from '../../domain/entities/Notification';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Ali Johnson',
    email: 'ali.johnson@example.com',
    role: 'candidate',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'user-2',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'recruiter',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    createdAt: new Date('2025-12-15'),
  },
];

// Mock Candidates
export const mockCandidates: Candidate[] = [
  {
    id: 'user-1',
    name: 'Ali Johnson',
    email: 'ali.johnson@example.com',
    role: 'candidate',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    createdAt: new Date('2026-01-01'),
    title: 'Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
    experience: [
      {
        id: 'exp-1',
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        startDate: new Date('2024-01-01'),
        current: true,
        description: 'Building scalable web applications',
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science',
        institution: 'Stanford University',
        field: 'Computer Science',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-01'),
        current: false,
      },
    ],
    profileCompleteness: 87,
  },
];

// Mock Recruiters
export const mockRecruiters: Recruiter[] = [
  {
    id: 'user-2',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'recruiter',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    createdAt: new Date('2025-12-15'),
    company: 'TechCorp Inc.',
    companySize: '100-500 employees',
    industry: 'Technology',
    website: 'https://techcorp.com',
  },
];

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    icon: Code,
    location: 'Remote',
    type: 'Full-Time',
    experience: 'Senior',
    salary: '$120k - $180k',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    description: 'We are looking for an experienced frontend developer...',
    requirements: ['5+ years React experience', 'TypeScript proficiency'],
    responsibilities: ['Build UI components', 'Code reviews'],
    benefits: ['Health insurance', 'Remote work', '401k matching'],
    postedDate: new Date('2026-04-19'),
    recruiterId: 'user-2',
    isActive: true,
    matchScore: 92,
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Design Studio',
    icon: Palette,
    location: 'New York, NY',
    type: 'Full-Time',
    experience: 'Mid',
    salary: '$100k - $140k',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    description: 'Join our design team...',
    requirements: ['3+ years design experience', 'Figma expertise'],
    responsibilities: ['Create designs', 'User research'],
    benefits: ['Health insurance', 'Stock options'],
    postedDate: new Date('2026-04-14'),
    recruiterId: 'user-2',
    isActive: true,
    matchScore: 88,
  },
  {
    id: '3',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    icon: Rocket,
    location: 'San Francisco, CA',
    type: 'Full-Time',
    experience: 'Senior',
    salary: '$130k - $170k',
    skills: ['Node.js', 'React', 'MongoDB'],
    description: 'Build the next generation platform...',
    requirements: ['Full stack experience', 'Startup mindset'],
    responsibilities: ['Full stack development', 'Architecture decisions'],
    benefits: ['Equity', 'Unlimited PTO'],
    postedDate: new Date('2026-04-18'),
    recruiterId: 'user-2',
    isActive: true,
    matchScore: 85,
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    jobId: '1',
    subject: 'Interview Invitation - Senior Frontend Developer',
    content: 'We would like to invite you for an interview...',
    timestamp: new Date('2026-04-21T10:00:00'),
    read: false,
    hasProposal: true,
    proposalSlots: [
      { id: 'slot-1', day: 'Mon Mar 18', time: '10:00 AM', duration: 45 },
      { id: 'slot-2', day: 'Wed Mar 20', time: '2:00 PM', duration: 45 },
    ],
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'application_update',
    title: 'Application Updated',
    message: 'Your application for Senior Frontend Developer has been reviewed',
    timestamp: new Date('2026-04-21T09:00:00'),
    read: false,
    actionUrl: '/applications',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'job_match',
    title: 'New Job Match',
    message: 'We found 5 new jobs matching your profile',
    timestamp: new Date('2026-04-20T14:00:00'),
    read: false,
    actionUrl: '/jobs',
  },
];
