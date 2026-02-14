import db from '../models/db.js';
import generateUniqueId from '../utils/generateId.js';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadContent = async (req, res) => {
  // 1. Extract Data
  const { text, expiry, maxViews, password } = req.body;
  const file = req.file;
  
  // 2. Capture User ID (from Auth Middleware)
  // If req.user exists, use the ID. If not, store NULL (Guest upload).
  const userId = req.user ? req.user.id : null;

  // 3. Basic Validation
  if ((!text && !file) || (text && file)) {
    return res.status(400).json({ error: 'Please upload either a file or text.' });
  }

  const id = generateUniqueId();
  const type = file ? 'file' : 'text';
  const content = file ? file.filename : text;
  const originalName = file ? file.originalname : null;
  const expiryMinutes = expiry ? parseInt(expiry) : 10;
  const expiresAt = new Date(Date.now() + expiryMinutes * 60000).toISOString();
  const limitViews = maxViews ? parseInt(maxViews) : null;
  
  // 4. Password Hashing
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // 5. Insert into Database (Includes userId)
  const query = `INSERT INTO uploads (id, type, content, originalName, expiresAt, maxViews, password, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [id, type, content, originalName, expiresAt, limitViews, hashedPassword, userId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, linkId: id });
  });
};

export const getContent = (req, res) => {
  const { id } = req.params;
  
  // Handle case where body is undefined (GET requests)
  const { password } = req.body || {}; 

  db.get(`SELECT * FROM uploads WHERE id = ?`, [id], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Link not found.' });

    // Check Expiry
    if (new Date(row.expiresAt) < new Date()) {
        return res.status(410).json({ error: 'This link has expired.' });
    }

    // Check View Limit
    if (row.maxViews !== null && row.views >= row.maxViews) {
        return res.status(410).json({ error: 'Max views reached.' });
    }

    // Check Password Protection
    if (row.password) {
        if (!password) {
            return res.json({ protected: true, id: row.id });
        }
        const isMatch = await bcrypt.compare(password, row.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
    }

    // Increment View Count
    db.run(`UPDATE uploads SET views = views + 1 WHERE id = ?`, [id]);

    // Return Content
    if (row.type === 'text') {
      res.json({ type: 'text', content: row.content });
    } else {
      res.json({ 
        type: 'file', 
        filename: row.content, 
        originalName: row.originalName 
      });
    }
  });
};

export const downloadFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
};