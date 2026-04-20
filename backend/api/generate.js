const express = require('express');
const fs = require('fs');
const path = require('path');
const ProjectGenerator = require('../generators/projectGenerator');

const router = express.Router();

// Load schema once
let cachedSchema = null;
function loadSchema() {
  if (!cachedSchema) {
    const schemaPath = path.join(__dirname, '../../schema/pluginSchema.json');
    cachedSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  }
  return cachedSchema;
}

/**
 * POST /api/generate
 * Generate a JUCE VST3 plugin project
 */
router.post('/', async (req, res) => {
  try {
    const config = req.body;
    const schema = loadSchema();
    
    console.log('📥 [API] Received generation request');
    console.log('📋 [API] Config keys:', Object.keys(config));
    console.log('📋 [API] Config:', JSON.stringify(config, null, 2));
    
    // Validate configuration
    const validation = ProjectGenerator.validate(config, schema);
    
    console.log('✅ [API] Validation result:', validation);
    
    if (!validation.valid) {
      console.error('❌ [API] Validation failed:', validation.errors);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors.join('; ')
      });
    }
    
    console.log('🚀 [API] Starting project generation...');
    // Generate project
    const result = await ProjectGenerator.generate(config);
    
    console.log('✅ [API] Generation complete:', result);
    
    res.json({
      success: result.success,
      projectPath: result.projectPath,
      projectName: result.projectName,
      logs: result.logs,
      message: result.success 
        ? 'Plugin project generated successfully!' 
        : 'Failed to generate plugin project'
    });
    
  } catch (error) {
    console.error('❌ [API] Generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Generation failed',
      details: error.message,
      logs: [`ERROR: ${error.message}`, `Stack: ${error.stack}`]
    });
  }
});

module.exports = router;
