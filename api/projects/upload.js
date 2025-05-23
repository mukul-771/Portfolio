// Vercel API route for image uploads
// Note: This is a simplified version for Vercel deployment
// For production, consider using external storage like Cloudinary, AWS S3, etc.
const allowCors = require('../_utils/cors');
const { verifyToken } = require('../_utils/auth');

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

    // For Vercel deployment, we'll use a placeholder approach
    // In a real production environment, you would integrate with:
    // - Cloudinary
    // - AWS S3
    // - Vercel Blob
    // - Other cloud storage services

    const { imageData, fileName } = req.body;

    if (!imageData || !fileName) {
      return res.status(400).json({ message: 'Image data and filename are required' });
    }

    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uniqueSuffix}.${fileExtension}`;

    // For demo purposes, we'll return a placeholder URL
    // In production, you would upload to your chosen storage service
    const imageUrl = `/uploads/images/${uniqueFileName}`;

    // TODO: Implement actual file upload to external storage
    // Example with Cloudinary:
    // const uploadResult = await cloudinary.uploader.upload(imageData);
    // const imageUrl = uploadResult.secure_url;

    res.status(200).json({ 
      imageUrl,
      message: 'Image uploaded successfully (demo mode)'
    });

  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = allowCors(handler);
