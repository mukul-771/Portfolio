// Vercel API route for global image settings using Firebase
const allowCors = require('../_utils/cors');
const { globalSettingsOperations } = require('../_utils/database');
const { verifyToken } = require('../_utils/auth');

async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get global image settings
        const settings = await globalSettingsOperations.getImageSettings();
        res.status(200).json(settings);
        break;

      case 'PUT':
        // Update global image settings (requires authentication)
        const authResult = verifyToken(req);
        if (authResult.error) {
          return res.status(401).json({ message: authResult.error });
        }

        const updatedSettings = await globalSettingsOperations.updateImageSettings(req.body);
        res.status(200).json(updatedSettings);
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
