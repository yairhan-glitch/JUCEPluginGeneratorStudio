# 🎼 JUCE Setup Guide

This guide helps you install and configure JUCE for building generated VST3 plugins.

## 📥 Installing JUCE

### Option 1: Clone from GitHub (Recommended)

```bash
# Clone latest JUCE
git clone https://github.com/juce-framework/JUCE.git
cd JUCE
git checkout main  # or specific version like 7.0.10

# Note the path - you'll need it later
echo %CD%  # Windows
pwd       # macOS/Linux
```

### Option 2: Download Release

1. Visit [juce.com/download](https://juce.com/download)
2. Download JUCE 7.0.0 or later
3. Extract to a location, note the path

## ⚙️ Configure CMake to Find JUCE

Generated projects need CMake to locate JUCE. There are several ways:

### Method 1: Environment Variable (Easiest)

Set `CMAKE_PREFIX_PATH` environment variable:

**Windows:**
```cmd
set CMAKE_PREFIX_PATH=C:\path\to\JUCE
```

**macOS/Linux:**
```bash
export CMAKE_PREFIX_PATH=/path/to/JUCE
```

Then build:
```bash
cmake -B build
cmake --build build
```

### Method 2: Pass on Command Line

```bash
cmake -B build -DCMAKE_PREFIX_PATH=/path/to/JUCE
cmake --build build
```

### Method 3: Edit CMakeLists.txt (Per Project)

In your generated project's `CMakeLists.txt`:

```cmake
# Add this after cmake_minimum_required
set(CMAKE_PREFIX_PATH "/path/to/JUCE" ${CMAKE_PREFIX_PATH})

# Then use find_package as usual
find_package(JUCE CONFIG REQUIRED)
```

### Method 4: CMake User Preset (Advanced)

Create `CMakeUserPresets.json` in your project:

```json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "default",
      "cacheVariables": {
        "CMAKE_PREFIX_PATH": "/path/to/JUCE"
      }
    }
  ]
}
```

Then: `cmake --preset=default -B build`

## 🔍 Verify JUCE Installation

### Quick Test

```bash
# Navigate to JUCE directory
cd /path/to/JUCE

# Check CMake can find JUCE
cmake --find-package JUCE
```

### Test Build Example

```bash
# Build a JUCE example to verify setup
cd /path/to/JUCE/examples/Projucer

mkdir build
cd build
cmake -B . -DCMAKE_PREFIX_PATH=/path/to/JUCE
cmake --build .
```

If this succeeds, JUCE is properly installed.

## 📋 System-Specific Instructions

### Windows (MSVC 2022)

1. **Install Visual Studio 2022** with C++ development tools
2. **Install CMake** 3.24+ via Visual Studio Installer or cmake.org
3. **Clone JUCE** to `C:\dev\JUCE` (or your preferred location)
4. **Set environment variable:**
   ```cmd
   setx CMAKE_PREFIX_PATH "C:\dev\JUCE"
   ```
5. **Restart Command Prompt** and verify:
   ```cmd
   cmake --version
   ```

### macOS (Xcode/Clang)

1. **Install Xcode Command Line Tools:**
   ```bash
   xcode-select --install
   ```
2. **Install CMake:**
   ```bash
   brew install cmake
   ```
3. **Install JUCE:**
   ```bash
   git clone https://github.com/juce-framework/JUCE.git ~/Developer/JUCE
   ```
4. **Add to shell profile** (`~/.zshrc` or `~/.bash_profile`):
   ```bash
   export CMAKE_PREFIX_PATH=~/Developer/JUCE
   ```
5. **Reload shell:**
   ```bash
   source ~/.zshrc
   ```

### Linux (GCC 11+)

1. **Install build tools:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install build-essential cmake git

   # Fedora
   sudo dnf install gcc-c++ cmake git
   ```
2. **Clone JUCE:**
   ```bash
   git clone https://github.com/juce-framework/JUCE.git ~/JUCE
   ```
3. **Add to `~/.bashrc`:**
   ```bash
   export CMAKE_PREFIX_PATH=~/JUCE
   ```
4. **Reload:**
   ```bash
   source ~/.bashrc
   ```

## 🛠️ Troubleshooting JUCE Setup

### CMake can't find JUCE

```bash
# Check if JUCE path exists
ls /path/to/JUCE/CMakeLists.txt

# Add debug output to CMakeLists.txt
message(STATUS "CMAKE_PREFIX_PATH: ${CMAKE_PREFIX_PATH}")
```

### "juce_add_plugin not found"

This means JUCE CMake files weren't found. 

Fix:
```bash
# Verify JUCE directory structure
ls /path/to/JUCE/cmake/*.cmake

# Make sure to use absolute path, not relative
# Bad: -DCMAKE_PREFIX_PATH=../JUCE
# Good: -DCMAKE_PREFIX_PATH=/full/path/to/JUCE
```

### Module linking errors

Generated CMakeLists.txt should have all needed modules. If you get linking errors:

1. Check JUCE installation is complete
2. Verify compiler version (C++17 minimum)
3. Try clean rebuild:
   ```bash
   rm -rf build/
   cmake -B build -DCMAKE_PREFIX_PATH=/path/to/JUCE
   cmake --build build --clean-first
   ```

## 🎯 Recommended Setup

For most users, this setup works best:

1. **Install JUCE globally:**
   ```bash
   # macOS/Linux
   git clone https://github.com/juce-framework/JUCE.git /usr/local/JUCE
   
   # Windows
   git clone https://github.com/juce-framework/JUCE.git C:\JUCE
   ```

2. **Set environment variable permanently**

3. **Build generated plugins:**
   ```bash
   cd MyPlugin
   cmake -B build
   cmake --build build
   ```

## 🚀 What Happens During Build

When you run `cmake --build build`:

1. CMake finds JUCE via `CMAKE_PREFIX_PATH`
2. JUCE CMake files configure plugin metadata
3. Source files compiled with JUCE headers
4. Linker combines with JUCE library modules
5. VST3 binary created in `build/MyPlugin_artefacts/VST3/`

## 📚 JUCE Documentation

- [Official JUCE Docs](https://docs.juce.com/)
- [CMake Integration](https://docs.juce.com/master/md_docs_modules_juce_create_cmake.html)
- [Building Plugins](https://docs.juce.com/master/tutorial_build_an_audio_plugin.html)

## ✅ Verification Checklist

Before generating plugins:

- [ ] JUCE installed and `CMakeLists.txt` exists
- [ ] CMake can find JUCE: `cmake --find-package JUCE`
- [ ] C++17 compiler installed (MSVC 2022, Clang 10+, GCC 9+)
- [ ] Environment variable set (if using Method 1)
- [ ] Test build succeeds: `cmake -B build && cmake --build build`

## 🎉 Ready to Go!

Once JUCE is properly configured, generated plugins will:

✅ Configure automatically  
✅ Build without manual fixes  
✅ Compile clean VST3 binaries  
✅ Work immediately in DAWs  

---

**Questions?** Check the generated plugin's README.md for build instructions.
