# 🔧 JUCE Plugin Generator - Development Guide

This guide is for developers extending or modifying the JUCE Plugin Generator Studio system.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  - App.jsx: Main component, state management                │
│  - FormRenderer: Dynamic form from schema                   │
│  - HelpPanel: Contextual help viewer                        │
│  - StatusPanel: Generation status & logs                    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js)                          │
│  - server.js: Express app setup                             │
│  - api/schema.js: Load schema endpoint                      │
│  - api/generate.js: Start generation process               │
│  - generators/projectGenerator.js: Validation & orchestrate │
│  - generators/templateEngine.js: Safe placeholder replace   │
│  - templates/juce_vst3/: Template files                     │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Schema System Deep Dive

### Schema Structure

```
schema/pluginSchema.json
├── groups[] (visual groupings)
│   ├── id: unique identifier
│   ├── label: display name
│   ├── description: helper text
│   └── fields[] (form fields)
│       ├── id: unique field identifier
│       ├── type: text|number|select|checkbox|filePath
│       ├── label: display label
│       ├── required: boolean
│       ├── default: default value
│       ├── validation: {minLength, maxLength, pattern, min, max}
│       ├── help: {short, long}
│       └── visibleIf: conditional visibility rule
```

### Field Types

**text** - String input with optional validation  
**number** - Numeric input with min/max  
**select** - Dropdown with predefined options  
**checkbox** - Boolean toggle  
**filePath** - Directory/file path picker  

### Adding New Field Types

1. **Update Schema** - Add to pluginSchema.json with `"type": "newType"`

2. **Frontend Update** (FormRenderer.jsx):
```jsx
case 'newType':
  inputElement = (
    <input 
      type="..."
      value={value}
      onChange={(e) => onFieldChange(field.id, e.target.value)}
    />
  )
  break
```

3. **Backend Validation** (projectGenerator.js):
```javascript
if (field.type === 'newType') {
  if (typeof value !== 'string') {
    errors.push(`${fieldId}: must be a string`)
  }
  // Add specific validation rules
}
```

4. **Template Support** - If used in template, add placeholder to templateEngine.js

## 🔄 Generation Flow

```
User clicks "Generate"
    ↓
Frontend validates form data
    ↓
POST /api/generate with formData
    ↓
Backend: Load schema
    ↓
Backend: Validate config against schema
    ↓
Backend: Generate plugin code (AUTO code if needed)
    ↓
Backend: Create output directory
    ↓
Backend: Copy template to project dir
    ↓
Backend: Replace all placeholders
    ↓
Backend: Return logs & project path
    ↓
Frontend: Display success/error in StatusPanel
```

## 🧩 Template System

### Safe Placeholder Replacement

Located in: `backend/generators/templateEngine.js`

Features:
- Deterministic (same input = same output)
- No regex chaos (exact string matching)
- Case transformations built-in
- Identifier sanitization

### Placeholder Types

```
{{PLUGIN_NAME}}              - Original name
{{PLUGIN_NAME_UPPER}}        - UPPERCASE
{{PLUGIN_NAME_LOWER}}        - lowercase
{{PLUGIN_NAME_IDENTIFIER}}   - Valid C++ identifier
{{PLUGIN_CODE}}              - 4-char code
{{COMPANY_NAME}}             - Company name
{{PLUGIN_TYPE}}              - "effect" or "synth"
{{IS_SYNTH}}                 - 1 or 0
{{MIDI_INPUT}}               - 1 or 0
{{MIDI_OUTPUT}}              - 1 or 0
{{NUM_VOICES}}               - Voice count
{{ENABLE_GUI}}               - 1 or 0
{{ENABLE_BYPASS}}            - 1 or 0
{{VST3_ENABLED}}             - 1 or 0
```

### Adding New Placeholders

1. **templateEngine.js** - Add to `replacePlaceholders()`:
```javascript
'{{NEW_PLACEHOLDER}}': values.newField,
'{{NEW_PLACEHOLDER_UPPER}}': values.newField.toUpperCase(),
```

2. **projectGenerator.js** - Add to `templateValues`:
```javascript
const templateValues = {
  // ... existing values
  newField: config.newFieldValue
}
```

3. **Use in Templates** - Add to CMakeLists.txt or source files:
```cmake
# Example in CMakeLists.txt
set(NEW_SETTING {{NEW_PLACEHOLDER}})
```

## 🎨 Frontend Components

### App.jsx

Main component managing:
- Schema loading
- Form state
- Generation state
- Status display

Key functions:
- `loadSchema()` - Fetch schema from backend
- `handleFieldChange()` - Update form value
- `handleGenerate()` - Trigger backend generation

### FormRenderer.jsx

Dynamic form component taking:
- `schema` - Schema definition
- `formData` - Current form values
- `onFieldChange` - Callback for value changes
- `isGenerating` - Disable form during generation

Features:
- Conditional field visibility
- Dynamic field type rendering
- Validation display

### HelpPanel.jsx

Context-aware help displaying:
- Field documentation
- Validation rules
- Available options
- Visibility conditions
- Tips & examples

### StatusPanel.jsx

