// Vercel API route for global image settings
const allowCors = require('../_utils/cors');
const jwt = require('jsonwebtoken');

// Mock settings data
let mockSettings = {
  defaultThumbnailSettings: {
    aspectRatio: '4:3',
    fitBehavior: 'cover',
    width: 300,
    height: 225,
    scale: 100,
    lockAspectRatio: true
  },
  defaultHeroSettings: {
    aspectRatio: '16:9',
    fitBehavior: 'cover',
    width: 800,
    height: 450,
    scale: 100,
    lockAspectRatio: true
  },
  defaultGallerySettings: {
    aspectRatio: 'original',
    fitBehavior: 'contain',
    width: 600,
    height: 400,
    scale: 100,
    lockAspectRatio: true
  },
  responsiveBreakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1200
  }
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
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get global image settings
        res.status(200).json(mockSettings);
        break;

      case 'PUT':
        // Update global image settings (requires authentication)
        const authResult = verifyToken(req);
        if (authResult.error) {
          return res.status(401).json({ message: authResult.error });
        }

        mockSettings = {
          ...mockSettings,
          ...req.body,
          updatedAt: new Date().toISOString()
        };
        res.status(200).json(mockSettings);
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Settings API error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = allowCors(handler);
