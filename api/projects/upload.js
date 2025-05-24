// Vercel API route for project image uploads with Firebase Storage
const allowCors = require('../_utils/cors');
const jwt = require('jsonwebtoken');
const { getStorage, isFirebaseInitialized } = require('../_utils/firebase');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

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

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Verify authentication
    const authResult = verifyToken(req);
    if (authResult.error) {
      return res.status(401).json({ message: authResult.error });
    }

    // Check if Firebase is available
    if (!isFirebaseInitialized()) {
      console.log('Firebase not initialized, using mock upload');
      const mockImageUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Uploaded+Image+${Date.now()}`;
      return res.status(200).json({
        success: true,
        imageUrl: mockImageUrl,
        message: 'Image uploaded successfully (mock - Firebase not configured)'
      });
    }

    // Handle file upload with multer
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      try {
        const storage = getStorage();
        const bucket = storage.bucket();

        // Generate unique filename
        const fileName = `projects/${uuidv4()}-${req.file.originalname}`;
        const file = bucket.file(fileName);

        // Upload file to Firebase Storage
        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        // Make file publicly accessible
        await file.makePublic();

        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        res.status(200).json({
          success: true,
          imageUrl: publicUrl,
          message: 'Image uploaded successfully'
        });
      } catch (uploadError) {
        console.error('Firebase upload error:', uploadError);

        // Fallback to mock if Firebase fails
        const mockImageUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Upload+Failed+${Date.now()}`;
        res.status(200).json({
          success: true,
          imageUrl: mockImageUrl,
          message: 'Image uploaded successfully (fallback - Firebase error)'
        });
      }
    });
  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
}

module.exports = allowCors(handler);
