// Vercel API route for token verification
const allowCors = require('../_utils/cors');
const { verifyToken } = require('../_utils/auth');

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const authResult = verifyToken(req);
    
    if (authResult.error) {
      return res.status(401).json({ message: authResult.error });
    }

    res.status(200).json({
      message: 'Token is valid',
      user: authResult.user
    });
  } catch (error) {
    console.error('Verify token API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = allowCors(handler);
