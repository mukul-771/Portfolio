// Consolidated Vercel API route for all project operations
const allowCors = require('../_utils/cors');
const { projectOperations } = require('../_utils/database');
const { verifyToken } = require('../_utils/auth');

async function handler(req, res) {
  const { method, query } = req;
  const { type, category, limit, id } = query;

  try {
    switch (method) {
      case 'GET':
        // Handle different GET operations based on query parameters
        if (type === 'featured') {
          // Get featured projects
          const featuredProjects = await projectOperations.getFeatured();
          res.status(200).json(featuredProjects);
        } else if (type === 'recent') {
          // Get recent projects with optional limit
          const limitCount = limit ? parseInt(limit) : 6;
          const recentProjects = await projectOperations.getRecent(limitCount);
          res.status(200).json(recentProjects);
        } else if (type === 'category' && category) {
          // Get projects by category
          const projectsByCategory = await projectOperations.getByCategory(category);
          res.status(200).json(projectsByCategory);
        } else if (id) {
          // Get project by ID
          const project = await projectOperations.getById(id);
          if (!project) {
            return res.status(404).json({ message: 'Project not found' });
          }
          res.status(200).json(project);
        } else {
          // Get all projects
          const projects = await projectOperations.getAll();
          res.status(200).json(projects);
        }
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

      case 'PUT':
        // Update project (requires authentication)
        if (!id) {
          return res.status(400).json({ message: 'Project ID is required' });
        }

        const updateAuthResult = verifyToken(req);
        if (updateAuthResult.error) {
          return res.status(401).json({ message: updateAuthResult.error });
        }

        const updatedProject = await projectOperations.update(id, req.body);
        if (!updatedProject) {
          return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(updatedProject);
        break;

      case 'DELETE':
        // Delete project (requires authentication)
        if (!id) {
          return res.status(400).json({ message: 'Project ID is required' });
        }

        const deleteAuthResult = verifyToken(req);
        if (deleteAuthResult.error) {
          return res.status(401).json({ message: deleteAuthResult.error });
        }

        await projectOperations.delete(id);
        res.status(200).json({ message: 'Project deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Projects API error:', error);
    if (error.message === 'Project not found') {
      res.status(404).json({ message: 'Project not found' });
    } else {
      res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }
}

module.exports = allowCors(handler);
