import db from '../models/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../middleware/auth.js';

// REGISTER
export const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(query, [username, hashedPassword], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.json({ success: true, message: 'User registered successfully' });
  });
};

// LOGIN
export const login = (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate Token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    
    res.json({ success: true, token, username: user.username });
  });
};

// GET MY UPLOADS (The "Dashboard" logic)
export const getMyUploads = (req, res) => {
    // This route MUST be protected
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    db.all(`SELECT * FROM uploads WHERE userId = ? ORDER BY createdAt DESC`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// DELETE MY UPLOAD
export const deleteMyUpload = (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;

    // Ensure I own this file before deleting
    db.run(`DELETE FROM uploads WHERE id = ? AND userId = ?`, [id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'File not found or access denied' });
        
        res.json({ success: true });
    });
};