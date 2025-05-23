// Vercel API route for projects by category
const allowCors = require('../../_utils/cors');
const { readDatabase } = require('../../_utils/database');

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { category } = req.query;
    const db = await readDatabase();
    
    const projectsByCategory = (db.projects || []).filter(
      project => project.category && project.category.toLowerCase() === category.toLowerCase()
    );
    
    res.status(200).json(projectsByCategory);
  } catch (error) {
    console.error('Projects by category API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = allowCors(handler);
