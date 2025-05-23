// Consolidated Vercel API route for all authentication operations
const allowCors = require('../_utils/cors');
const jwt = require('jsonwebtoken');

// Mock user for demo purposes (replace with Firebase later)
const DEMO_USER = {
  id: '1',
  email: 'mukul.meena@iitgn.ac.in',
  password: 'g6QtckJh', // In production, this should be hashed
  role: 'admin'
};

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided' };
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { user: decoded };
  } catch (error) {
    return { error: 'Invalid token' };
  }
}

async function handler(req, res) {
  // Ensure JSON response
  res.setHeader('Content-Type', 'application/json');

  const { method, query } = req;
  const { action } = query;

  // Add debug logging
  console.log('Auth API called:', { method, query, action });

  try {
    if (method === 'POST' && (!action || action === 'login')) {
      // Login endpoint
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Check against demo user
      if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
      const token = jwt.sign(
        {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          role: DEMO_USER.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: DEMO_USER.id,
          email: DEMO_USER.email,
          role: DEMO_USER.role
        }
      });

    } else if (method === 'GET' && action === 'verify') {
      // Verify token endpoint
      const authResult = verifyToken(req);
      if (authResult.error) {
        return res.status(401).json({ message: authResult.error });
      }

      res.status(200).json({
        message: 'Token is valid',
        user: authResult.user
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Auth API error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = allowCors(handler);
