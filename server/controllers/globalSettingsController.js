const { globalSettingsService } = require('../services/jsonDataService');

// Get global image settings
exports.getImageSettings = async (req, res) => {
  try {
    const settings = await globalSettingsService.getImageSettings();
    res.json(settings);
  } catch (err) {
    console.error('Error getting global image settings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update global image settings
exports.updateImageSettings = async (req, res) => {
  try {
    const updatedSettings = await globalSettingsService.updateImageSettings(req.body);
    res.json(updatedSettings);
  } catch (err) {
    console.error('Error updating global image settings:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Reset global image settings to defaults
exports.resetImageSettings = async (req, res) => {
  try {
    const defaultSettings = await globalSettingsService.resetImageSettings();
    res.json(defaultSettings);
  } catch (err) {
    console.error('Error resetting global image settings:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
