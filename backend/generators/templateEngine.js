const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Safe template engine for JUCE plugin generation
 * Replaces placeholders deterministically without regex chaos
 */
class TemplateEngine {
  /**
   * Replace placeholders in a string
   */
  static replacePlaceholders(content, values) {
    let result = content;
    
    // First, handle conditional blocks {{#if condition}} ... {{/if}}
    result = this.processConditionals(result, values);
    
    // Define exact placeholder mappings for all CMake options
    const placeholders = {
      // Basic info
      '{{PLUGIN_NAME}}': values.pluginName,
      '{{PLUGIN_NAME_UPPER}}': values.pluginName.toUpperCase(),
      '{{PLUGIN_NAME_LOWER}}': values.pluginName.toLowerCase(),
      '{{PLUGIN_NAME_IDENTIFIER}}': this.toIdentifier(values.pluginName),
      '{{PRODUCT_NAME}}': values.productName || values.pluginName,
      '{{VERSION}}': values.version || '1.0.0',
      '{{BUILD_VERSION}}': values.buildVersion || values.version || '1.0.0',
      '{{BUNDLE_ID}}': values.bundleId || `com.${values.companyName.toLowerCase()}.${values.pluginName.toLowerCase()}`,
      
      // Plugin identity
      '{{DESCRIPTION}}': values.description || '',
      '{{PLUGIN_MANUFACTURER_CODE}}': values.pluginManufacturerCode || 'Manu',
      '{{PLUGIN_CODE}}': values.pluginCode || this.generatePluginCode(),
      
      // Company info
      '{{COMPANY_NAME}}': values.companyName,
      '{{COMPANY_NAME_UPPER}}': values.companyName.toUpperCase(),
      
      // Audio capabilities
      '{{IS_SYNTH}}': values.isSynth ? 'TRUE' : 'FALSE',
      '{{NEEDS_MIDI_INPUT}}': values.needsMidiInput ? 'TRUE' : 'FALSE',
      '{{NEEDS_MIDI_OUTPUT}}': values.needsMidiOutput ? 'TRUE' : 'FALSE',
      '{{IS_MIDI_EFFECT}}': values.isMidiEffect ? 'TRUE' : 'FALSE',
      '{{EDITOR_WANTS_KEYBOARD_FOCUS}}': values.editorWantsKeyboardFocus ? 'TRUE' : 'FALSE',
      
      // Plugin formats
      '{{FORMATS}}': this.formatsList(values.formats),
      
      // VST3 categories
      '{{VST3_CATEGORIES}}': this.vst3CategoriesList(values.vst3Categories, values.isSynth),
      
      // Permissions
      '{{MICROPHONE_PERMISSION_ENABLED}}': values.microphonePermissionEnabled ? 'TRUE' : 'FALSE',
      '{{MICROPHONE_PERMISSION_TEXT}}': values.microphonePermissionText || 'This plugin needs microphone access to process audio input',
      '{{CAMERA_PERMISSION_ENABLED}}': values.cameraPermissionEnabled ? 'TRUE' : 'FALSE',
      '{{BLUETOOTH_PERMISSION_ENABLED}}': values.bluetoothPermissionEnabled ? 'TRUE' : 'FALSE',
      
      // JUCE setup
      '{{JUCE_PATH_MODE}}': values.jucePathMode || 'find_package',
      '{{JUCE_PATH}}': values.jucePath || '',
      
      // Advanced
      '{{ENABLE_GUI}}': values.enableGui ? '1' : '0',
      '{{ENABLE_BYPASS}}': values.enableBypass ? '1' : '0'
    };
    
    // Replace each placeholder exactly
    for (const [placeholder, value] of Object.entries(placeholders)) {
      result = result.split(placeholder).join(String(value || ''));
    }
    
    return result;
  }

  /**
   * Process conditional blocks {{#if condition}} ... {{/if}}
   */
  static processConditionals(content, values) {
    let result = content;
    
    // Match {{#if FIELD_NAME}} ... {{/if}} patterns
    const conditionalRegex = /\{\{#if\s+([A-Z_]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    
    result = result.replace(conditionalRegex, (match, fieldName, blockContent) => {
      // Check if the field name with specific value (e.g., JUCE_PATH_MODE_find_package)
      const fieldParts = fieldName.split('_');
      const actualFieldName = fieldName;
      
      // Handle specific conditions
      if (actualFieldName === 'JUCE_PATH_MODE_find_package') {
        return (values.jucePathMode === 'find_package') ? blockContent : '';
      }
      if (actualFieldName === 'JUCE_PATH_MODE_add_subdirectory') {
        return (values.jucePathMode === 'add_subdirectory') ? blockContent : '';
      }
      
      // Generic field check
      const fieldValue = values[this.toCamelCase(actualFieldName)];
      if (fieldValue) {
        return blockContent;
      }
      return '';
    });
    
    return result;
  }

  /**
   * Convert SCREAMING_SNAKE_CASE to camelCase
   */
  static toCamelCase(str) {
    return str
      .toLowerCase()
      .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }
  
  /**
   * Convert a plugin name to a valid C++ identifier
   */
  static toIdentifier(name) {
    return name
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .replace(/^[0-9]/, '_$&')
      .substring(0, 128);
  }
  
  /**
   * Generate a unique 4-character plugin code
   */
  static generatePluginCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Format plugin formats array for CMakeLists.txt
   */
  static formatsList(formats) {
    if (!formats || !Array.isArray(formats) || formats.length === 0) {
      return 'VST3';
    }
    return formats.join(' ');
  }

  /**
   * Format VST3 categories for CMakeLists.txt
   */
  static vst3CategoriesList(categories, isSynth) {
    // If categories specified, use them
    if (categories && Array.isArray(categories) && categories.length > 0) {
      return `"${categories.join(' ')}"`;
    }
    // Default based on plugin type
    if (isSynth) {
      return '"Instrument Synth"';
    }
    return '"Fx"';
  }
  
  /**
   * Generate a safe filesystem-friendly project name
   */
  static sanitizeProjectName(name) {
    return name
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .substring(0, 255);
  }
  
  /**
   * Process a template file/directory recursively
   */
  static processTemplateDirectory(sourceDir, targetDir, values) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      let targetName = entry.name;
      
      // Replace placeholders in filename
      targetName = this.replacePlaceholders(targetName, values);
      const targetPath = path.join(targetDir, targetName);
      
      if (entry.isDirectory()) {
        this.processTemplateDirectory(sourcePath, targetPath, values);
      } else {
        // Process file content
        const content = fs.readFileSync(sourcePath, 'utf-8');
        const processedContent = this.replacePlaceholders(content, values);
        fs.writeFileSync(targetPath, processedContent, 'utf-8');
      }
    }
  }
}

module.exports = TemplateEngine;
