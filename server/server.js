const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
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
