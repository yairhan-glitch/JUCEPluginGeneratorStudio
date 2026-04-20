# 📚 Documentation Index

Welcome to JUCE Plugin Generator Studio! This file helps you navigate all the documentation.

## 🚀 Getting Started (Start Here!)

**👉 [QUICKSTART.md](./QUICKSTART.md)** - The fastest way to get up and running in 5 minutes
- Prerequisites checklist
- 7-step setup process
- First plugin generation
- Quick troubleshooting

**⚠️ [LICENSE.md](./LICENSE.md)** - Important legal information and disclaimers
- MIT License terms
- **Alpha release warning**
- **Liability disclaimers**
- **Your responsibilities**
- Third-party dependencies

**🧪 [TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Help us test on your platform!
- How to contribute test results
- Platform-specific testing scenarios
- Report templates
- How to submit feedback
- Known issues and workarounds

## 📖 Main Documentation

**📘 [README.md](./README.md)** - Complete system documentation
- System overview and architecture
- Feature highlights
- Installation instructions
- Usage guide with examples
- API reference
- Project structure
- Testing and troubleshooting
- Extensibility information
- Learning path for beginners/advanced users

**⚙️ [JUCE_SETUP.md](./JUCE_SETUP.md)** - JUCE installation and configuration
- How to install JUCE
- 4 methods to configure CMake for JUCE
- System-specific instructions (Windows/macOS/Linux)
- Verification and testing
- Troubleshooting build issues

**🔧 [DEVELOPMENT.md](./DEVELOPMENT.md)** - For developers extending the system
- Deep architecture explanation
- Schema system internals
- Generation flow overview
- Template engine documentation
- How to add new field types
- How to add new plugin formats
- Testing strategies
- Code style guidelines
- Common development tasks

**❓ [FAQ.md](./FAQ.md)** - Answers to common questions
- General questions about the project
- Setup and installation Q&A
- Usage questions
- After-generation help
- Schema customization
- Development and extension
- Performance optimization
- Troubleshooting solutions
- Best practices

## ⚖️ Important Legal & Disclaimers

**Before using this software, please read:**

**📋 [LICENSE.md](./LICENSE.md)** - License and legal disclaimers
- MIT License terms
- ⚠️ **ALPHA RELEASE DISCLAIMER** - Read this first!
- Liability limitations
- Your responsibilities
- Third-party license acknowledgments

**🧪 [TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Community testing initiative
- Help us test on macOS and Linux!
- Platform compatibility status
- How to report test results
- Testing scenarios and checklists
- Known issues and workarounds

## 🎯 By Use Case

### I want to...

**Generate my first plugin**
1. Read: [QUICKSTART.md](./QUICKSTART.md)
2. Reference: [README.md](./README.md) - "Usage Guide" section

**Build a generated plugin**
1. Check: [JUCE_SETUP.md](./JUCE_SETUP.md) - JUCE configuration
2. Reference: Generated project's own README.md

**Understand how the system works**
1. Start: [README.md](./README.md) - "System Architecture"
2. Deep dive: [DEVELOPMENT.md](./DEVELOPMENT.md)

**Extend the system with new features**
1. Read: [DEVELOPMENT.md](./DEVELOPMENT.md) - Full architecture
2. Reference: [README.md](./README.md) - "Extensibility" section
3. Check: Schema section in [DEVELOPMENT.md](./DEVELOPMENT.md)

**Customize the form fields**
1. Quick: [README.md](./README.md) - "Schema System"
2. Advanced: [DEVELOPMENT.md](./DEVELOPMENT.md) - "Schema System Deep Dive"

**Add support for new plugin formats (AU, AAX, etc.)**
1. Overview: [README.md](./README.md) - "Extensibility"
2. Guide: [DEVELOPMENT.md](./DEVELOPMENT.md) - "Adding New Plugin Format Support"
3. Example: Search "Adding AU (Audio Units) Support"

**Fix a problem**
1. First: [FAQ.md](./FAQ.md) - Search for your issue
2. Then: Relevant section in [README.md](./README.md) or [JUCE_SETUP.md](./JUCE_SETUP.md)
3. Advanced: Check backend logs and browser console

**Learn JUCE for plugin development**
1. Setup: [JUCE_SETUP.md](./JUCE_SETUP.md)
2. Generate: [QUICKSTART.md](./QUICKSTART.md)
3. Learn: [README.md](./README.md) - "Learning Path" section

**Contribute to the project**
1. Read: [DEVELOPMENT.md](./DEVELOPMENT.md)
2. Follow: Code style guidelines section
3. Test: Testing strategies section

**Understand the legal terms and disclaimers**
1. Read: [LICENSE.md](./LICENSE.md) - IMPORTANT!
2. Check: Alpha testing status in [README.md](./README.md)
3. Help: See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for your platform

**Report bugs or platform issues**
1. Check: [TESTING_GUIDE.md](./TESTING_GUIDE.md) for known issues
2. Read: Test report template in same document
3. Share: Create GitHub issue with your findings

## 📁 File Structure

```
JuceGenerator/
├── README.md              ← Main documentation (START HERE for full system overview)
├── QUICKSTART.md          ← Quick 5-minute setup (START HERE for fastest setup)
├── DEVELOPMENT.md         ← Developer guide (for extending system)
├── JUCE_SETUP.md          ← JUCE installation guide
├── FAQ.md                 ← Common questions and answers
├── INDEX.md               ← This file
│
├── backend/               ← Express server + generation engine
│   ├── server.js
│   ├── api/               ← API endpoints
│   ├── generators/        ← Generation logic and template engine
│   └── templates/         ← JUCE VST3 template files
│
├── frontend/              ← React web UI
│   ├── src/
│   │   ├── App.jsx        ← Main component
│   │   ├── components/    ← Form, Help, Status components
│   │   └── styles/        ← CSS styling
│   └── public/            ← HTML entry point
│
└── schema/
    └── pluginSchema.json  ← Form field definitions
```

## 🧭 Navigation Tips

- **New to the project?** Start with [QUICKSTART.md](./QUICKSTART.md)
- **Want full details?** Read [README.md](./README.md)
- **Building doesn't work?** Check [JUCE_SETUP.md](./JUCE_SETUP.md)
- **Have a question?** Search [FAQ.md](./FAQ.md)
- **Want to extend it?** Read [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Can't find something?** Use Ctrl+F (or Cmd+F) in each document

## 🔑 Key Concepts to Understand

### Schema-Driven Design
The form UI is generated from `schema/pluginSchema.json`. No UI code needs to change when adding fields.
→ Learn more: [README.md](./README.md) - "Schema System"

### Safe Template Engine
Generated code uses deterministic placeholder replacement, not regex.
→ Learn more: [DEVELOPMENT.md](./DEVELOPMENT.md) - "Template System"

### Three-Layer Architecture
- **Frontend**: React web GUI
- **Backend**: Express generation engine  
- **Template**: JUCE VST3 boilerplate

→ Learn more: [README.md](./README.md) - "System Architecture"

### Extensibility First
New formats, field types, and features don't require core rewrites.
→ Learn more: [README.md](./README.md) - "Extensibility"

## 📱 Quick Reference

### Common Commands

```bash
# Setup
node setup.js

# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev

# Generate a plugin
# Open http://localhost:3000 in browser

# Build a generated plugin
cd MyPlugin
cmake -B build
cmake --build build
```

### Key Files

| File | Purpose |
|------|---------|
| `schema/pluginSchema.json` | Form field definitions |
| `backend/generators/projectGenerator.js` | Main generation logic |
| `backend/generators/templateEngine.js` | Safe template replacement |
| `backend/templates/juce_vst3/` | JUCE template |
| `frontend/src/App.jsx` | Main React component |
| `frontend/src/components/FormRenderer.jsx` | Dynamic form |

### Important Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/schema` | Load form schema |
| `POST /api/generate` | Generate plugin |
| `http://localhost:3000` | Frontend UI |
| `http://localhost:5000/api` | Backend API |

## 🎓 Learning Paths

### Beginner (Generating plugins)
1. [QUICKSTART.md](./QUICKSTART.md) - Get it running
2. [README.md](./README.md) - "Usage Guide" section
3. [FAQ.md](./FAQ.md) - Common questions

### Intermediate (Customizing plugins)
1. [README.md](./README.md) - "Generated Plugin Structure"
2. [README.md](./README.md) - "Learning Path" → "For Intermediate"
3. Generated project's README.md

### Advanced (Extending the system)
1. [DEVELOPMENT.md](./DEVELOPMENT.md) - Full architecture
2. [README.md](./README.md) - "Extensibility"
3. Review source code comments

### JUCE Developer
1. [JUCE_SETUP.md](./JUCE_SETUP.md) - Setup JUCE
2. [QUICKSTART.md](./QUICKSTART.md) - Generate plugin
3. [README.md](./README.md) - "JUCE Resources" section

## 🆘 Troubleshooting Flow

1. **Can't get it running?**
   → Check [QUICKSTART.md](./QUICKSTART.md) - "Troubleshooting"

2. **Build fails?**
   → Check [JUCE_SETUP.md](./JUCE_SETUP.md) - "Troubleshooting JUCE Setup"

3. **Plugin won't load?**
   → Check [FAQ.md](./FAQ.md) - "After Generation" section

4. **Question about forms/fields?**
   → Check [FAQ.md](./FAQ.md) - "Using the Generator" section

5. **Want to add a feature?**
   → Check [DEVELOPMENT.md](./DEVELOPMENT.md) - "Common Tasks"

## 📞 Support Resources

| Need | Resource |
|------|----------|
| Getting started | [QUICKSTART.md](./QUICKSTART.md) |
| Full documentation | [README.md](./README.md) |
| Development guide | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| JUCE setup help | [JUCE_SETUP.md](./JUCE_SETUP.md) |
| Common questions | [FAQ.md](./FAQ.md) |
| System architecture | [README.md](./README.md) → "System Architecture" |
| API reference | [README.md](./README.md) → "Backend API Reference" |

## 🎉 Ready to Start?

1. **First time?** → [QUICKSTART.md](./QUICKSTART.md)
2. **Need more info?** → [README.md](./README.md)
3. **Have questions?** → [FAQ.md](./FAQ.md)
4. **Ready to code?** → [DEVELOPMENT.md](./DEVELOPMENT.md)

---

**Happy plugin development! 🎵**

**Last Updated:** April 19, 2026  
**Version:** 1.0.0 - Production Ready
