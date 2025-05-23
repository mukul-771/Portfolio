// Vercel API route for global image settings
const allowCors = require('../_utils/cors');
const { readDatabase, writeDatabase } = require('../_utils/database');
const { verifyToken } = require('../_utils/auth');

async function handler(req, res) {
  const { method } = req;

  try {
    const db = await readDatabase();

    switch (method) {
      case 'GET':
        // Get global image settings
        const settings = db.globalImageSettings || {};
        res.status(200).json(settings);
        break;

      case 'PUT':
        // Update global image settings (requires authentication)
        const authResult = verifyToken(req);
        if (authResult.error) {
          return res.status(401).json({ message: authResult.error });
        }

        db.globalImageSettings = {
          ...db.globalImageSettings,
          ...req.body
        };

        const saved = await writeDatabase(db);
        if (!saved) {
          return res.status(500).json({ message: 'Failed to update settings' });
        }

        res.status(200).json(db.globalImageSettings);
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Settings API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = allowCors(handler);
