// Vercel API route for image uploads using Firebase Storage
const allowCors = require('../_utils/cors');
const { verifyToken } = require('../_utils/auth');
const { getStorage } = require('../_utils/firebase');
const formidable = require('formidable');

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

    // Parse form data
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filter: ({ mimetype }) => {
        // Accept only images
        return mimetype && mimetype.includes('image');
      }
    });

    const [fields, files] = await form.parse(req);
    const file = files.image?.[0];

    if (!file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const fileExtension = file.originalFilename?.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;

    // Get Firebase Storage instance
    const storage = getStorage();
    const bucket = storage.bucket();
    const fileRef = bucket.file(`project-images/${fileName}`);

    // Read file buffer
    const fs = require('fs');
    const fileBuffer = fs.readFileSync(file.filepath);

    // Upload to Firebase Storage
    await fileRef.save(fileBuffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Make the file publicly accessible
    await fileRef.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/project-images/${fileName}`;

    res.status(200).json({
      imageUrl: publicUrl,
      fileName: fileName,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = allowCors(handler);
