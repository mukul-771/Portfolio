const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://portfolio-v1-0.vercel.app',
    'https://portfolio-v1-0-git-main-mukul-771.vercel.app',
    'https://portfolio-v1-0-mukul-771.vercel.app',
    // Add your custom domain here when you get one
    // 'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Using JSON file storage (completely free and simple)
console.log('Using JSON file storage (completely free)');
const jsonProjectRoutes = require('./routes/jsonProjects');
const jsonAuthRoutes = require('./routes/jsonAuth');
const globalSettingsRoutes = require('./routes/globalSettings');
app.use('/api/projects', jsonProjectRoutes);
app.use('/api/auth', jsonAuthRoutes);
app.use('/api/settings', globalSettingsRoutes);

// Load contact routes
const contactRoutes = require('./routes/contact');

app.use('/api/contact', contactRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Portfolio API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
