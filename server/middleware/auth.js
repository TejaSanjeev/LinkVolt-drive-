import jwt from 'jsonwebtoken';

const SECRET_KEY = 'supersecretkey'; 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
      return res.sendStatus(401); 
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
        console.error("Token Verification Error:", err.message);
        return res.sendStatus(403); 
    }

    
    req.user = user;
    next(); 
  });
};

export default authenticateToken;