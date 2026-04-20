# ❓ Frequently Asked Questions

## General Questions

### Q: What is JUCE Plugin Generator Studio?

A: It's a web-based application that generates production-ready VST3 audio plugin projects. Instead of manually creating boilerplate code, you fill out a form and get a complete, CMake-ready plugin that compiles immediately.

### Q: Do I need JUCE installed to run the generator?

A: No, the generator runs independently on your computer. You only need JUCE when **building** the generated plugin projects.

### Q: Can I use this generator without internet?

A: Yes! The entire system runs locally on your machine. No cloud dependencies.

### Q: What platforms does this support?

A: Windows, macOS, and Linux. Generated plugins target VST3 format (cross-platform compatible).

---

## Setup & Installation

### Q: I got "Node.js not found" error. What do I do?

A: Install Node.js from https://nodejs.org/ (version 16 or newer). Then restart your terminal.

### Q: How do I know if CMake is installed?

A: Open terminal/command prompt and run:
```bash
cmake --version
```

If you get a version number, you're good. If not, install from https://cmake.org/

### Q: Where should I install JUCE?

A: Anywhere convenient. Common locations:
- **Windows:** `C:\JUCE` or `C:\dev\JUCE`
- **macOS:** `/Users/you/Developer/JUCE` or `/usr/local/JUCE`
- **Linux:** `/home/you/JUCE` or `/usr/local/JUCE`

See [JUCE_SETUP.md](./JUCE_SETUP.md) for detailed instructions.

### Q: Port 3000 is already in use. How do I fix this?

A: Edit `frontend/vite.config.js` and change the port:
```javascript
server: {
  port: 3001,  // Change from 3000 to 3001
  // ...
}
```

Then access the application at `http://localhost:3001`

### Q: What if I get "EACCES: permission denied" during npm install?

A: You might have Node.js permission issues. Try:
```bash
# Clear npm cache
npm cache clean --force

# Install with sudo (not ideal but works)
sudo npm install

# OR use nvm for better Node.js management
```

---

## Using the Generator

### Q: What do I put in "Plugin Name"?

A: A descriptive name for your plugin. Use only letters, numbers, and underscores.
- ✅ Good: `MyCompressor`, `VerbPlus`, `SynthWave_Pro`
- ❌ Bad: `My Plugin!`, `Synth@`, `123start`

### Q: Should I use auto-generated plugin code or enter my own?

A: For most cases, use "AUTO" and let the system generate a unique code. Only specify a code if you have a specific identifier requirement.

### Q: What does "Plugin Type" mean?

A: 
- **Audio Effect:** Processes incoming audio (compressor, reverb, EQ, etc.)
- **Synth/Instrument:** Generates audio from MIDI input (keyboard plugin, drum machine, etc.)

### Q: What is MIDI input/output?

A: 
- **MIDI Input:** Receives note/control data from the DAW
- **MIDI Output:** Sends note/control data back to the DAW
  
Most effects don't need this. Synths typically need input.

### Q: How many voices should I use for my synth?

A: It controls how many notes can play simultaneously:
- 8 voices: Most cases, good CPU balance
- 16+ voices: For pad/ambient sounds
- 1 voice: Monophonic instruments
- 128+ voices: For special effects (uses more CPU)

### Q: Where should I save the generated project?

A: Anywhere on your computer. Common choices:
- `~/Music/Plugins/` (macOS)
- `~/My Music/Plugins/` (Windows)
- `~/Projects/AudioPlugins/` (Linux)

Avoid paths with spaces if possible.

---

## After Generation

### Q: I got "CMake not found" error when building

A: Install CMake from https://cmake.org/ and add it to your system PATH.

Then try again:
```bash
cd MyPlugin
cmake -B build
cmake --build build
```

### Q: How long does the build take?

A: First build: 1-5 minutes depending on your system
Subsequent builds: 10-30 seconds (incremental)

### Q: Where is my VST3 plugin after building?

A: Look for it in: `MyPlugin/build/MyPlugin_artefacts/VST3/MyPlugin.vst3`

### Q: How do I use my plugin in my DAW?

A: 
1. Tell your DAW to scan the plugin folder
2. Restart DAW
3. Search for your plugin name
4. Insert it on an audio track or MIDI track (depending on type)

### Q: My plugin won't load in the DAW

A: Check:
- [ ] Plugin is 64-bit (most DAWs)
- [ ] Plugin code is exactly 4 characters
- [ ] DAW scanned the plugin folder
- [ ] DAW was restarted after scanning
- [ ] Build succeeded without errors

Try building again and checking the build output.

### Q: How do I customize the generated plugin?

A: Edit the source files in your generated project:
- `Source/PluginProcessor.cpp` - Audio processing logic
- `Source/PluginEditor.cpp` - GUI and controls
- `CMakeLists.txt` - Build configuration

See README.md in your generated project for examples.

---

## Schema & Form Customization

### Q: How do I add a new field to the form?

A: Edit `schema/pluginSchema.json`:

```json
{
  "id": "myNewField",
  "type": "text",
  "label": "My New Field",
  "required": false,
  "help": {
    "short": "Short description",
    "long": "Long description"
  }
}
```

The frontend will automatically display it!

### Q: How do I make a field required?

A: Set `"required": true` in the schema:
```json
{
  "id": "pluginName",
  "type": "text",
  "required": true
}
```

### Q: How do I add validation rules?

A: Use the `"validation"` object:
```json
{
  "id": "numVoices",
  "type": "number",
  "validation": {
    "min": 1,
    "max": 256
  }
}
```

### Q: How do I make a field appear/disappear based on other fields?

