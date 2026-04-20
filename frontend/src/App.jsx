import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FormRenderer from './components/FormRenderer'
import HelpPanel from './components/HelpPanel'
import StatusPanel from './components/StatusPanel'
import './styles/app.css'

function App() {
  const [schema, setSchema] = useState(null)
  const [formData, setFormData] = useState({})
  const [currentField, setCurrentField] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [status, setStatus] = useState({
    logs: [],
    success: null,
    projectPath: null,
    projectName: null
  })
  const [error, setError] = useState(null)

  // Load schema on mount
  useEffect(() => {
    loadSchema()
  }, [])

  const loadSchema = async () => {
    try {
      const response = await axios.get('/api/schema')
      setSchema(response.data)
      
      // Initialize form data with default values
      const initialData = {}
      response.data.groups.forEach(group => {
        group.fields.forEach(field => {
          if (field.default !== undefined) {
            initialData[field.id] = field.default
          }
        })
      })
      setFormData(initialData)
      
      setError(null)
    } catch (err) {
      setError('Failed to load schema: ' + err.message)
      console.error('Error loading schema:', err)
    }
  }

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setStatus({
      logs: ['🚀 Starting plugin generation...', '📡 Sending request to server...'],
      success: null,
      projectPath: null,
      projectName: null
    })
    
    try {
      // Log what we're sending
      console.log('📤 Sending form data:', formData)
      
      // Add timeout to the request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const response = await axios.post('/api/generate', formData, {
        signal: controller.signal,
        timeout: 30000
      })
      
      clearTimeout(timeoutId)
      console.log('📥 Received response:', response.data)
      
      setStatus({
        logs: response.data.logs || [],
        success: response.data.success,
        projectPath: response.data.projectPath,
        projectName: response.data.projectName
      })
      
      if (response.data.success) {
        setError(null)
      }
    } catch (err) {
      console.error('❌ Generation error:', err)
      
      let errorMessage = err.message
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - generation took too long'
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      }
      
      const errorLogs = [
        ...(err.response?.data?.logs || []),
        `❌ Error: ${errorMessage}`,
        ...(err.response?.data?.details ? [`📋 Details: ${err.response.data.details}`] : [])
      ]
      
      setStatus(prev => ({
        ...prev,
        success: false,
        logs: errorLogs
      }))
    } finally {
      setIsGenerating(false)
    }
  }

  const openInVsCode = () => {
    // Send request to open in VS Code
    if (status.projectPath) {
      axios.post('/api/open-vscode', { path: status.projectPath })
        .catch(err => console.log('VS Code integration not available'))
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🎛️ JUCE Plugin Generator Studio</h1>
          <p className="subtitle">Schema-driven VST3 plugin generator</p>
        </div>
      </header>

      <div className="app-main">
        <div className="left-panel">
          {schema ? (
            <FormRenderer 
              schema={schema}
              formData={formData}
              onFieldChange={handleFieldChange}
              onFieldFocus={setCurrentField}
              isGenerating={isGenerating}
            />
          ) : (
            <div className="loading">Loading schema...</div>
          )}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadSchema}>Retry</button>
            </div>
          )}

          <div className="action-buttons">
            <button 
              className="btn-generate"
              onClick={handleGenerate}
              disabled={isGenerating || !schema}
            >
              {isGenerating ? '⏳ Generating...' : '✨ Generate Plugin Project'}
            </button>
          </div>
        </div>

        <div className="right-panel">
          <HelpPanel 
            field={currentField}
            schema={schema}
          />
        </div>
      </div>

      <div className="bottom-panel">
        <StatusPanel 
          status={status}
          isGenerating={isGenerating}
          onOpenVsCode={openInVsCode}
        />
      </div>
    </div>
  )
}

export default App
