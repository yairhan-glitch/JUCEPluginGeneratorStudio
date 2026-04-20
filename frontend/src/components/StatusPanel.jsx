import React, { useEffect, useRef } from 'react'
import '../styles/status-panel.css'

function StatusPanel({ status, isGenerating, onOpenVsCode }) {
  const logsEndRef = useRef(null)

  // Auto-scroll to latest log
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [status.logs])

  const handleCopyPath = () => {
    if (status.projectPath) {
      navigator.clipboard.writeText(status.projectPath)
        .then(() => alert('Path copied to clipboard!'))
        .catch(() => alert('Failed to copy'))
    }
  }

  const handleOpenTerminal = () => {
    if (status.projectPath) {
      // This would integrate with VS Code/Terminal in a full app
      alert(`Open terminal and run:\ncd "${status.projectPath}"\ncmake -B build\ncmake --build build`)
    }
  }

  return (
    <div className="status-panel">
      <div className="panel-header">
        <h3>📝 Generation Status & Logs</h3>
        <div className="status-indicator">
          {isGenerating && <span className="spinner"></span>}
          {!isGenerating && status.success === true && <span className="badge success">✓ Success</span>}
          {!isGenerating && status.success === false && <span className="badge error">✗ Failed</span>}
          {status.success === null && <span className="badge idle">Ready</span>}
        </div>
      </div>

      <div className="logs-container">
        {status.logs.length === 0 ? (
          <div className="empty-logs">
            <p>Logs will appear here when you generate a plugin...</p>
          </div>
        ) : (
          <div className="logs-content">
            {status.logs.map((log, idx) => (
              <div 
                key={idx} 
                className={`log-line ${
                  log.startsWith('❌') ? 'error' : 
                  log.startsWith('✓') || log.startsWith('✅') ? 'success' : 
                  log.startsWith('🔄') ? 'info' : 
                  log.startsWith('⏳') ? 'waiting' :
                  ''
                }`}
              >
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {status.success === true && status.projectPath && (
        <div className="success-panel visible">
          <h4>🎉 Plugin Generated Successfully!</h4>
          <div className="project-info">
            <p><strong>Project:</strong> <code>{status.projectName}</code></p>
            <p><strong>Location:</strong> <code>{status.projectPath}</code></p>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-action btn-copy"
              onClick={handleCopyPath}
              title="Copy project path to clipboard"
            >
              📋 Copy Path
            </button>
            
            <button 
              className="btn-action btn-terminal"
              onClick={handleOpenTerminal}
              title="Show build commands"
            >
              🖥️ Build Commands
            </button>

            <button 
              className="btn-action btn-vscode"
              onClick={onOpenVsCode}
              title="Open project in VS Code"
            >
              💻 Open in VS Code
            </button>
          </div>

          <div className="build-instructions">
            <h5>🚀 Next Steps:</h5>
            <ol>
              <li>Navigate to project directory</li>
              <li>Run <code>cmake -B build</code></li>
              <li>Run <code>cmake --build build</code></li>
              <li>Find your VST3 plugin in the build output</li>
            </ol>
          </div>
        </div>
      )}

      {status.success === false && (
        <div className="error-panel visible">
          <h4>❌ Generation Failed</h4>
          <p>Check the logs above for error details.</p>
        </div>
      )}
    </div>
  )
}

export default StatusPanel
