const jwt = require('jsonwebtoken');
const { userService } = require('../services/jsonDataService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await userService.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    // The auth middleware already verified the token
    // Just return the user data
    res.json({
      user: {
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


