import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import { MongooseUserRepository } from './adapters/secondary/db/MongooseUserRepository';
import { RegisterUser } from './domain/use-cases/RegisterUser';
import { UserController } from './adapters/primary/rest/controllers/UserController';
import { createUserRoutes } from './adapters/primary/rest/routes/UserRoutes';
import { LoginUser } from './domain/use-cases/LoginUser';
import { DeleteUser } from './domain/use-cases/DeleteUser';
import { UpdateProfile } from './domain/use-cases/UpdateProfile';
import { ParseCvUseCase } from './domain/use-cases/ParseCvUseCase';
import { SaveProfileUseCase } from './domain/use-cases/SaveProfileUseCase';
import { GetProfileUseCase } from './domain/use-cases/GetProfileUseCase';
import { OpenRouterService } from './adapters/secondary/ai/OpenAIService';
import { AnalyzeCvUseCase } from './domain/use-cases/AnalyzeCvUseCase';
import { SaveCompanyProfileUseCase } from './domain/use-cases/SaveCompanyProfileUseCase';
import { GetCompanyProfileUseCase } from './domain/use-cases/GetCompanyProfileUseCase';
import { JobRepository } from './adapters/secondary/db/JobRepository';
import { ApplicationRepository } from './adapters/secondary/db/ApplicationRepository';
import { MessageRepository } from './adapters/secondary/db/MessageRepository';
import { JobController } from './adapters/primary/rest/controllers/IJobController';
import { MessageController } from './adapters/primary/rest/controllers/MessageController';
import { JobRoutes } from './adapters/primary/rest/routes/JobRoutes';
import { ApplicationController } from './adapters/primary/rest/controllers/ApplicationController';
import { ApplicationRoutes } from './adapters/primary/rest/routes/ApplicationRoutes';
import { MessageRoutes } from './adapters/primary/rest/routes/MessageRoutes';
import { NotificationRepository } from './adapters/secondary/db/NotificationRepository';
import { NotificationService } from './domain/services/NotificationService';
import { NotificationController } from './adapters/primary/rest/controllers/NotificationController';
import { NotificationRoutes } from './adapters/primary/rest/routes/NotificationRoutes';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT || 5001;

// Define allowed origins for both Local and Production
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://talent-ai-plum.vercel.app'
];

const app = express();
const httpServer = http.createServer(app);

// Use allowedOrigins in Socket.io
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS']
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('join', (userId: string) => {
    if (userId) {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Use allowedOrigins in Express CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Expose uploads directory statically
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ✅ DEBUG MIDDLEWARE: Log all requests to find the 403/502 source
app.use((req, res, next) => {
  console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  const oldJson = res.json;
  res.json = function (data) {
    console.log(`📤 Response [${res.statusCode}]:`, JSON.stringify(data).substring(0, 100));
    return oldJson.call(this, data);
  };
  next();
});

// ============ USER SETUP ============
const userRepository = new MongooseUserRepository();
const aiService = new OpenRouterService();

const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);
const deleteUser = new DeleteUser(userRepository);
const updateProfile = new UpdateProfile(userRepository);
const parseCvUseCase = new ParseCvUseCase(aiService);
const saveProfileUseCase = new SaveProfileUseCase(userRepository);
const getProfileUseCase = new GetProfileUseCase(userRepository);
const analyzeCvUseCase = new AnalyzeCvUseCase(aiService);
const saveCompanyProfileUseCase = new SaveCompanyProfileUseCase(userRepository);
const getCompanyProfileUseCase = new GetCompanyProfileUseCase(userRepository);

const userController = new UserController(
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
  userRepository
);

// ============ JOB & APPLICATION SETUP ============
const jobRepository = new JobRepository();
const applicationRepository = new ApplicationRepository();
const messageRepository = new MessageRepository();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository, io);
const notificationController = new NotificationController(notificationRepository);
const jobController = new JobController(jobRepository, userRepository, applicationRepository, aiService, notificationService);
const applicationController = new ApplicationController(applicationRepository, jobRepository, userRepository, notificationService);
const messageController = new MessageController(messageRepository, io, notificationService);

// ============ ROUTES ============
app.use('/api/users', createUserRoutes(userController));
app.use('/api', JobRoutes(jobController));
app.use('/api', ApplicationRoutes(applicationController));
app.use('/api', MessageRoutes(messageController));
app.use('/api', NotificationRoutes(notificationController));

// ============ START SERVER ============
if (!mongoUri) {
  console.error('❌ MONGO_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected');
    httpServer.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📡 CORS allowed for: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch((err) => console.error('❌ DB connection error:', err));