Generation status display showing:
- Real-time logs
- Success/error indicators
- Project path & copy button
- Build instructions
- VS Code integration button

## 🔌 Adding New Plugin Format Support

### Example: Adding AU (Audio Units) Support

1. **Schema** (`schema/pluginSchema.json`):
```json
{
  "id": "targetFormats",
  "type": "select",
  "options": [
    {"label": "VST3", "value": "vst3"},
    {"label": "Audio Units", "value": "au"}
  ]
}
```

2. **Template** (`backend/templates/juce_au/`):
```
juce_au/
├── CMakeLists.txt       (AU-specific config)
├── Source/              (same as VST3)
│   ├── PluginProcessor.h
│   ├── PluginProcessor.cpp
│   ├── PluginEditor.h
│   └── PluginEditor.cpp
└── .gitignore
```

3. **Generator** (`projectGenerator.js`):
```javascript
const templateSource = config.targetFormat === 'au'
  ? path.join(__dirname, '../templates/juce_au')
  : path.join(__dirname, '../templates/juce_vst3')
```

4. **CMakeLists.txt Update**:
```cmake
juce_add_plugin({{PLUGIN_NAME_IDENTIFIER}}
  FORMATS {{#if AU}}AU{{/if}}{{#if VST3}}VST3{{/if}}
)
```

## 🧪 Testing

### Frontend Testing

```bash
cd frontend

# Run development server with hot reload
npm run dev

# Test schema loading
# Navigate to http://localhost:3000
# Check browser console for errors

# Test form validation
# Fill partially and check validation messages

# Test conditional fields
# Select different plugin types to see field changes
```

### Backend Testing

```bash
cd backend

# Run development server
npm run dev

# Test schema endpoint
curl http://localhost:5000/api/schema

# Test generation endpoint
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "pluginName": "TestPlugin",
    "pluginCode": "TEST",
    "companyName": "TestCo",
    "pluginType": "effect",
    "outputPath": "/tmp"
  }'
```

### Integration Testing

1. Generate a plugin with default settings
2. Verify all files created
3. Try building with CMake
4. Check plugin loads in DAW

## 🐛 Debugging

### Frontend Debugging

```javascript
// React DevTools
npm install react-devtools

// Console logging
console.log('State:', formData)
console.log('Schema:', schema)
```

### Backend Debugging

```javascript
// Detailed logging in projectGenerator.js
const log = (msg) => {
  result.logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
  console.log(msg)  // Also to console
}
```

### File System Debugging

```bash
# List generated files
ls -la /Output/MyPlugin/

# Check template copying
find backend/templates/ -type f

# Verify placeholder replacement
grep -r "{{" Output/MyPlugin/
```

## 📦 Deployment

### Building for Production

```bash
# Frontend build
cd frontend
npm run build
# Output in dist/

# Backend uses dev mode fine for local
# For production, would add:
# - Environment variables
# - Error tracking (Sentry)
# - API rate limiting
# - Security headers
```

### Docker Setup (Optional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Backend
COPY backend/ ./backend/
RUN cd backend && npm install --production

# Frontend
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

EXPOSE 5000 3000

CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm start"]
```

## 🔐 Security Considerations

- **Input Validation**: All user input validated in schema + backend
- **Path Traversal**: Output path checked and sanitized
- **Code Injection**: Template engine uses exact matching, no eval()
- **CORS**: Configured for localhost only
- **File Permissions**: Output files created with safe permissions

## 🚀 Performance Optimization

### Frontend
- React.useMemo for schema processing
- Debounce form field changes
- Lazy load help content

### Backend
- Cache schema in memory
- Parallel file operations
- Stream large template copies

## 📚 Code Style Guidelines

### JavaScript
- ES6+ syntax
- Arrow functions preferred
- Const by default
- 2-space indentation
- Semicolons required

### React
- Functional components
- Hooks (useState, useEffect, useCallback, useMemo)
- Props destructuring
- JSX formatting with proper indentation

### CSS
- BEM naming convention
- CSS variables for theming
- Mobile-first responsive design
- Smooth transitions & animations

## 🎓 Common Tasks

### Changing default values
1. Update schema.json `"default"` values
2. Initialize in App.jsx `initialData` object

### Adding validation rules
1. Update schema field `"validation"` object
2. Add backend check in `projectGenerator.validate()`

### Customizing generated code
1. Edit template files in `backend/templates/juce_vst3/Source/`
2. Add new placeholders to schema
3. Update templateEngine.js and projectGenerator.js

### Changing UI styling
1. Edit CSS files in `frontend/src/styles/`
2. Update CSS variables in `index.css`
3. Component-specific styles in component CSS files

## 🤝 Contributing

When extending the system:

1. **Keep schema flexible** - Don't hardcode UI
2. **Maintain backward compatibility** - Existing projects should still work
3. **Document placeholders** - Any new template variable
4. **Test thoroughly** - Generate and build a test project
5. **Update README** - Document new features

## 📞 Support for Developers

- Check existing code comments
- Review similar implementations
- Test in isolation before integration
- Use console logging for debugging
- Keep git history clear and descriptive

---

**Happy developing! 🚀**
