// Vercel API route for project image uploads (mock for demo)
const allowCors = require('../_utils/cors');
const jwt = require('jsonwebtoken');

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
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Verify authentication
    const authResult = verifyToken(req);
    if (authResult.error) {
      return res.status(401).json({ message: authResult.error });
    }

    // Mock upload response - in production this would handle actual file upload
    const mockImageUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Uploaded+Image+${Date.now()}`;

    res.status(200).json({
      success: true,
      imageUrl: mockImageUrl,
      message: 'Image uploaded successfully (mock)'
    });
  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
}

module.exports = allowCors(handler);
