# JUCE Plugin Generator - CMake API Expansion

**⚠️ This is technical documentation for an alpha-stage release. Users assume full responsibility for use. See [Disclaimers](./README.md#-disclaimers--testing-notes) for important information.**

## Overview
The JUCE Plugin Generator has been expanded with comprehensive CMake API support, allowing users to configure all major JUCE plugin generation options through the UI. This includes:

- **JUCE Framework Setup**: Support for both `find_package()` and `add_subdirectory()` modes
- **Extended Plugin Configuration**: All CMake `juce_add_plugin()` options
- **Platform-Specific Validation**: Automatic checks for plugin format compatibility
- **Permission Management**: macOS/iOS permission controls
- **Multi-Format Support**: VST3, AU, AUv3, AAX, VST, LV2, Standalone, Unity

---

## 1. Schema Updates

### File: `schema/pluginSchema.json`

#### New Groups Added:

**A. JUCE Framework Setup Group**
- `jucePathMode`: Radio buttons for `find_package` vs `add_subdirectory`
- `jucePath`: File browser input (only visible when `add_subdirectory` selected)

**B. Enhanced Basic Information**
- `productName`: Output binary name (defaults to plugin name)
- `version`: "major.minor.bugfix" format validation
- `buildVersion`: Internal version for macOS (CFBundleVersion)
- `bundleId`: "com.company.product" format validation

**C. Plugin Identity & Description**
- `description`: Long-form plugin description
- `pluginManufacturerCode`: 4-char code (must contain uppercase)
- `pluginCode`: 4-char code (must have exactly 1 uppercase)

**D. Audio Capabilities**
- `isSynth`: Is this a synthesizer/instrument?
- `needsMidiInput`: Plugin accepts MIDI
- `needsMidiOutput`: Plugin produces MIDI
- `isMidiEffect`: Specialized MIDI processor
- `editorWantsKeyboardFocus`: Editor handles keyboard

**E. Plugin Formats**
- `formats`: Multi-select from VST3, VST, AU, AUv3, AAX, LV2, Standalone, Unity
- Platform validation: AU/AUv3 on macOS only, etc.

**F. VST3 Configuration**
- `vst3Categories`: Multi-select from 27 official VST3 categories
- Defaults: "Instrument Synth" for synths, "Fx" for effects

**G. Permissions (macOS/iOS)**
- `microphonePermissionEnabled`: Request microphone access
- `microphonePermissionText`: User-facing description
- `cameraPermissionEnabled`: Request camera access
- `bluetoothPermissionEnabled`: Request Bluetooth access

---

## 2. Backend Generator Updates

### File: `backend/generators/templateEngine.js`

#### New Methods Added:

```javascript
processConditionals(content, values)
  - Handles {{#if CONDITION}} ... {{/if}} blocks
  - Special handling for mode-specific blocks (find_package vs add_subdirectory)
  - Generic truthy/falsy evaluation for boolean fields

formatsList(formats)
  - Converts array of formats to space-separated string for CMake
  - Example: ["VST3", "AU"] → "VST3 AU"

vst3CategoriesList(categories, isSynth)
  - Formats VST3 categories with quotes for CMake
  - Auto-defaults based on plugin type if not specified
  - Example: ["Fx", "Reverb"] → '"Fx Reverb"'

toCamelCase(str)
  - Converts SCREAMING_SNAKE_CASE to camelCase
  - Used for mapping CMake field names to form field IDs
```

#### Updated Placeholder Mappings:

All CMake `juce_add_plugin()` parameters are now supported:

```javascript
// Basic identity
{{PRODUCT_NAME}}
{{VERSION}}
{{BUILD_VERSION}}
{{BUNDLE_ID}}
{{DESCRIPTION}}

// Codes
{{PLUGIN_MANUFACTURER_CODE}}
{{PLUGIN_CODE}}

// Audio
{{IS_SYNTH}}
{{NEEDS_MIDI_INPUT}}
{{NEEDS_MIDI_OUTPUT}}
{{IS_MIDI_EFFECT}}
{{EDITOR_WANTS_KEYBOARD_FOCUS}}

// Formats
{{FORMATS}}
{{VST3_CATEGORIES}}

// Permissions
{{MICROPHONE_PERMISSION_ENABLED}}
{{MICROPHONE_PERMISSION_TEXT}}
{{CAMERA_PERMISSION_ENABLED}}
{{BLUETOOTH_PERMISSION_ENABLED}}

// JUCE Setup
{{JUCE_PATH_MODE}}
{{JUCE_PATH}}
```

### File: `backend/generators/projectGenerator.js`

#### Enhanced Validation:

New validation types added:

```javascript
// Multiselect arrays
if (field.type === 'multiselect') {
  - Validates each item against allowed options
  - Platform compatibility checks for formats
  - Example: AU format only valid on macOS
}

// Format-specific validation
if (fieldId === 'formats') {
  - Detects incompatible formats for current platform
  - Returns helpful error messages
  - Example: "AUv3 (not available on windows)"
}
```

---

## 3. Frontend Component Updates

### File: `frontend/src/components/FormRenderer.jsx`

#### New Field Types Supported:

**A. Multiselect** (`type: "multiselect"`)
```javascript
// Renders as checkbox list with descriptions
// Returns array of selected values
Example fields:
  - formats: ["VST3", "AU"]
  - vst3Categories: ["Fx", "Reverb", "Delay"]
```

**B. Textarea** (`type: "textarea"`)
```javascript
// Renders as expandable text area
// Supports min/max length validation
Example fields:
  - description: "Plugin description..."
  - microphonePermissionText: "This plugin needs..."
```

#### Conditional Visibility:
- Implements `visibleIf` logic for conditional field display
- Example: Show `jucePath` input only when `jucePathMode === "add_subdirectory"`
- Example: Show `microphonePermissionText` only when `microphonePermissionEnabled === true`

### File: `frontend/src/styles/form.css`

#### New Styles Added:

```css
/* Textarea styling */
.form-field-textarea .form-input
  - Monospace font for code
  - Vertical resize enabled
  - Minimum 100px height

/* Multiselect styling */
.multiselect-wrapper
  - Bordered container with scrolling
  - Max height 300px with overflow

.multiselect-item
  - Individual checkbox with label
  - Description text in smaller font
  - Hover highlight effect

.multiselect-item input[type="checkbox"]
  - Large clickable target
  - Proper alignment with flex

.option-label / .option-desc
  - Clear hierarchy between option name and description
```

---

## 4. CMakeLists Template Updates

### File: `backend/templates/juce_vst3/CMakeLists.txt`

#### Major Changes:

**1. JUCE Framework Setup**
```cmake
# Conditional based on jucePathMode
{{#if JUCE_PATH_MODE_find_package}}
find_package(JUCE CONFIG REQUIRED)
{{/if}}

{{#if JUCE_PATH_MODE_add_subdirectory}}
add_subdirectory({{JUCE_PATH}} juce)
{{/if}}
```

**2. Comprehensive juce_add_plugin() Call**
```cmake
juce_add_plugin({{PLUGIN_NAME_IDENTIFIER}}
    # Basic Identity
    PRODUCT_NAME "{{PRODUCT_NAME}}"
    PLUGIN_NAME "{{PLUGIN_NAME}}"
    DESCRIPTION "{{DESCRIPTION}}"
    
    # Versioning
    VERSION {{VERSION}}
    BUILD_VERSION {{BUILD_VERSION}}
    BUNDLE_ID "{{BUNDLE_ID}}"
    
    # Company & Codes
    COMPANY_NAME "{{COMPANY_NAME}}"
    PLUGIN_MANUFACTURER_CODE "{{PLUGIN_MANUFACTURER_CODE}}"
    PLUGIN_CODE "{{PLUGIN_CODE}}"
    
    # Audio Capabilities
    IS_SYNTH {{IS_SYNTH}}
    NEEDS_MIDI_INPUT {{NEEDS_MIDI_INPUT}}
    NEEDS_MIDI_OUTPUT {{NEEDS_MIDI_OUTPUT}}
    IS_MIDI_EFFECT {{IS_MIDI_EFFECT}}
    EDITOR_WANTS_KEYBOARD_FOCUS {{EDITOR_WANTS_KEYBOARD_FOCUS}}
    
    # Plugin Formats
    FORMATS {{FORMATS}}
    VST3_CATEGORIES {{VST3_CATEGORIES}}
    
    # macOS/iOS Permissions (conditional)
    {{#if MICROPHONE_PERMISSION_ENABLED}}
    MICROPHONE_PERMISSION_ENABLED TRUE
    MICROPHONE_PERMISSION_TEXT "{{MICROPHONE_PERMISSION_TEXT}}"
    {{/if}}
    
    # Build Settings
    COPY_PLUGIN_AFTER_BUILD FALSE
)
```

---

## 5. Validation Rules

### Format Validation

Each format supports specific platforms:

| Format | Windows | macOS | Linux |  iOS  | Notes |
|--------|---------|-------|-------|-------|-------|
| VST3   |   ✓     |   ✓   |   ✓   |   ✗   | Recommended |
| VST    |   ✓     |   ✓   |   ✓   |   ✗   | Requires SDK |
| AU     |   ✗     |   ✓   |   ✗   |   ✗   | macOS only |
| AUv3   |   ✗     |   ✓   |   ✗   |   ✓   | Requires Xcode |
| AAX    |   ✓     |   ✓   |   ✗   |   ✗   | Requires SDK |
| LV2    |   ✓     |   ✗   |   ✓   |   ✗   | Linux primary |
| Unity  |   ✓     |   ✓   |   ✗   |   ✗   | - |
| Standalone |✓   |   ✓   |   ✓   |   ✗   | Desktop app |

### Version Format Validation
- Pattern: `^\d+\.\d+\.\d+$` (e.g., "1.0.0", "2.3.15")
- Applied to: `version`, `buildVersion`

### Bundle ID Validation
- Pattern: Standard reverse-domain notation
- Example: `com.yourcompany.myplugin`

### Code Validation
- `PLUGIN_MANUFACTURER_CODE`: 4 chars, must contain at least 1 uppercase
- `PLUGIN_CODE`: 4 chars, must contain exactly 1 uppercase

---

## 6. Usage Examples

### Example 1: Basic VST3 Synth

```
JUCE Setup: find_package
Plugin Name: MySynth
Company Name: MyCompany
Is Synth: TRUE
Plugin Formats: VST3
VST3 Categories: Instrument, Synth
```

Generates CMakeLists.txt with:
```cmake
FORMATS VST3
VST3_CATEGORIES "Instrument Synth"
IS_SYNTH TRUE
```

### Example 2: Multi-Format Audio Effect with Permissions

```
JUCE Setup: add_subdirectory
JUCE Path: /Users/dev/JUCE
Plugin Name: AdvancedReverb
Company Name: ProAudio
Is Synth: FALSE
Plugin Formats: VST3, AU, Standalone
VST3 Categories: Fx, Reverb
Microphone Permission: TRUE
Microphone Permission Text: "This reverb needs microphone input to demonstrate audio processing"
```

Generates CMakeLists.txt with:
```cmake
add_subdirectory(/Users/dev/JUCE juce)
FORMATS VST3 AU Standalone
VST3_CATEGORIES "Fx Reverb"
IS_SYNTH FALSE
MICROPHONE_PERMISSION_ENABLED TRUE
MICROPHONE_PERMISSION_TEXT "This reverb needs microphone input..."
```

---

## 7. Data Flow

```
User Input (Frontend)
    ↓
Form Validation (FormRenderer)
    ↓
API POST /api/generate
    ↓
Backend Validation (ProjectGenerator.validate)
    ↓
Template Processing (TemplateEngine)
    - Replace {{PLACEHOLDERS}}
    - Process {{#if CONDITIONS}}
    ↓
CMakeLists.txt Generated
    ↓
User builds with: cmake -B build && cmake --build build
```

---

## 8. Testing Checklist

- [ ] All field types render correctly (text, select, checkbox, multiselect, textarea)
- [ ] Conditional visibility works (jucePath appears only with add_subdirectory)
- [ ] Format validation rejects incompatible formats for platform
- [ ] Version format validation enforces "X.Y.Z" pattern
- [ ] Generated CMakeLists.txt has correct syntax
- [ ] Conditional blocks {{#if}} are processed correctly
- [ ] Multiselect returns arrays
- [ ] Bundle ID format validation works
- [ ] Code validation enforces uppercase letter requirements
- [ ] Platform-specific categories default correctly

---

## 9. Future Enhancements

Potential additions:

1. **ARA Support**: Add `IS_ARA_EFFECT`, `ARA_FACTORY_ID` fields
2. **Plugin Presets**: Template system for common plugin types
3. **Build Configuration**: Link-time optimization, hardened runtime
4. **Advanced CMake**: Custom compiler definitions, flags
5. **Plugin Parameters**: Auto-generate parameter definitions from UI

---

## 10. Integration Notes

### Backward Compatibility
- Old plugins still work; all new fields have sensible defaults
- Existing CMakeLists templates are preserved
- Schema is additive (no breaking changes)

### Platform-Specific Behavior
- Format validation runs on build system platform
- Warning displayed if generating for different platform
- AAX/AU/AUv3 formats require respective SDKs installed

### CMake Compatibility
- Minimum CMake 3.24 (as per JUCE requirements)
- Generated CMakeLists.txt uses modern CMake syntax
- Tested with JUCE 7.x+
