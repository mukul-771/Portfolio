// Vercel API route for individual project operations using Firebase
const allowCors = require('../_utils/cors');
const { projectOperations } = require('../_utils/database');
const { verifyToken } = require('../_utils/auth');

async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    switch (method) {
      case 'GET':
        // Get project by ID
        const project = await projectOperations.getById(id);
        res.status(200).json(project);
        break;

      case 'PUT':
        // Update project (requires authentication)
        const authResult = verifyToken(req);
        if (authResult.error) {
          return res.status(401).json({ message: authResult.error });
        }

        const updatedProject = await projectOperations.update(id, req.body);
        res.status(200).json(updatedProject);
        break;

      case 'DELETE':
        // Delete project (requires authentication)
        const deleteAuthResult = verifyToken(req);
        if (deleteAuthResult.error) {
          return res.status(401).json({ message: deleteAuthResult.error });
        }

        await projectOperations.delete(id);
        res.status(200).json({ message: 'Project deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Project API error:', error);
    if (error.message === 'Project not found') {
      res.status(404).json({ message: 'Project not found' });
    } else {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }
}

module.exports = allowCors(handler);
