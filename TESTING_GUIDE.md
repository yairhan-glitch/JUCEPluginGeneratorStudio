# 🧪 Testing Guide - Help Us Test on Your Platform!

**This is an alpha-stage project and we appreciate your help testing it on different platforms!**

This guide explains how to test JUCE Plugin Generator Studio and report your results.

---

## 📋 Pre-Testing Checklist

Before you start testing, ensure you have:

- [ ] Node.js 16+ installed
- [ ] npm 7+ installed  
- [ ] CMake 3.24+ installed
- [ ] C++ compiler for your platform (MSVC, Clang, GCC)
- [ ] JUCE 7.0.0+ downloaded and accessible
- [ ] A text editor or IDE
- [ ] A DAW for testing generated plugins (Reaper, Studio One, Logic Pro, etc.)

---

## 🎯 Test Scenario 1: Generation (REQUIRED)

This basic test verifies the generator works on your platform.

### Steps

1. **Start the application:**
   ```bash
   cd JuceGenerator
   
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2 (new)
   cd frontend && npm run dev
   ```

2. **Open in browser:** http://localhost:3000

3. **Fill form with defaults:**
   - Plugin Name: `TestPlugin`
   - Company Name: `TestCompany`
   - Leave other fields as default
   - Note: Output path may use ~/Documents/JucePlugins if not specified

4. **Generate plugin:**
   - Click "✨ Generate Plugin Project"
   - Watch the status panel for logs
   - Verify success message appears

5. **Check output:**
   - Navigate to output directory
   - Verify these files exist:
     ```
     TestPlugin/
     ├── CMakeLists.txt
     ├── Source/
     │   ├── PluginProcessor.h
     │   ├── PluginProcessor.cpp
     │   ├── PluginEditor.h
     │   └── PluginEditor.cpp
     └── .gitignore
     ```

### Report Results

✅ **Success:** If files exist and are readable  
❌ **Failure:** If generation fails or files are missing

---

## 🏗️ Test Scenario 2: CMake Build (REQUIRED)

This test verifies generated plugins can compile.

### Steps

1. **Navigate to generated plugin:**
   ```bash
   cd path/to/TestPlugin
   ```

2. **Configure CMake build:**
   ```bash
   # If JUCE is system-wide installed:
   cmake -B build
   
   # If JUCE is local:
   cmake -B build -DCMAKE_PREFIX_PATH=/path/to/JUCE/install
   ```

3. **Check configuration:**
   - Look for errors in output
   - Verify it says "Configuring done"
   - Note any warnings

4. **Build the plugin:**
   ```bash
   cmake --build build
   ```

5. **Check build output:**
   - Look for errors or warnings
   - Verify build completes
   - Check for VST3 in:
     ```
     build/TestPlugin_artefacts/VST3/TestPlugin.vst3
     ```

### Report Results

✅ **Success:** VST3 file exists and is non-zero size  
⚠️ **Warnings:** Build succeeds but has warnings (report them)  
❌ **Failure:** Build fails or crashes

---

## 🎛️ Test Scenario 3: DAW Loading (RECOMMENDED)

This test verifies the generated plugin loads in a real DAW.

### Prerequisites

- DAW installed (any VST3-compatible DAW works)
- Studio One, Reaper, Logic Pro, Ableton, etc.

### Steps

1. **Locate VST3 plugin directory:**
   ```
   # Windows
   %APPDATA%\Local\Programs\Common\VST3\
   
   # macOS
   ~/Library/Audio/Plug-Ins/VST3/
   
   # Linux
   ~/.vst3/
   ```

2. **Copy generated VST3 file:**
   ```bash
   # Example for Windows
   cp build/TestPlugin_artefacts/VST3/TestPlugin.vst3 \
      "%APPDATA%\Local\Programs\Common\VST3\"
   ```

3. **Open DAW and create new project**

4. **Scan for plugins:**
   - Open plugin browser
   - Search for "TestPlugin"
   - Verify it appears in list

5. **Load as effect:**
   - Add audio track
   - Insert TestPlugin as effect
   - Verify editor window opens
   - Test if audio passes through (should be unchanged)

6. **Test bypass:**
   - Enable/disable bypass toggle
   - Verify audio continues uninterrupted

### Report Results

