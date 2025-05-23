// Consolidated Vercel API route for all authentication operations
const allowCors = require('../_utils/cors');
const { userOperations } = require('../_utils/database');
const { verifyToken } = require('../_utils/auth');
const jwt = require('jsonwebtoken');

async function handler(req, res) {
  const { method, query } = req;
  const { action } = query;

  try {
    if (method === 'POST' && (!action || action === 'login')) {
      // Login endpoint
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await userOperations.getByEmail(email);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await userOperations.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
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
