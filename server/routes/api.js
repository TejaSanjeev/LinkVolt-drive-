import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadContent, getContent, downloadFile } from '../controllers/uploadController.js';
import { register, login, getMyUploads, deleteMyUpload } from '../controllers/authController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// 1. Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// 2. Configure Filter (Strict Allowlist)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt', '.docx', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`));
  }
};

// 3. Configure Multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB Limit
    fileFilter: fileFilter
});

// 4. Helper Middleware
const uploadMiddleware = (req, res, next) => {
    const uploadSingle = upload.single('file');

    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File is too large. Max limit is 5MB.' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

// ==========================
//        AUTH ROUTES
// ==========================
router.post('/auth/register', register);
router.post('/auth/login', login);

// 🆕 NEW: Verify Token Route
router.get('/auth/verify', authenticateToken, (req, res) => {
  // If we reach here, the middleware has already verified the token
  if (req.user) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

router.get('/user/uploads', authenticateToken, getMyUploads);
router.delete('/user/files/:id', authenticateToken, deleteMyUpload);

// ==========================
//       PUBLIC ROUTES
// ==========================
// Add authenticateToken so we can track WHO uploaded the file (optional auth)
router.post('/upload', authenticateToken, uploadMiddleware, uploadContent);

router.get('/:id', getContent);
router.post('/:id/verify', getContent);
router.get('/file/download/:filename', downloadFile);

export default router;