// Vercel API route for recent projects with limit
const allowCors = require('../../_utils/cors');
const { readDatabase } = require('../../_utils/database');

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { limit } = req.query;
    const db = await readDatabase();
    
    // Sort projects by creation date (newest first) and limit
    const recentProjects = (db.projects || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit) || 6);
    
    res.status(200).json(recentProjects);
  } catch (error) {
    console.error('Recent projects API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = allowCors(handler);
