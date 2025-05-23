// Authentication utility for Vercel serverless functions
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Verify JWT token
const verifyToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Unauthorized - No token provided' };
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return { error: 'Unauthorized - Invalid token format' };
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    return { user: decoded };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { error: 'Unauthorized - Invalid token' };
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  verifyToken,
  generateToken,
  JWT_SECRET
};
