# ⚡ Quick Start Guide

Get JUCE Plugin Generator Studio running in 5 minutes.

**⚠️ ALPHA VERSION** - See [Disclaimers](./README.md#-disclaimers--testing-notes) in README for important information.

## 1️⃣ Prerequisites

Make sure you have:
- **Node.js** 16+ ([download](https://nodejs.org/))
- **CMake** 3.24+ ([download](https://cmake.org/))
- **JUCE** 7.0.0+ (for building generated plugins)

Check installation:
```bash
node --version    # Should be 16+
npm --version     # Should be 7+
cmake --version   # Should be 3.24+
```

## 2️⃣ Clone & Setup

```bash
# Navigate to the JuceGenerator folder
cd JuceGenerator

# Install all dependencies (backend + frontend)
node setup.js
# or manually:
# cd backend && npm install
# cd frontend && npm install
# cd ..
```

## 3️⃣ Start the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
# You should see: "🎛️ JUCE Generator Backend running on http://localhost:5000"
```

### Terminal 2 - Frontend UI
```bash
cd frontend
npm run dev
# You should see: "VITE v5.0.7 ready in XXX ms"
# ➜ Local: http://localhost:3000/
```

## 4️⃣ Open in Browser

Navigate to: **http://localhost:3000**

You should see the JUCE Plugin Generator interface with a form on the left and help panel on the right.

## 5️⃣ Generate Your First Plugin

1. **Fill the form:**
   - Plugin Name: `MyFirstPlugin`
   - Company: `MyCompany`
   - Plugin Type: `Audio Effect`
   - Leave other options as default

2. **Set output directory:**
   - Click "Browse" or enter path manually
   - Example: `/Users/you/Projects` or `C:\Users\you\Projects`

3. **Click "✨ Generate Plugin Project"**

4. **Wait for success message**
   - Watch the logs scroll in the bottom panel
   - You'll see: `🎉 Generation complete!`

## 6️⃣ Build Your Plugin

After generation succeeds:

```bash
# Navigate to generated project
cd /path/to/MyFirstPlugin

# Create build folder
cmake -B build

# Compile the plugin
cmake --build build
```

✅ Your VST3 plugin is now in `build/MyFirstPlugin_artefacts/VST3/`

## 7️⃣ Test in DAW

1. Open your favorite DAW (Reaper, Ableton, Studio One, etc.)
2. Scan plugin folder: `build/MyFirstPlugin_artefacts/VST3/`
3. Load "MyFirstPlugin" in an effect or instrument slot
4. Test audio passthrough

## ⚠️ Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "Cannot connect to backend" | Make sure Terminal 1 (backend) is running |
| "Plugin won't load" | Check plugin code is exactly 4 characters |
| "CMake not found" | Install CMake from cmake.org and add to PATH |
| "JUCE not found" | Update CMakeLists.txt CMAKE_PREFIX_PATH |
| "Port 3000 in use" | Change port in `frontend/vite.config.js` |

## 📖 Next Steps

- **Customize your plugin:** Edit files in the generated project's `Source/` folder
- **Add parameters:** See `PluginProcessor.cpp` for examples
- **Build UI:** Modify `PluginEditor.cpp` with JUCE components
- **Advanced:** Read [DEVELOPMENT.md](./DEVELOPMENT.md) for extending the system

## 🎯 What You Just Did

✅ Set up a complete plugin generation system  
✅ Generated a production-ready VST3 template  
✅ Built a working audio plugin  
✅ Tested it in your DAW  

## 🎉 Congratulations!

You now have a powerful VST3 plugin development workflow. Happy coding! 🎵

---

**Need help?** Check [README.md](./README.md) for detailed documentation.
