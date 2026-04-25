# Contributing to JUCE Plugin Generator Studio

Thank you for your interest in contributing! This document provides guidelines and instructions for reporting issues, suggesting features, and submitting code contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Reporting Issues](#reporting-issues)
- [Suggesting Features](#suggesting-features)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Development Setup](#development-setup)
- [Testing Guidelines](#testing-guidelines)
- [Style Guide](#style-guide)

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and constructive in all interactions
- Welcome perspectives and experiences different from your own
- Give and receive feedback gracefully
- Focus on what's best for the community
- Report any Code of Conduct violations to the project maintainers

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/JUCEPluginGeneratorStudio.git
   cd JUCEPluginGeneratorStudio
   ```
3. **Follow [Development Setup](#development-setup)** section below
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/descriptive-name
   ```

## Reporting Issues

### Before Reporting

- **Check existing issues** to avoid duplicates
- **Search closed issues** - your issue may have been resolved
- **Check the FAQ** and troubleshooting guides
- **Try the latest code** - your issue may already be fixed

### Creating an Issue

Use the following template for bug reports:

```markdown
## Description
Brief description of the issue

## Environment
- **OS**: [e.g., Windows 11 22H2, macOS 13.2, Ubuntu 22.04]
- **Node.js**: [output of `node --version`]
- **npm**: [output of `npm --version`]
- **CMake**: [output of `cmake --version`]
- **Compiler**: [e.g., MSVC 2022, Clang 14, GCC 11]
- **Browser**: [if relevant, e.g., Chrome 112]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [etc.]

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages
[Paste any error messages from console or terminal]

## Screenshots
[If applicable]

## Additional Context
[Any other relevant information]
```

### Issue Priority

Issues will be triaged based on:
- **Critical**: Tool crashes, complete generation failures, security issues
- **High**: Major features not working, significant data loss
- **Medium**: Minor bugs, confusing error messages, UX issues
- **Low**: Feature requests, documentation improvements, minor cosmetic issues

## Suggesting Features

Feature requests are welcome! Please provide:

1. **Clear description** - What is the feature?
2. **Use case** - Why is this needed?
3. **Proposed solution** - How should it work?
4. **Alternatives** - Other approaches considered?
5. **Additional context** - Links, references, examples

Example:
```markdown
## Feature: Support for AU (Audio Units) Format

### Use Case
macOS users need AU format support to use plugins in Logic Pro, GarageBand, and other AU-compatible DAWs.

### Proposed Solution
Add AU format option to schema alongside VST3, with separate template for AU-specific configuration.

### Benefits
- Expands platform coverage
- Increases user base on macOS
- Follows similar pattern to VST3 implementation
```

## Submitting Pull Requests

### Before You Start

- Ensure there's an issue discussing the change (or create one)
- Discuss major changes in an issue first
- Check that your change aligns with the project scope
- Ensure no one else is already working on it

### PR Process

1. **Keep it focused** - One feature or fix per PR
2. **Keep it small** - Easier to review and merge
3. **Commit often** - With clear, descriptive messages
4. **Write tests** - If applicable to your changes
5. **Test thoroughly** - On your platform and, if possible, others

### PR Template

```markdown
## Description
Brief explanation of changes

## Related Issue
Fixes #123 (if applicable)

## Type of Change
- [ ] Bug fix (non-breaking)
- [ ] New feature (non-breaking)
- [ ] Breaking change
- [ ] Documentation update

## Testing
What testing did you perform?
- [ ] Generated a simple plugin
- [ ] Tested on [OS]
- [ ] Verified builds and runs
- [ ] [Other specific tests]

## Checklist
- [ ] Code follows style guide
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new console warnings
- [ ] Tested on at least my platform
- [ ] PR title follows format: `[type]: brief description`

## Platform Tested
- [ ] Windows
- [ ] macOS
- [ ] Linux
```

### PR Titles

Use clear, descriptive PR titles:

- ✅ `[fix]: handle spaces in plugin names`
- ✅ `[feature]: add AU format support`
- ✅ `[docs]: update build instructions`
- ❌ `update stuff`
- ❌ `fix bug`

## Development Setup

### Prerequisites

- Node.js 16+ (with npm)
- CMake 3.24+
- JUCE 7.0.0+
- C++ compiler (MSVC, Clang, or GCC)
- Git

### Installation

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Running Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend opens at http://localhost:3000
```

### File Structure Overview

```
backend/
  ├── api/                    # API endpoints
  ├── generators/             # Generation logic
  └── templates/              # JUCE templates

frontend/
  ├── src/
  │   ├── components/         # React components
  │   └── styles/             # CSS files
  └── public/

schema/
  └── pluginSchema.json       # Form schema definition
```

## Testing Guidelines

### Unit Testing

For new features, consider adding tests:

```javascript
// Example: Testing validation
const validatePluginName = (name) => {
  if (!name || name.length < 3) return false;
  return /^[a-zA-Z0-9_]+$/.test(name);
};

// Test
console.assert(validatePluginName("ValidName") === true);
console.assert(validatePluginName("ab") === false);
console.assert(validatePluginName("in-valid") === false);
```

### Manual Testing Checklist

- [ ] Form renders correctly
- [ ] Validation works for all field types
- [ ] All required fields are marked
- [ ] Help text displays properly
- [ ] Generation succeeds with valid input
- [ ] Error messages appear for invalid input
- [ ] Generated plugin structure is correct
- [ ] Generated CMakeLists.txt is valid
- [ ] Generated plugin builds with CMake
- [ ] Plugin loads in DAW (if possible)

### Platform Testing

**Windows:**
```bash
# Test with MSVC
cmake -G "Visual Studio 17 2022" -B build
cmake --build build
```

**macOS:**
```bash
# Test with Clang
cmake -B build
cmake --build build
```

**Linux:**
```bash
# Test with GCC
cmake -B build
cmake --build build
```

## Style Guide

### JavaScript/React

- Use `const` by default, `let` when needed
- Use arrow functions `() => {}`
- Use descriptive variable names
- Add comments for complex logic
- Follow existing formatting

```javascript
// Good
const generateProject = (config) => {
  const validator = new ProjectValidator();
  return validator.validate(config);
};

// Avoid
const gen = (c) => new ProjectValidator().validate(c);
```

### JSON (Schema)

- Use 2-space indentation
- Quotes around all keys
- Meaningful field IDs
- Clear help text

```json
{
  "id": "pluginName",
  "type": "text",
  "label": "Plugin Name",
  "required": true,
  "help": {
    "short": "Display name in DAW",
    "long": "Used as identifier in menus..."
  }
}
```

### HTML/CSS

- Use semantic HTML
- Use descriptive class names
- Group related styles
- Comment complex selectors

```css
/* Good */
.form-field {
  margin-bottom: 1rem;
}

.form-field__label {
  font-weight: bold;
}

/* Avoid */
.field { /* unclear what it is */ }
div.x { /* not descriptive */ }
```

### Comments

- Comment WHY, not WHAT
- Keep comments current with code
- Use TODO for incomplete work

```javascript
// Good: explains intent
// Cache results to avoid re-parsing schema on each request
const cachedSchema = require('./schema.json');

// Avoid: restates what code does
// Set x to 5
let x = 5;

// TODO: Implement error handling for network failures
```

## Review Process

1. **Initial Review**: Maintainers will review your PR within a reasonable timeframe
2. **Feedback**: Changes may be requested
3. **Revision**: Please update your PR based on feedback
4. **Approval**: Merging requires approval from maintainers
5. **Merge**: Your code becomes part of the project!

### What We Look For

- ✅ Solves the stated problem
- ✅ Code quality and clarity
- ✅ Consistency with existing style
- ✅ Thorough testing
- ✅ Appropriate documentation
- ✅ No unrelated changes

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Project documentation
- Release notes

## Questions?

- Check existing issues and discussions
- Ask in issue comments
- Review project documentation
- Look at similar PRs/issues for patterns

## License

By contributing, you agree that your contributions will be licensed under the MIT License. All contributions must be compatible with this license.

---

Thank you for contributing! Your help makes this project better for everyone. 🎉
