// Consolidated Vercel API route for all project operations
const allowCors = require('../_utils/cors');
const jwt = require('jsonwebtoken');

// Mock projects data for demo purposes
let mockProjects = [
  {
    id: '1',
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with React and Node.js',
    imageUrl: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Portfolio+Website',
    category: 'developer',
    technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mockupImageUrl: 'https://via.placeholder.com/1200x800/4F46E5/FFFFFF?text=Portfolio+Mockup',
    overviewDescription: 'A comprehensive portfolio website showcasing development skills',
    technicalDetails: 'Built with modern web technologies and best practices',
    implementationInfo: 'Deployed on Vercel with CI/CD pipeline',
    galleryImages: [
      'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Gallery+1',
      'https://via.placeholder.com/600x400/7C3AED/FFFFFF?text=Gallery+2'
    ]
  },
  {
    id: '2',
    title: 'Brand Identity Design',
    description: 'Complete brand identity design for a tech startup',
    imageUrl: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Brand+Identity',
    category: 'designer',
    technologies: ['Adobe Illustrator', 'Figma', 'Photoshop'],
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    galleryImages: [
      'https://via.placeholder.com/600x400/7C3AED/FFFFFF?text=Logo+Design',
      'https://via.placeholder.com/600x400/EC4899/FFFFFF?text=Color+Palette',
      'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Typography'
    ]
  }
];

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
  // Ensure JSON response
  res.setHeader('Content-Type', 'application/json');

  const { method, query } = req;
  const { type, category, limit, id } = query;

  console.log('Projects API called:', { method, query });

  try {
    switch (method) {
      case 'GET':
        // Handle different GET operations based on query parameters
        if (type === 'featured') {
          // Get featured projects
          const featuredProjects = mockProjects.filter(p => p.featured);
          res.status(200).json(featuredProjects);
        } else if (type === 'recent') {
          // Get recent projects with optional limit
          const limitCount = limit ? parseInt(limit) : 6;
          const recentProjects = mockProjects.slice(0, limitCount);
          res.status(200).json(recentProjects);
        } else if (type === 'category' && category) {
          // Get projects by category
          const projectsByCategory = mockProjects.filter(p => p.category === category);
          res.status(200).json(projectsByCategory);
        } else if (id) {
          // Get project by ID
          const project = mockProjects.find(p => p.id === id);
          if (!project) {
            return res.status(404).json({ message: 'Project not found' });
          }
          res.status(200).json(project);
        } else {
          // Get all projects
          res.status(200).json(mockProjects);
        }
        break;

      case 'POST':
        // Create new project (requires authentication)
        const authResult = verifyToken(req);
        if (authResult.error) {
          return res.status(401).json({ message: authResult.error });
        }

        const newProject = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockProjects.push(newProject);
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

        const projectIndex = mockProjects.findIndex(p => p.id === id);
        if (projectIndex === -1) {
          return res.status(404).json({ message: 'Project not found' });
        }

        const updatedProject = {
          ...mockProjects[projectIndex],
          ...req.body,
          updatedAt: new Date().toISOString()
        };
        mockProjects[projectIndex] = updatedProject;
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

        const deleteIndex = mockProjects.findIndex(p => p.id === id);
        if (deleteIndex === -1) {
          return res.status(404).json({ message: 'Project not found' });
        }

        mockProjects.splice(deleteIndex, 1);
        res.status(200).json({ message: 'Project deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Projects API error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = allowCors(handler);
