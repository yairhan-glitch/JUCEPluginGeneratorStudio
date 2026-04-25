# 🎛️ JUCE Plugin Generator Studio

A schema-driven web application for generating JUCE CMake-based audio plugins without manual configuration.

**⚠️ ALPHA RELEASE** - This is an early-stage project. **[READ DISCLAIMER](DISCLAIMER.md) BEFORE USE** - See important disclaimers and risk disclosure.

**📜 Open Source (MIT License)** - Free to use, free to modify. [View License](LICENSE.md) | [Contributing Guidelines](CONTRIBUTING.md)

---

## Quick Links

- 🚨 **[IMPORTANT: Risk Disclaimer & Liability Notice](DISCLAIMER.md)** - Read this first!
- 📜 **[License Information](LICENSE.md)** - MIT License with attribution requirements
- 🤝 **[Contributing Guide](CONTRIBUTING.md)** - How to report bugs and submit contributions
- � **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards and expectations
- �🐛 **[Report Issues](https://github.com/YOUR-REPO/issues)** - Found a bug?
- 💡 **[Feature Requests](https://github.com/YOUR-REPO/issues)** - Have an idea?

---

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

## ⚠️ Disclaimers & Risk Disclosure

### ALPHA RELEASE WARNING

This is an **alpha-stage project** released for community testing and feedback. While the core functionality has been developed and tested, there may be bugs, incomplete features, or unexpected behavior.

### ⚠️ USER ASSUMES ALL RISK

**USE AT YOUR OWN RISK.** By using this software, you acknowledge and agree that:

**1. Liability Disclaimer**
The author, contributors, and copyright holders assume NO responsibility for:
- Generation failures, bugs, or errors in the plugin generation process
- Failures during the build/compilation of generated plugins
- Incompatibility with DAWs, operating systems, or third-party software
- Loss of data, project files, or work-in-progress
- Corruption or damage to system files or audio projects
- Any direct, indirect, incidental, consequential, or punitive damages
- Loss of profits, revenue, business opportunity, or reputation
- Security vulnerabilities or breaches in generated code
- Licensing disputes or intellectual property conflicts

**2. No Warranty**
This software is provided "AS-IS" without warranty of any kind. There are no guarantees regarding:
- Functionality or fitness for any particular purpose
- Compatibility with specific DAWs or hardware
- Performance, stability, or security
- Future support or updates

**3. Your Responsibility**
You are solely responsible for:
- Thoroughly testing all generated plugins before use or distribution
- Verifying that generated code complies with all applicable laws and licenses
- Ensuring compatibility with your target DAWs and systems
- Security review of generated code and any modifications you make
- Proper licensing and distribution of your generated plugins
- Backing up your data and projects
- Complying with all third-party license requirements

**4. Third-Party Licenses**
Generated plugins depend on:
- **JUCE Framework** - Review JUCE's licensing terms
- **Node.js, React, Express** - Your use implies acceptance of their licenses
- **CMake** - Subject to CMake's license terms
- Other dependencies - See respective project licenses

You must comply with the licensing terms of all dependencies.

**5. Platform-Specific Risks**
- ✅ **Windows 10/11**: Thoroughly tested with MSVC 2022
- ⚠️ **macOS**: Expected to work but not extensively tested
- ⚠️ **Linux**: Expected to work but not extensively tested

Testing on untested platforms is at your own risk. Cross-platform compatibility is not guaranteed.

### 📋 Known Limitations

- Schema-based generation primarily supports VST3 format
- Generated plugins are pass-through templates - you must implement your own DSP
- Some advanced JUCE features may not yet be exposed in the UI
- CMakeLists template designed for Windows/macOS/Linux environments
- No built-in preset system (you can add this yourself)
- Limited error recovery for invalid configurations

### 🔒 Data & Privacy

- **No Data Collection**: No usage data, telemetry, or analytics are collected
- **All Processing is Local**: All generation happens on your machine only
- **No External Servers**: This tool does not communicate with external services
- **Open Source**: Code is publicly available for security review

### 📝 Before Using This Tool

**Please:**
1. Read this entire disclaimer carefully
2. Understand the licensing requirements
3. Test thoroughly on a non-critical system first
4. Back up all important data
5. Review generated code before using in production
6. Test generated plugins in your DAW before distribution
7. Keep backups of your original JUCE installations

**If you do not agree to these terms, do not use this software.**

### Platform Testing Status

**✅ Thoroughly Tested:**
- Windows 10/11 (MSVC 2022 compiler)

**⚠️ Expected to Work (but not thoroughly tested):**
- macOS 12+ (Clang)
- Linux (GCC)

**🤝 Community Help Needed:**
We need testing on other platforms and configurations. If you test on macOS, Linux, or other setups, please share your results! This helps the community and improves the tool for everyone.

### Data Privacy

- No data is collected or sent to external servers
- All processing happens locally on your machine
- Generated projects remain on your system
- No telemetry or analytics


---

## 📄 License & Legal

### Open Source MIT License

This software is provided under the **MIT License**, which means:

✅ **FREE to use** - No cost, no licensing fees  
✅ **FREE to modify** - Customize for your needs  
✅ **FREE to distribute** - Share plugins you create  
✅ **FREE to use commercially** - Build products with it  

📋 **Attribution Required** - You must include:
- A copy of the license
- Notice that work is based on JUCE Plugin Generator Studio
- Link to original repository

### Important Disclaimers

⚠️ **[READ FULL DISCLAIMER](DISCLAIMER.md)** - Important risk disclosure and liability limitations

**Key Points:**
- **NO WARRANTY** - Provided as-is without guarantees
- **USER ASSUMES ALL RISK** - Use at your own risk
- **NO LIABILITY** - Authors not responsible for damages or issues
- **YOUR RESPONSIBILITY** - You're responsible for testing and compliance

See [LICENSE.md](LICENSE.md) for complete license terms.

---

## 📄 License

MIT License - See [LICENSE.md](LICENSE.md) for details

You are free to use, modify, and distribute this software and generated plugins in accordance with the MIT License terms.

---

## 🤝 Contributing & Reporting Issues

This is an open-source project, and contributions from the community are greatly appreciated! Whether you're reporting bugs, suggesting features, or submitting code, your input helps improve this tool for everyone.

### 🐛 Reporting Issues

Bug reports are essential for improving the tool. When reporting a bug, please provide:

**Required Information:**
- Operating system and version (e.g., Windows 11 22H2, macOS 13.1, Ubuntu 22.04)
- Node.js and npm versions (`node --version`, `npm --version`)
- CMake version (`cmake --version`)
- Compiler and version (MSVC, Clang, GCC with version numbers)

**Detailed Steps to Reproduce:**
1. Clear instructions to reproduce the issue
2. What you were trying to do
3. What happened instead
4. What you expected to happen

**Additional Details:**
- Error messages from browser console (F12 → Console tab)
- Terminal error output (full stack traces if available)
- Generated plugin code or schema modifications (if applicable)
- Screenshots or logs if helpful

**Platform Testing Results:**
- If you tested on macOS or Linux, please share your results!
- Include whether generation succeeded, if compilation worked, and if the plugin loaded

**Example Issue:**
```
Title: Plugin generation fails on macOS with Clang 14
OS: macOS 13.1 (Apple Silicon)
Node: v18.12.0, npm 8.19.2
CMake: 3.24.3, Clang 14.0.0

Steps:
1. Fill form with "TestPlugin" name
2. Click Generate
3. Get error message...

Expected: Plugin project to generate successfully
```

### 💡 Feature Requests

Have an idea for a new feature? We'd love to hear it!

- Describe the feature and why it would be useful
- Provide example use cases
- Include any relevant documentation or references
- Be open to discussion about implementation approach

### 🚀 Contributing Code

Contributions are welcome! Here's how to get started:

**Before You Start:**
1. Check existing issues and pull requests to avoid duplicates
2. For large changes, open an issue first to discuss the approach
3. Ensure the change aligns with the project's scope and design

**Development Process:**
1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and commit with clear messages
4. **Test thoroughly** on your platform:
   - Run `npm run dev` for both frontend and backend
   - Test form validation and schema changes
   - Test plugin generation with various configurations
   - Build a generated plugin and test in a DAW (if possible)
5. **Test on other platforms** if possible (macOS/Linux especially appreciated!)
6. **Submit a pull request** with:
   - Clear description of changes
   - Reference any related issues (#123)
   - List of what you tested
   - Any breaking changes or migration notes

**Code Standards:**
- Follow the existing code style and formatting
- Comment complex logic
- Use meaningful variable and function names
- Keep components/modules focused and reusable
- Test edge cases and error scenarios

**Areas for Contribution:**
- 🐛 Bug fixes
- 📱 macOS and Linux platform improvements
- 🎨 UI/UX enhancements
- 📚 Documentation improvements
- 🧪 Test coverage expansion
- ➕ New plugin formats (AU, AAX, CLAP)
- 🎛️ New form field types
- 🚀 Performance improvements

### 📋 Contribution Guidelines

- **Be respectful** and constructive in discussions
- **Test your changes** thoroughly before submitting
- **Document your changes** in commits and pull requests
- **Keep pull requests focused** - one feature/fix per PR
- **Be responsive** to feedback and discussion
- **Respect the license** - all contributions will be under MIT license

### 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors page
- Project documentation (if applicable)
- Release notes for their contributions

Thank you for helping make JUCE Plugin Generator Studio better! 🎉

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
