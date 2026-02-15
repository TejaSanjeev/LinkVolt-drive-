import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadContent, getContent, downloadFile } from '../controllers/uploadController.js';
import { register, login, getMyUploads, deleteMyUpload } from '../controllers/authController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// 1. CHANGE: Use Memory Storage
// We don't save to 'uploads/' anymore. We keep the file in RAM 
// so we can send it directly to Supabase.
const storage = multer.memoryStorage();

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

// 4. Helper Middleware to catch Multer errors
const uploadMiddleware = (req, res, next) => {
    const uploadSingle = upload.single('file');

    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred (e.g. File too large)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File is too large. Max limit is 5MB.' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            // An error from our fileFilter occurred
            return res.status(400).json({ error: err.message });
        }
        // Everything went fine
        next();
    });
};

// ==========================
//        AUTH ROUTES
// ==========================
router.post('/auth/register', register);
router.post('/auth/login', login);

// Verify Token Route (Checks if user is still logged in)
router.get('/auth/verify', authenticateToken, (req, res) => {
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
// Upload Route (Uses memoryStorage now)
router.post('/upload', authenticateToken, uploadMiddleware, uploadContent);

router.get('/:id', getContent);
router.post('/:id/verify', getContent);

// Download Route (Will redirect to Supabase URL)
router.get('/file/download/:filename', downloadFile);

export default router;