import React from 'react'
import '../styles/help-panel.css'

function HelpPanel({ field, schema }) {
  if (!field) {
    return (
      <div className="help-panel">
        <div className="help-content help-welcome">
          <h2>📚 Help & Documentation</h2>
          <p>Hover over or focus on any field to see contextual help here.</p>
          
          <div className="help-section">
            <h3>Getting Started</h3>
            <ol>
              <li><strong>Fill in Basic Information:</strong> Enter your plugin name and company</li>
              <li><strong>Choose Plugin Type:</strong> Select between Audio Effect or Synth</li>
              <li><strong>Configure Audio Settings:</strong> Enable MIDI, adjust parameters</li>
              <li><strong>Set Output Directory:</strong> Choose where to save the project</li>
              <li><strong>Generate:</strong> Click the Generate button to create your project</li>
              <li><strong>Build:</strong> Use CMake to build the project</li>
            </ol>
          </div>

          <div className="help-section">
            <h3>Key Concepts</h3>
            <ul>
              <li><strong>Plugin Code:</strong> A unique 4-character identifier for your plugin</li>
              <li><strong>VST3:</strong> Modern plugin format with enhanced I/O and metadata</li>
              <li><strong>Pass-Through:</strong> Generated plugin passes audio unchanged (baseline implementation)</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>After Generation</h3>
            <pre>cd &lt;project_directory&gt;
cmake -B build
cmake --build build</pre>
          </div>
        </div>
      </div>
    )
  }

  const help = field.help || {}

  return (
    <div className="help-panel">
      <div className="help-content">
        <div className="help-header">
          <h3>📖 {field.label}</h3>
          {field.required && <span className="badge-required">Required</span>}
        </div>

        {help.long && (
          <div className="help-main">
            <p>{help.long}</p>
          </div>
        )}

        {field.validation && (
          <div className="help-validation">
            <h4>Validation Rules:</h4>
            <ul>
              {field.validation.minLength && (
                <li>Minimum length: {field.validation.minLength}</li>
              )}
              {field.validation.maxLength && (
                <li>Maximum length: {field.validation.maxLength}</li>
              )}
              {field.validation.min !== undefined && (
                <li>Minimum value: {field.validation.min}</li>
              )}
              {field.validation.max !== undefined && (
                <li>Maximum value: {field.validation.max}</li>
              )}
              {field.validation.pattern && (
                <li>Pattern: <code>{field.validation.pattern}</code></li>
              )}
            </ul>
          </div>
        )}

        {field.type === 'select' && field.options && (
          <div className="help-options">
            <h4>Available Options:</h4>
            <ul>
              {field.options.map(opt => (
                <li key={opt.value}>
                  <strong>{opt.label}</strong> <code>({opt.value})</code>
                </li>
              ))}
            </ul>
          </div>
        )}

        {field.visibleIf && (
          <div className="help-visibility">
            <h4>⚙️ Visibility Rule:</h4>
            <p>
              This field appears only when <code>{field.visibleIf.field}</code> is set to <code>{field.visibleIf.equals}</code>
            </p>
          </div>
        )}

        <div className="help-examples">
          <h4>💡 Tips:</h4>
          <ul>
            <li>Click Browse to select an output directory</li>
            <li>Leave Plugin Code as "AUTO" for automatic generation</li>
            <li>Plugin names must contain only letters, numbers, and underscores</li>
            <li>Generated projects are ready to build with CMake</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HelpPanel
