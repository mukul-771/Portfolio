// Vercel API route for projects
const allowCors = require('../_utils/cors');
const { readDatabase, writeDatabase } = require('../_utils/database');
const { verifyToken } = require('../_utils/auth');

async function handler(req, res) {
  const { method } = req;

  try {
    const db = await readDatabase();

    switch (method) {
      case 'GET':
        // Get all projects
        res.status(200).json(db.projects || []);
        break;

      case 'POST':
        // Create new project (requires authentication)
        const authResult = verifyToken(req);
        if (authResult.error) {
          return res.status(401).json({ message: authResult.error });
        }

        const newProject = {
          ...req.body,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        db.projects = db.projects || [];
        db.projects.push(newProject);
        
        const saved = await writeDatabase(db);
        if (!saved) {
          return res.status(500).json({ message: 'Failed to save project' });
        }

        res.status(201).json(newProject);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Projects API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = allowCors(handler);
