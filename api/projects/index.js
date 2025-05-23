// Consolidated Vercel API route for all project operations
const allowCors = require('../_utils/cors');
const jwt = require('jsonwebtoken');
const { getFirestore } = require('../_utils/firebase');

// Mock projects data for demo purposes (fallback when Firebase is not available)
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

// Helper function to check if Firebase is available
const isFirebaseAvailable = () => {
  try {
    const db = getFirestore();
    return db !== null;
  } catch (error) {
    return false;
  }
};

// Helper function to convert Firestore timestamp to ISO string
const convertTimestamp = (timestamp) => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

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
    const useFirebase = isFirebaseAvailable();

    switch (method) {
      case 'GET':
        if (useFirebase) {
          // Use Firebase
          const db = getFirestore();
          const projectsRef = db.collection('projects');

          if (type === 'featured') {
            const snapshot = await projectsRef.where('featured', '==', true).orderBy('createdAt', 'desc').get();
            const featuredProjects = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: convertTimestamp(doc.data().createdAt),
              updatedAt: convertTimestamp(doc.data().updatedAt)
            }));
            res.status(200).json(featuredProjects);
          } else if (type === 'recent') {
            const limitCount = limit ? parseInt(limit) : 6;
            const snapshot = await projectsRef.orderBy('createdAt', 'desc').limit(limitCount).get();
            const recentProjects = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: convertTimestamp(doc.data().createdAt),
              updatedAt: convertTimestamp(doc.data().updatedAt)
            }));
            res.status(200).json(recentProjects);
          } else if (type === 'category' && category) {
            const snapshot = await projectsRef.where('category', '==', category).orderBy('createdAt', 'desc').get();
            const projectsByCategory = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: convertTimestamp(doc.data().createdAt),
              updatedAt: convertTimestamp(doc.data().updatedAt)
            }));
            res.status(200).json(projectsByCategory);
          } else if (id) {
            const doc = await projectsRef.doc(id).get();
            if (!doc.exists) {
              return res.status(404).json({ message: 'Project not found' });
            }
            const project = {
              id: doc.id,
              ...doc.data(),
              createdAt: convertTimestamp(doc.data().createdAt),
              updatedAt: convertTimestamp(doc.data().updatedAt)
            };
            res.status(200).json(project);
          } else {
            const snapshot = await projectsRef.orderBy('createdAt', 'desc').get();
            const projects = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: convertTimestamp(doc.data().createdAt),
              updatedAt: convertTimestamp(doc.data().updatedAt)
            }));
            res.status(200).json(projects);
          }
        } else {
          // Use mock data
          if (type === 'featured') {
            const featuredProjects = mockProjects.filter(p => p.featured);
            res.status(200).json(featuredProjects);
          } else if (type === 'recent') {
            const limitCount = limit ? parseInt(limit) : 6;
            const recentProjects = mockProjects.slice(0, limitCount);
            res.status(200).json(recentProjects);
          } else if (type === 'category' && category) {
            const projectsByCategory = mockProjects.filter(p => p.category === category);
            res.status(200).json(projectsByCategory);
          } else if (id) {
            const project = mockProjects.find(p => p.id === id);
            if (!project) {
              return res.status(404).json({ message: 'Project not found' });
            }
            res.status(200).json(project);
          } else {
            res.status(200).json(mockProjects);
          }
        }
        break;

      case 'POST':
        // Create new project (requires authentication)
        const authResult = verifyToken(req);
        if (authResult.error) {
          return res.status(401).json({ message: authResult.error });
        }

        if (useFirebase) {
          // Use Firebase
          const db = getFirestore();
          const projectsRef = db.collection('projects');
          const now = new Date();

          const projectData = {
            ...req.body,
            createdAt: now,
            updatedAt: now
          };

          const docRef = await projectsRef.add(projectData);
          const newProject = {
            id: docRef.id,
            ...projectData,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
          };
          res.status(201).json(newProject);
        } else {
          // Use mock data
          const newProject = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          mockProjects.push(newProject);
          res.status(201).json(newProject);
        }
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

        if (useFirebase) {
          // Use Firebase
          const db = getFirestore();
          const projectRef = db.collection('projects').doc(id);
          const doc = await projectRef.get();

          if (!doc.exists) {
            return res.status(404).json({ message: 'Project not found' });
          }

          const updateData = {
            ...req.body,
            updatedAt: new Date()
          };

          await projectRef.update(updateData);

          const updatedDoc = await projectRef.get();
          const updatedProject = {
            id: updatedDoc.id,
            ...updatedDoc.data(),
            createdAt: convertTimestamp(updatedDoc.data().createdAt),
            updatedAt: convertTimestamp(updatedDoc.data().updatedAt)
          };
          res.status(200).json(updatedProject);
        } else {
          // Use mock data
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
        }
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

        if (useFirebase) {
          // Use Firebase
          const db = getFirestore();
          const projectRef = db.collection('projects').doc(id);
          const doc = await projectRef.get();

          if (!doc.exists) {
            return res.status(404).json({ message: 'Project not found' });
          }

          await projectRef.delete();
          res.status(200).json({ message: 'Project deleted successfully' });
        } else {
          // Use mock data
          const deleteIndex = mockProjects.findIndex(p => p.id === id);
          if (deleteIndex === -1) {
            return res.status(404).json({ message: 'Project not found' });
          }

          mockProjects.splice(deleteIndex, 1);
          res.status(200).json({ message: 'Project deleted successfully' });
        }
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
