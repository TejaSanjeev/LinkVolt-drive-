import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/db.js';
import generateUniqueId from '../utils/generateId.js';
import { supabase } from '../supabaseClient.js'; // 1. Import Supabase

const SECRET_KEY = 'supersecretkey'; // In production, use process.env.SECRET_KEY

// ==========================
// REGISTER USER
// ==========================
export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ error: 'Missing fields' });
  }
  if (password.length < 6) {
      return res.status(400).json({ error: 'Password too short' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = generateUniqueId();

  db.run(`INSERT INTO users (id, username, password) VALUES (?, ?, ?)`, 
    [id, username, hashedPassword], 
    function(err) {
      if (err) {
          return res.status(400).json({ error: 'Username already exists' });
      }
      res.json({ success: true });
    }
  );
};

// ==========================
// LOGIN USER
// ==========================
export const login = (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) {
        return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, token, username });
  });
};

// ==========================
// GET USER UPLOADS (DASHBOARD)
// ==========================
export const getMyUploads = (req, res) => {
  const userId = req.user.id;
  
  db.all(`SELECT * FROM uploads WHERE userId = ? ORDER BY createdAt DESC`, [userId], (err, rows) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// ==========================
// DELETE UPLOAD (FIXED BUG)
// ==========================
export const deleteMyUpload = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // 1. First, find the file to get its details (like filename/content)
  db.get(`SELECT * FROM uploads WHERE id = ? AND userId = ?`, [id, userId], async (err, row) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    if (!row) {
        return res.status(404).json({ error: 'File not found or unauthorized' });
    }

    // 2. If it is a FILE, delete it from Supabase Cloud Storage first
    if (row.type === 'file') {
        const { error } = await supabase
            .storage
            .from('uploads')
            .remove([row.content]); // 'content' column stores the filename

        if (error) {
            console.error("Supabase Delete Error:", error);
            // We continue deleting the DB record even if Supabase fails, 
            // so the user doesn't see a "stuck" file in their dashboard.
        } else {
            console.log(`✅ Manually deleted from Supabase: ${row.content}`);
        }
    }

    // 3. Delete the record from SQLite Database
    db.run(`DELETE FROM uploads WHERE id = ?`, [id], (err) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    });
  });
};