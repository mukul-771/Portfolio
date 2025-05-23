// Vercel API route for featured projects
const allowCors = require('../_utils/cors');
const { readDatabase } = require('../_utils/database');

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const db = await readDatabase();
    const featuredProjects = (db.projects || []).filter(project => project.featured === true);
    res.status(200).json(featuredProjects);
  } catch (error) {
    console.error('Featured projects API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = allowCors(handler);