✅ **Success:** Plugin loads, editor opens, audio passes, bypass works  
⚠️ **Partial:** Plugin loads but editor is blank or bypass doesn't work  
❌ **Failure:** Plugin won't load or crashes DAW

---

## 📝 Test Report Template

When reporting test results, please include:

```markdown
## Platform Test Report

**Platform:** [OS Name and Version]  
**Node.js Version:** [Output of `node --version`]  
**npm Version:** [Output of `npm --version`]  
**CMake Version:** [Output of `cmake --version`]  
**Compiler:** [MSVC 2022 / Clang 14 / GCC 11 / etc.]  
**JUCE Version:** [JUCE version used]  
**DAW:** [Test DAW, version]  

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| Generation | ✅/⚠️/❌ | Any issues encountered? |
| CMake Config | ✅/⚠️/❌ | Any warnings or errors? |
| CMake Build | ✅/⚠️/❌ | Build time, any issues? |
| DAW Loading | ✅/⚠️/❌ | Plugin list appearance, editor state |
| Audio Pass-Through | ✅/⚠️/❌ | Audio unchanged? |
| Bypass Control | ✅/⚠️/❌ | Bypass toggle working? |

### Errors or Warnings

[Copy/paste any error messages or warnings here]

### Additional Notes

[Any other observations or suggestions]
```

---

## 🔗 How to Submit Your Test Results

### Via GitHub Issues

1. Go to the repository
2. Click "New Issue"
3. Title: `Platform Test: [Your OS]`
4. Paste the test report template above
5. Add any error logs or screenshots

### Via GitHub Discussions

1. Start a new discussion in the "Testing" category
2. Include your test report
3. Engage with maintainers and other testers

---

## 🆘 Troubleshooting During Tests

### CMake Error: "JUCE not found"

**Solution:** Set CMAKE_PREFIX_PATH:
```bash
cmake -B build -DCMAKE_PREFIX_PATH=/path/to/JUCE/install
```

### Build Error: "Unknown module X"

**Solution:** Ensure all JUCE modules are installed. Check CMakeLists.txt for required modules.

### VST3 File Not Generated

**Solution:** Check build log for errors. May need to manually copy VST3 bundle:
```bash
# Check if it exists
find build -name "*.vst3" -type d
```

### DAW Won't Scan Plugin

**Solution:** 
- Verify VST3 folder location for your DAW
- Copy plugin to correct directory
- Restart DAW and re-scan plugins
- Check file permissions (should be readable)

### Plugin Loads But Editor is Blank

**Solution:** 
- This is expected for the basic generated template
- Open DevTools in VST3 wrapper if available
- Check for rendering errors

---

## 🎓 Advanced Testing

### Testing with Custom Configurations

Try generating plugins with different settings:

1. **Synth Plugin:**
   - Set isSynth: ON
   - Enable needsMidiInput: ON
   - Observe VST3_CATEGORIES: defaults to "Instrument Synth"

2. **Multi-format Plugin:**
   - Select multiple formats: VST3, AU, AAX
   - Verify CMakeLists.txt has all formats (if your platform supports them)

3. **With Permissions (macOS/iOS):**
   - Enable microphonePermissionEnabled
   - Verify permission text in generated plist

### Performance Testing

- Measure generation time
- Note build time
- Monitor memory usage during compilation
- Report any unusual spikes or hangs

### Edge Case Testing

Try these unusual inputs:
- Very long plugin names (100+ characters)
- Special characters in company name
- Unusual version strings
- Extreme voice counts for synths

---

## 📊 Test Results Aggregation

Your test results help us create a compatibility matrix:

| Platform | Gen ✅ | Build ✅ | Load ✅ | Audio ✅ | Notes |
|----------|--------|---------|--------|---------|-------|
| Win11/MSVC | ✅ | ✅ | ✅ | ✅ | Main platform |
| macOS 13/Clang | ? | ? | ? | ? | Needs testing! |
| Ubuntu 22/GCC | ? | ? | ? | ? | Needs testing! |

---

## 🙏 Thank You!

**Your testing helps make this tool production-ready!**

Every bug report, successful test, and platform confirmation moves us closer to a stable release.

If you have questions during testing:
- Create an issue on GitHub
- Ask in the discussions forum
- Check existing issues for similar problems

Happy testing! 🧪

---

**Remember:** This is alpha software. If something breaks during testing, that's valuable information! Please report it so we can fix it. 💪
