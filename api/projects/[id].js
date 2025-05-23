// Vercel API route for individual project operations
const allowCors = require('../_utils/cors');
const { readDatabase, writeDatabase } = require('../_utils/database');
const { verifyToken } = require('../_utils/auth');

async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    const db = await readDatabase();

    switch (method) {
      case 'GET':
        // Get project by ID
        const project = (db.projects || []).find(p => p.id === id);
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
        break;

      case 'PUT':
        // Update project (requires authentication)
        const authResult = verifyToken(req);
        if (authResult.error) {
          return res.status(401).json({ message: authResult.error });
        }

        const projectIndex = (db.projects || []).findIndex(p => p.id === id);
        if (projectIndex === -1) {
          return res.status(404).json({ message: 'Project not found' });
        }

        const updatedProject = {
          ...db.projects[projectIndex],
          ...req.body,
          id, // Ensure ID doesn't change
          updatedAt: new Date().toISOString()
        };

        db.projects[projectIndex] = updatedProject;
        
        const saved = await writeDatabase(db);
        if (!saved) {
          return res.status(500).json({ message: 'Failed to update project' });
        }

        res.status(200).json(updatedProject);
        break;

      case 'DELETE':
        // Delete project (requires authentication)
        const deleteAuthResult = verifyToken(req);
        if (deleteAuthResult.error) {
          return res.status(401).json({ message: deleteAuthResult.error });
        }

        const deleteIndex = (db.projects || []).findIndex(p => p.id === id);
        if (deleteIndex === -1) {
          return res.status(404).json({ message: 'Project not found' });
        }

        db.projects.splice(deleteIndex, 1);
        
        const deleteSaved = await writeDatabase(db);
        if (!deleteSaved) {
          return res.status(500).json({ message: 'Failed to delete project' });
        }

        res.status(200).json({ message: 'Project deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Project API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = allowCors(handler);
