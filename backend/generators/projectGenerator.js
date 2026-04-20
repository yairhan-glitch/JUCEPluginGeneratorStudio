const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const TemplateEngine = require('./templateEngine');

/**
 * Main project generation orchestrator
 */
class ProjectGenerator {
  /**
   * Validate plugin configuration against schema
   */
  static validate(config, schema) {
    const errors = [];
    
    // Flatten schema groups and fields
    const fields = {};
    schema.groups.forEach(group => {
      group.fields.forEach(field => {
        fields[field.id] = field;
      });
    });
    
    // Validate each field
    for (const [fieldId, field] of Object.entries(fields)) {
      const value = config[fieldId];
      
      if (field.required && (value === undefined || value === null || value === '')) {
        errors.push(`${fieldId}: required field is missing`);
        continue;
      }
      
      if (value === undefined || value === null) continue;
      
      // Type validation
      if (field.type === 'text' || field.type === 'filePath' || field.type === 'textarea') {
        if (typeof value !== 'string') {
          errors.push(`${fieldId}: must be a string`);
        }
        
        if (field.validation?.minLength && value.length < field.validation.minLength) {
          errors.push(`${fieldId}: minimum length is ${field.validation.minLength}`);
        }
        
        if (field.validation?.maxLength && value.length > field.validation.maxLength) {
          errors.push(`${fieldId}: maximum length is ${field.validation.maxLength}`);
        }
        
        if (field.validation?.pattern) {
          const regex = new RegExp(`^${field.validation.pattern}$`);
          if (!regex.test(value)) {
            errors.push(`${fieldId}: invalid format`);
          }
        }
      }
      
      if (field.type === 'number') {
        if (typeof value !== 'number') {
          errors.push(`${fieldId}: must be a number`);
        }
        
        if (field.validation?.min !== undefined && value < field.validation.min) {
          errors.push(`${fieldId}: minimum value is ${field.validation.min}`);
        }
        
        if (field.validation?.max !== undefined && value > field.validation.max) {
          errors.push(`${fieldId}: maximum value is ${field.validation.max}`);
        }
      }
      
      if (field.type === 'select') {
        const validValues = field.options.map(opt => opt.value);
        if (!validValues.includes(value)) {
          errors.push(`${fieldId}: invalid option selected`);
        }
      }
      
      if (field.type === 'multiselect') {
        if (!Array.isArray(value)) {
          errors.push(`${fieldId}: must be an array`);
        } else {
          const validValues = field.options.map(opt => opt.value);
          for (const v of value) {
            if (!validValues.includes(v)) {
              errors.push(`${fieldId}: invalid option '${v}'`);
            }
          }
          
          // Special validation for formats
          if (fieldId === 'formats') {
            const platformIncompatible = [];
            const platform = process.platform;
            const validPlatforms = platform === 'darwin' ? ['macos', 'ios'] : platform === 'win32' ? ['windows'] : ['linux'];
            
            for (const fmt of value) {
              const option = field.options.find(o => o.value === fmt);
              if (option && !option.platforms.some(p => validPlatforms.includes(p))) {
                platformIncompatible.push(`${fmt} (not available on ${platform})`);
              }
            }
            
            if (platformIncompatible.length > 0) {
              errors.push(`${fieldId}: These formats are not available on your platform: ${platformIncompatible.join(', ')}`);
            }
          }
        }
      }
      
      if (field.type === 'checkbox') {
        if (typeof value !== 'boolean') {
          errors.push(`${fieldId}: must be a boolean`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Generate a complete plugin project
   */
  static async generate(config) {
    const result = {
      success: false,
      projectPath: null,
      projectName: null,
      logs: []
    };
    
    try {
      // Log step
      const log = (msg) => {
        result.logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
        console.log(msg);
      };
      
      log('🔄 Starting plugin generation...');
      
      // Validate required fields
      if (!config.pluginName) throw new Error('Plugin name is required');
      if (!config.companyName) throw new Error('Company name is required');
      
      // Set default output path if not provided
      let outputPath = config.outputPath;
      if (!outputPath) {
        // Use Documents folder or temp directory as default
        const os = require('os');
        outputPath = path.join(os.homedir(), 'Documents', 'JucePlugins');
        log(`⚠️  No output path specified, using default: ${outputPath}`);
      }
      
      // Prepare values
      const pluginCode = config.pluginCode 
        ? (config.pluginCode === 'AUTO' ? TemplateEngine.generatePluginCode() : config.pluginCode)
        : TemplateEngine.generatePluginCode();
      
      const projectName = TemplateEngine.sanitizeProjectName(config.pluginName);
      
      log(`📝 Plugin Name: ${config.pluginName}`);
      log(`🔤 Plugin Code: ${pluginCode}`);
      log(`🏢 Company: ${config.companyName}`);
      log(`📂 Output: ${outputPath}`);
      
      // Ensure output directory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
        log(`✅ Created output directory`);
      }
      
      // Create project directory
      const projectPath = path.join(outputPath, projectName);
      if (fs.existsSync(projectPath)) {
        throw new Error(`Project directory already exists: ${projectPath}`);
      }
      
      fs.mkdirSync(projectPath, { recursive: true });
      log(`✅ Created project directory: ${projectPath}`);
      
      // Prepare template values - map new schema field IDs to template variables
      const templateValues = {
        // Basic identity
        pluginName: config.pluginName,
        productName: config.productName || config.pluginName,
        version: config.version || '1.0.0',
        buildVersion: config.buildVersion || config.version || '1.0.0',
        bundleId: config.bundleId || `com.${config.companyName.toLowerCase()}.${config.pluginName.toLowerCase()}`,
        
        // Plugin identity
        description: config.description || '',
        pluginManufacturerCode: config.pluginManufacturerCode || 'Manu',
        pluginCode: pluginCode,
        
        // Company
        companyName: config.companyName,
        
        // Audio capabilities (new schema field IDs)
        isSynth: config.isSynth || false,
        needsMidiInput: config.needsMidiInput || false,
        needsMidiOutput: config.needsMidiOutput || false,
        isMidiEffect: config.isMidiEffect || false,
        editorWantsKeyboardFocus: config.editorWantsKeyboardFocus || false,
        
        // Plugin formats
        formats: config.formats || ['VST3'],
        
        // VST3 Categories
        vst3Categories: config.vst3Categories || [],
        
        // Permissions
        microphonePermissionEnabled: config.microphonePermissionEnabled || false,
        microphonePermissionText: config.microphonePermissionText || 'This plugin needs microphone access',
        cameraPermissionEnabled: config.cameraPermissionEnabled || false,
        bluetoothPermissionEnabled: config.bluetoothPermissionEnabled || false,
        
        // JUCE setup
        jucePathMode: config.jucePathMode || 'find_package',
        jucePath: config.jucePath || '',
        
        // Advanced
        enableGui: config.enableGui !== false,
        enableBypass: config.enableBypass !== false
      };
      
      // Copy and process template
      const templateSource = path.join(__dirname, '../templates/juce_vst3');
      log(`📦 Processing template from: ${templateSource}`);
      
      TemplateEngine.processTemplateDirectory(templateSource, projectPath, templateValues);
      log(`✅ Template processed and files generated`);
      
      // Create Source directory if it doesn't exist
      const sourceDir = path.join(projectPath, 'Source');
      if (!fs.existsSync(sourceDir)) {
        fs.mkdirSync(sourceDir, { recursive: true });
      }
      
      result.success = true;
      result.projectPath = projectPath;
      result.projectName = projectName;
      log(`🎉 Generation complete!`);
      log(`\n📂 Project structure created in: ${projectPath}`);
      log(`\n✨ Next steps:`);
      log(`  1. cd "${projectPath}"`);
      log(`  2. cmake -B build`);
      log(`  3. cmake --build build`);
      
    } catch (error) {
      result.logs.push(`❌ ERROR: ${error.message}`);
      console.error('Generation error:', error);
    }
    
    return result;
  }
}

module.exports = ProjectGenerator;
