# 🎛️ JUCE Plugin Generator Studio

A schema-driven web application for generating JUCE CMake-based audio plugins without manual configuration.

**⚠️ ALPHA RELEASE** - This is an early-stage project. See [Disclaimers & Testing Notes](#-disclaimers--testing-notes) below.

## 🎯 Overview

**JUCE Plugin Generator Studio** is a desktop web application that simplifies the creation of professional audio plugins using the JUCE framework. Instead of struggling with CMake configuration files and boilerplate code, users fill out an intuitive form, and a fully functional, CMake-ready plugin project is generated instantly.

### Key Features

✅ **Schema-Driven GUI** - Dynamic form generation from JSON configuration  
✅ **Zero Manual Setup** - Generated projects compile immediately with CMake  
✅ **VST3 Focused** - Modern plugin format with Projucer-free workflow  
✅ **Conditional Logic** - Smart form fields that appear based on plugin type  
✅ **Contextual Help** - Real-time documentation for every field  
✅ **Pass-Through Template** - Baseline audio processor for extending  
✅ **Production Ready** - All code follows JUCE best practices  
✅ **Extensible** - Easy to add new plugin formats and features  

---

## 📦 System Architecture

The application is built with a modern 3-layer architecture:

```
FRONTEND (React)          BACKEND (Node.js/Express)    JUCE TEMPLATE
┌──────────────────┐      ┌──────────────────────┐      ┌─────────────────┐
│ Dynamic Form UI  │◄────►│ Validation Engine    │ ───► │ CMakeLists.txt  │
│ Help Panel       │      │ Schema Loader        │      │ PluginProcessor │
│ Status Monitor   │      │ Project Generator    │      │ PluginEditor    │
│ Real-time Logs   │      │ Template Engine      │      │ Source Files    │
└──────────────────┘      └──────────────────────┘      └─────────────────┘
   localhost:3000            localhost:5000              /Output/ProjectName/
```

### Architecture Principles

- **Schema-Driven**: All UI configuration lives in `schema/pluginSchema.json`
- **Safe Template Engine**: Deterministic placeholder replacement (no regex chaos)
- **Stateless Generation**: Each generation is independent and reproducible
- **Modular Design**: Easy to extend with new field types and generators

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (with npm)
- **CMake** 3.24+
- **JUCE** (for building generated projects)
- **C++ Compiler** (MSVC, Clang, or GCC)

### Installation & Setup

#### 1. Clone and Install Dependencies

```bash
cd JuceGenerator

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

cd ..
```

#### 2. Start the Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### 3. Start the Frontend (in a new terminal)

```bash
cd frontend
npm run dev
# GUI opens at http://localhost:3000
```

#### 4. Open in Browser

Navigate to: **http://localhost:3000**

---

## 📋 Usage Guide

### Filling Out the Form

1. **Basic Information**
   - **Plugin Name**: Alphanumeric + underscores only (MyCompressor, SynthWave, etc.)
   - **Plugin Code**: 4-character identifier or leave as AUTO
   - **Company Name**: Your brand name

2. **Audio Settings**
   - **Plugin Type**: Choose between "Audio Effect" or "Synth/Instrument"
   - **MIDI Input**: Enable for MIDI-controlled effects
   - **MIDI Output**: Enable for synths to output MIDI
   - **Number of Voices**: Polyphony count for synths (1-256)

3. **Advanced Settings**
   - **VST3 Format**: Always enabled (recommended)
   - **Create GUI Editor**: Basic JUCE editor window
   - **Enable Bypass**: DAW-controlled bypass parameter
   - **Output Directory**: Where to save your project

### Generating Your Plugin

1. Fill all required fields (marked with *)
2. Review field descriptions in the right panel
3. Click **✨ Generate Plugin Project**
4. Monitor generation progress in the status panel
5. Copy the output path and build instructions

### Building the Generated Project

After generation, open a terminal and run:

```bash
cd <project_directory>
cmake -B build          # Configure build
cmake --build build     # Compile plugin
```

Your VST3 plugin will be in `build/` directory.

---

## 🧩 Schema System

### Understanding the Schema

The schema (`schema/pluginSchema.json`) defines all form fields, validation rules, and conditional logic:

```json
{
  "groups": [
    {
      "id": "basicInfo",
      "label": "Basic Information",
      "fields": [
        {
          "id": "pluginName",
          "type": "text",
          "label": "Plugin Name",
          "required": true,
          "validation": {
            "minLength": 3,
            "maxLength": 50,
            "pattern": "^[a-zA-Z0-9_]+$"
          },
          "help": {
            "short": "The plugin name as shown in DAW",
            "long": "Extended explanation here..."
          }
        }
      ]
    }
  ]
}
```

### Supported Field Types

| Type | Purpose | Example |
|------|---------|---------|
| `text` | String input | Plugin name, company |
| `number` | Numeric input | Voice count, delay ms |
| `select` | Dropdown menu | Plugin type, format |
| `checkbox` | Boolean toggle | Enable MIDI, GUI, bypass |
| `filePath` | Directory picker | Output location |

### Conditional Visibility

Fields can appear/disappear based on other field values:

```json
{
  "id": "midiInput",
  "type": "checkbox",
  "visibleIf": {
    "field": "pluginType",
    "equals": "effect"
  }
}
```

This field only shows when `pluginType` is set to `"effect"`.

### Adding New Fields

1. Edit `schema/pluginSchema.json`
2. Add field to appropriate group
3. Update `FormRenderer.jsx` if new field type needed
4. Update template engine if used in generated code

---

## 🔧 Backend API Reference

### GET `/api/schema`

Returns the complete plugin schema.

**Response:**
```json
{
  "groups": [...]
}
```

### POST `/api/generate`

Generate a new plugin project.

**Request Body:**
```json
{
  "pluginName": "MyPlugin",
  "pluginCode": "MYPG",
  "companyName": "MyCompany",
  "pluginType": "effect",
  "midiInput": false,
  "midiOutput": false,
  "numVoices": 8,
  "enableGui": true,
  "enableBypass": true,
  "targetVst3": true,
  "outputPath": "/path/to/output"
}
```

**Response (Success):**
```json
{
  "success": true,
  "projectPath": "/path/to/output/MyPlugin",
  "projectName": "MyPlugin",
  "logs": [...],
  "message": "Plugin project generated successfully!"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["pluginName: required field is missing"],
  "logs": [...]
}
```

---

## 📁 Project Structure

```
JuceGenerator/
├── backend/
│   ├── package.json
│   ├── server.js                    # Express server entry point
│   ├── api/
│   │   ├── schema.js               # Load schema endpoint
│   │   └── generate.js             # Generation endpoint
│   ├── generators/
│   │   ├── templateEngine.js        # Safe placeholder replacement
│   │   └── projectGenerator.js      # Main generation logic
│   └── templates/
│       └── juce_vst3/              # JUCE VST3 template
│           ├── CMakeLists.txt
│           ├── Source/
│           │   ├── PluginProcessor.h/cpp
│           │   └── PluginEditor.h/cpp
│           └── .gitignore
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Main app component
│       ├── components/
│       │   ├── FormRenderer.jsx     # Dynamic form from schema
│       │   ├── HelpPanel.jsx        # Contextual help viewer
│       │   └── StatusPanel.jsx      # Generation status/logs
│       └── styles/
│           ├── index.css            # Global styles
│           ├── app.css              # App layout
│           ├── form.css             # Form components
│           ├── help-panel.css       # Help panel
│           └── status-panel.css     # Status panel
│
├── schema/
│   └── pluginSchema.json            # Complete schema definition
│
└── README.md                        # This file
```

---

## 🎛️ Generated Plugin Structure

After generation, your project structure looks like:

```
MyPlugin/
├── CMakeLists.txt                  # CMake configuration
├── Source/
│   ├── PluginProcessor.h           # Audio processing interface
│   ├── PluginProcessor.cpp         # Pass-through implementation
│   ├── PluginEditor.h              # GUI editor interface
│   └── PluginEditor.cpp            # Basic editor with styling
└── build/                          # (created after cmake build)
    └── MyPlugin_artefacts/
        └── VST3/
            └── MyPlugin.vst3       # Your plugin binary
```

### Key Generated Files

**PluginProcessor.cpp**
- Implements `AudioProcessor` base class
- Pass-through audio processing (unity gain)
- MIDI input/output support (if enabled)
- State save/load for presets
- Bypass handling

**PluginEditor.cpp**
- JUCE GUI editor window
- Professional styling (dark theme)
- Extensible with custom components
- Ready for slider/button/display additions

**CMakeLists.txt**
- JUCE plugin configuration
- VST3-only output
- Automatic JUCE module linking
- Cross-platform compatible

---

## 🧪 Testing Generated Plugins

### Quick Test Steps

1. Generate a plugin with default settings
2. Navigate to project directory: `cd MyPlugin`
3. Build: `cmake -B build && cmake --build build`
4. Locate VST3: `build/MyPlugin_artefacts/VST3/MyPlugin.vst3`
5. Test in DAW:
   - Scan plugin directory
   - Load in effect/instrument slot
   - Verify audio passes through
   - Check MIDI I/O (if enabled)

### Expected Behavior

✅ Plugin loads without errors  
✅ Audio passes unchanged (pass-through mode)  
✅ GUI window opens on loading  
✅ Bypass works correctly  
✅ Plugin unloads cleanly  

---

## 🔮 Extensibility & Future Features

The system is designed to accommodate:

### New Plugin Formats
- **AU (Audio Units)** - Add to schema, update CMakeLists template
- **AAX (Pro Tools)** - Schema field + CMake configuration
- **CLAP** - New format with separate template

### Advanced Features
- **Synth DSP Generators** - Auto-generate oscillator code
- **Preset System** - Extended state save/load
- **Visualization** - Parameter automation UI
- **AI Integration** - ML-powered DSP injection

### Implementation Path

1. Extend `schema/pluginSchema.json` with new options
2. Add new template files to `backend/templates/`
3. Update `templateEngine.js` for new placeholder types
4. Modify `projectGenerator.js` to handle new conditions
5. Frontend automatically adapts to schema changes

---

## 🛠️ Development & Customization

### Adding a New Field Type

1. **Schema** (`schema/pluginSchema.json`):
```json
{
  "id": "presetPath",
  "type": "filePath",
  "label": "Presets Directory"
}
```

2. **Frontend** (`FormRenderer.jsx`):
```jsx
case 'filePath':
  inputElement = (
    <div className="file-path-wrapper">
      <input type="text" {...props} />
      <button onClick={() => selectDirectory(field.id)}>Browse</button>
    </div>
  )
```

3. **Backend** (`projectGenerator.js`):
- Add validation logic in `validate()` method
- Add placeholder in `templateValues`

### Customizing Generated Code

Edit template files in `backend/templates/juce_vst3/Source/`:

- **PluginProcessor.h** - Add parameters, state variables
- **PluginProcessor.cpp** - Implement DSP logic
- **PluginEditor.cpp** - Design custom UI
- **CMakeLists.txt** - Link additional libraries

Changes are reflected in all future generations.

---

## 📚 JUCE Resources

- [JUCE Documentation](https://docs.juce.com/)
- [JUCE Forum](https://forum.juce.com/)
- [Audio Plugin Format Specs](https://www.aes.org/)
- [VST3 Developer Guide](https://steinberg.net/developers/vst3/)

---

## ⚙️ System Requirements

| Component | Requirement |
|-----------|-------------|
| Node.js | 16.0.0+ |
| npm | 7.0.0+ |
| CMake | 3.24.0+ |
| JUCE | 7.0.0+ |
| C++ Standard | C++17 |
| RAM | 4GB minimum |
| Disk | 500MB (+ JUCE) |

### Tested On

- ✅ Windows 10/11 (MSVC 2022)
- ✅ macOS 12+ (Clang 14+)
- ✅ Linux (GCC 11+)

---

## 🐛 Troubleshooting

### "Cannot find JUCE"

Ensure JUCE is installed and CMake can find it:

```bash
cmake --debug-output -B build -DCMAKE_PREFIX_PATH=/path/to/JUCE
```

### "Module 'X' not found" during build

Install missing JUCE modules or update CMakeLists.txt with additional `juce_add_module()` calls.

### Plugin won't load in DAW

- Check plugin code is 4 characters exactly
- Verify VST3 folder location matches DAW expectations
- Run `cmake --build build --verbose` to check for warnings

### Form fields not appearing

Clear browser cache and reload, or check schema JSON for syntax errors:

```bash
# Validate schema JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('schema/pluginSchema.json')))"
```

---

## ⚠️ Disclaimers & Testing Notes

### ALPHA RELEASE WARNING

This is an **alpha-stage project** released for community testing and feedback. While the core functionality has been developed and tested, there may be bugs, incomplete features, or unexpected behavior. 

**Use at your own risk.** The author assumes no responsibility for:
- Errors or unexpected behavior in generated plugins
- Failures during the generation process
- Issues with building, packaging, or distributing generated plugins
- Damages or data loss resulting from the use of this software
- Compatibility issues with third-party tools or DAWs

### Platform Testing Status

**✅ Thoroughly Tested:**
- Windows 10/11 (MSVC 2022 compiler)

**⚠️ Expected to Work (but not thoroughly tested):**
- macOS 12+ (Clang)
- Linux (GCC)

### Call for Testing on Other Platforms

**We appreciate help from the community!** If you use this tool on:
- **macOS** (Intel or Apple Silicon)
- **Linux** (Ubuntu, Fedora, other distributions)
- **Other Windows versions or toolchains**

Please test it and report your findings! Share:
1. Operating system and version
2. Compiler and version used
3. Whether generation completed successfully
4. Whether generated plugins compiled
5. Whether plugins loaded in your DAW
6. Any errors or unexpected behavior

Create an issue on GitHub with your test results - **your feedback helps make this tool better for everyone!**

### Known Limitations

- Schema-based generation supports VST3 primarily (other formats coming)
- Generated plugins are pass-through templates (you must implement your DSP)
- Some advanced JUCE features may not be exposed in the UI yet
- CMakeLists template is tested for VST3 on Windows/macOS/Linux

### Data Privacy

- No data is collected or sent to external servers
- All processing happens locally on your machine
- Generated projects remain on your system
- No telemetry or analytics

---

## 📄 License

MIT License - See LICENSE file for details

You are free to use, modify, and distribute this software and generated plugins.

---

## 🤝 Contributing & Reporting Issues

Contributions and bug reports are welcome!

### Reporting Issues

When reporting bugs, please include:
- OS and version
- Node.js/npm versions
- Steps to reproduce
- Error messages from browser console or terminal
- Generated plugin code (if applicable)

### Contributing

1. Fork the repository
2. Create a feature branch
3. Test thoroughly (especially on your OS!)
4. Submit a pull request with description
5. Be prepared to discuss and iterate

---

## 🎓 Learning Path

### For Beginners
1. Generate a simple effect plugin
2. Review generated source files
3. Add a simple gain parameter to PluginProcessor
4. Rebuild and test

### For Intermediate
1. Add custom UI components in PluginEditor
2. Implement real DSP (filters, effects)
3. Create multiple presets
4. Add MIDI note handling for effects

### For Advanced
1. Extend schema with custom field types
2. Add new plugin format support
3. Implement complex synth DSP
4. Integrate visualization/automation

---

## 📞 Support

- Check the **Help Panel** in the application (right panel)
- Review generated code comments
- Consult JUCE official documentation
- Check system logs in Status Panel for errors

---

## 🎉 What's Next?

After your plugin is generated:

1. ✅ Build it with CMake
2. 🎛️ Customize the GUI in PluginEditor.cpp
3. 🔊 Implement audio processing in PluginProcessor.cpp
4. 🧪 Test in your favorite DAW
5. 📦 Package and distribute!

---

**Happy plugin development! 🎵**
