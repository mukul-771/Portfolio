// Database utility for Vercel serverless functions
const fs = require('fs').promises;
const path = require('path');

// In Vercel, we need to use a different approach for file storage
// We'll use environment variables or external storage for production
const DB_PATH = path.join(process.cwd(), 'server/db/projects.json');

// Read database
const readDatabase = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    // Return default structure if file doesn't exist
    return {
      projects: [],
      users: [
        {
          id: "1",
          email: "mukul.meena@iitgn.ac.in",
          password: "$2b$10$y1aKCyX47w6y3KpNaYfvz.HCTE45H11uYGoimQUKPS9Rg8Fkh3Zyy",
          role: "admin",
          createdAt: "2024-01-01T00:00:00.000Z"
        }
      ],
      globalImageSettings: {
        defaultThumbnailSettings: {
          aspectRatio: "4:3",
          fitBehavior: "cover",
          width: 300,
          height: 225,
          scale: 100,
          lockAspectRatio: true
        },
        defaultHeroSettings: {
          aspectRatio: "16:9",
          fitBehavior: "cover",
          width: 800,
          height: 450,
          scale: 100,
          lockAspectRatio: true
        },
        defaultGallerySettings: {
          aspectRatio: "original",
          fitBehavior: "contain",
          width: 600,
          height: 400,
          scale: 100,
          lockAspectRatio: true
        },
        responsiveBreakpoints: {
          mobile: 375,
          tablet: 768,
          desktop: 1200
        }
      }
    };
  }
};

// Write database
const writeDatabase = async (data) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

module.exports = {
  readDatabase,
  writeDatabase
};
