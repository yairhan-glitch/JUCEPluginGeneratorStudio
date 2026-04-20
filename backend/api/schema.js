const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Load and return the plugin schema
router.get('/', (req, res) => {
  try {
    const schemaPath = path.join(__dirname, '../../schema/pluginSchema.json');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    res.json(JSON.parse(schema));
  } catch (error) {
    console.error('Error loading schema:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load schema',
      details: error.message
    });
  }
});

module.exports = router;
