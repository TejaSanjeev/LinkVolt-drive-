import jwt from 'jsonwebtoken';

const SECRET_KEY = 'super-secret-key-change-this-later'; // Keep simple for now

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // No token? That's fine, just proceed without a user (Guest mode)
    // OR return 401 if strict auth is needed. 
    // For Uploads, we want optional auth (Guests can still upload).
    req.user = null; 
    return next();
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      // Invalid token
      req.user = null; 
    } else {
      // Valid token! Attach user info to request
      req.user = user;
    }
    next();
  });
};

export default authenticateToken;
export { SECRET_KEY };