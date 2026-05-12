import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../auth/authMiddleware';
import multer from 'multer';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF allowed.'));
    }
  }
});

export function createUserRoutes(ctrl: UserController): Router {
  const router = Router();
  
  // Auth routes
  router.post('/register', ctrl.register);
  router.post('/login', ctrl.login);  
  
  // Profile routes
  router.put('/profile', authMiddleware, ctrl.update);
  router.delete('/profile', authMiddleware, ctrl.delete);
  
  // ⭐ CV routes
  router.post('/cv/upload', authMiddleware, upload.single('cv'), ctrl.parseCv);
  router.post('/cv/save', authMiddleware, ctrl.saveCv);
  router.get('/cv/profile', authMiddleware, ctrl.getProfile);
  router.post('/cv/analyze', authMiddleware, ctrl.analyzeCv); 

  // Company profile routes
  router.post('/company/profile', authMiddleware, ctrl.saveCompanyProfile);
  router.get('/company/profile', authMiddleware, ctrl.getCompanyProfile);

  // Saved jobs
  router.post('/saved-jobs/:jobId', authMiddleware, ctrl.saveJob);

  // Profile view tracking (BUG 8)
  router.post('/profile-view/:userId', authMiddleware, ctrl.incrementProfileViews);

  // Password change (BUG 10)
  router.post('/change-password', authMiddleware, ctrl.changePassword);

  // Notification preferences
  router.get('/notification-prefs', authMiddleware, ctrl.getNotificationPrefs);
  router.put('/notification-prefs', authMiddleware, ctrl.saveNotificationPrefs);

  // Profile picture upload
  router.post('/profile-picture', authMiddleware, upload.single('profilePicture'), ctrl.uploadProfilePicture);

  return router;
}