A: Use `"visibleIf"`:
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

This field only shows when pluginType is "effect".

---

## Development & Extension

### Q: How do I add support for AU (Audio Units)?

A: 
1. Create `backend/templates/juce_au/` with AU-specific template
2. Add field to schema for format selection
3. Update `projectGenerator.js` to choose template based on format
4. Update CMakeLists.txt template to configure AU instead of VST3

See [DEVELOPMENT.md](./DEVELOPMENT.md) for details.

### Q: Can I add new field types to the form?

A: Yes! 
1. Update schema.json with new type
2. Add rendering logic to FormRenderer.jsx
3. Add validation to projectGenerator.js
4. Add placeholder support if needed in templateEngine.js

### Q: How do I modify generated code without editing the template?

A: You can't do this easily right now, but you could:
1. Generate the project
2. Edit the source files directly
3. Keep your custom project as a template
4. Re-use it for future plugins

Or:
1. Extend the schema with more options
2. Add those options to the template as placeholders
3. They'll appear in all future generations

---

## Troubleshooting

### Q: "Cannot GET /api/schema" - what does this mean?

A: The backend isn't running. Make sure Terminal 1 has backend running:
```bash
cd backend
npm run dev
```

### Q: Form fields are not appearing

A: Try:
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors (F12)
3. Verify schema.json is valid JSON (no syntax errors)
4. Restart frontend: Ctrl+C, then `npm run dev`

### Q: Generation starts but never finishes

A: The output path might be invalid:
1. Check path exists and is writable
2. Try a different path (like Desktop or Documents)
3. Check backend logs (Terminal 1) for error details

### Q: CMake says "juce_add_plugin not found"

A: JUCE isn't found. Fix by:
1. Verify JUCE is installed
2. Set CMAKE_PREFIX_PATH correctly (see JUCE_SETUP.md)
3. Try absolute path, not relative
4. Verify JUCE/cmake/ folder exists

### Q: Project builds but crashes when loaded in DAW

A: Likely issues:
1. Plugin code not exactly 4 chars
2. Processor initializer list incomplete
3. Mismatch between declared and actual channels

Check generated PluginProcessor.cpp for any TODOs.

### Q: How do I see detailed error messages?

A: 
1. Check Status Panel in generator UI
2. Look at backend console (Terminal 1)
3. Check DAW plugin loading log

### Q: I deleted files by accident - how do I recover?

A: Regenerate the project:
1. Same output folder (project will recreate files)
2. Or choose new folder and regenerate

### Q: The app froze - what do I do?

A: 
1. Close the browser tab
2. Stop frontend server (Ctrl+C in Terminal 2)
3. Stop backend server (Ctrl+C in Terminal 1)
4. Restart both
5. Refresh browser

---

## Performance & Optimization

### Q: Generating takes a long time - is this normal?

A: First generation: 5-10 seconds  
Subsequent: 1-3 seconds  

If much slower, check:
- Disk I/O speed
- Antivirus scanning (disable for project folder)
- Output drive is not full

### Q: Can I generate multiple plugins at once?

A: The UI doesn't support it, but you could:
1. Generate one plugin
2. Keep the browser tab open
3. Generate another by filling new form data
4. Each gets its own project folder

### Q: How do I batch generate plugins?

A: You could write a script:
```javascript
const axios = require('axios');

const configs = [
  { pluginName: "Plugin1", ... },
  { pluginName: "Plugin2", ... },
];

configs.forEach(config => {
  axios.post('http://localhost:5000/api/generate', config)
    .then(res => console.log(res.data))
});
```

---

## Best Practices

### Q: What's a good plugin development workflow?

A:
1. Generate a plugin with baseline features
2. Build and test it works
3. Commit to git
4. Make incremental changes to source
5. Rebuild and test
6. Use version control for your edits

### Q: Should I version control the generated files?

A: Yes! Treat it like any other project:
```bash
cd MyPlugin
git init
git add .
git commit -m "Initial plugin generation"
```

### Q: Can I generate multiple versions of the same plugin?

A: Yes, generate with slightly different names:
- MyPlugin_v1
- MyPlugin_v2
- MyPlugin_experimental

Each gets its own folder and can be developed independently.

### Q: How do I update a plugin if the template changes?

A: Currently, you'd need to:
1. Regenerate with new template
2. Manually merge your changes
3. Or continue using old version

In future, the tool might support update checking.

---

## Getting Help

### Q: Where can I find documentation?

A: 
- README.md - Full system overview
- QUICKSTART.md - Quick setup guide
- DEVELOPMENT.md - Technical deep dive
- JUCE_SETUP.md - JUCE installation
- This file (FAQ.md) - Common questions

### Q: How do I report bugs?

A: Create an issue with:
1. What you were trying to do
2. What error you got
3. Steps to reproduce
4. Your system (OS, Node version, etc.)

### Q: Can I contribute improvements?

A: Yes! See DEVELOPMENT.md for contribution guidelines.

### Q: Where can I learn more about JUCE?

A: 
- [docs.juce.com](https://docs.juce.com/)
- [JUCE Forum](https://forum.juce.com/)
- [Official tutorials](https://docs.juce.com/master/md_docs_learn.html)

### Q: How do I report security issues?

A: Please don't post security issues publicly. Contact the maintainers directly.

---

## Still Have Questions?

1. Check README.md for comprehensive overview
2. Review DEVELOPMENT.md for technical details
3. Check backend logs (Terminal 1) for errors
4. Check frontend browser console (F12)
5. Try generating a simple test plugin
6. Verify JUCE installation (see JUCE_SETUP.md)

---

**Happy plugin development! 🎵**
