// Vercel API route for projects using Firebase
const allowCors = require('../_utils/cors');
const { projectOperations } = require('../_utils/database');
const { verifyToken } = require('../_utils/auth');

async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get all projects
        const projects = await projectOperations.getAll();
        res.status(200).json(projects);
        break;

      case 'POST':
        // Create new project (requires authentication)
        const authResult = verifyToken(req);
        if (authResult.error) {
          return res.status(401).json({ message: authResult.error });
        }

        const newProject = await projectOperations.create(req.body);
        res.status(201).json(newProject);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Projects API error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = allowCors(handler);
