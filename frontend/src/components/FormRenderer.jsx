import React, { useMemo } from 'react'
import '../styles/form.css'

function FormRenderer({ schema, formData, onFieldChange, onFieldFocus, isGenerating }) {
  // Check if a field should be visible based on conditional rules
  const isFieldVisible = (field, data) => {
    if (!field.visibleIf) return true
    
    const condition = field.visibleIf
    if (condition.field && condition.equals) {
      return data[condition.field] === condition.equals
    }
    return true
  }

  // Get all visible fields
  const visibleFields = useMemo(() => {
    const fields = []
    schema.groups.forEach(group => {
      group.fields.forEach(field => {
        if (isFieldVisible(field, formData)) {
          fields.push({ ...field, groupId: group.id })
        }
      })
    })
    return fields
  }, [schema, formData])

  const renderField = (field) => {
    const value = formData[field.id] ?? field.default ?? ''
    const fieldClass = `form-field form-field-${field.type}`

    const sharedProps = {
      id: field.id,
      disabled: isGenerating,
      onFocus: () => onFieldFocus(field),
      onBlur: () => onFieldFocus(null),
      className: 'form-input'
    }

    let inputElement = null

    switch (field.type) {
      case 'text':
        inputElement = (
          <input
            type="text"
            {...sharedProps}
            value={value}
            placeholder={field.placeholder || ''}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
          />
        )
        break

      case 'number':
        inputElement = (
          <input
            type="number"
            {...sharedProps}
            value={value}
            min={field.validation?.min}
            max={field.validation?.max}
            placeholder={field.placeholder || '0'}
            onChange={(e) => onFieldChange(field.id, parseInt(e.target.value) || 0)}
          />
        )
        break

      case 'checkbox':
        inputElement = (
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              {...sharedProps}
              checked={value === true}
              onChange={(e) => onFieldChange(field.id, e.target.checked)}
            />
            <label htmlFor={field.id}>{field.label}</label>
          </div>
        )
        break

      case 'select':
        inputElement = (
          <select
            {...sharedProps}
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
          >
            <option value="">-- Select --</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
        break

      case 'multiselect':
        inputElement = (
          <div className="multiselect-wrapper">
            <div className="multiselect-list">
              {field.options.map(option => (
                <div key={option.value} className="multiselect-item">
                  <input
                    type="checkbox"
                    id={`${field.id}-${option.value}`}
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onChange={(e) => {
                      const newValue = Array.isArray(value) ? [...value] : []
                      if (e.target.checked) {
                        newValue.push(option.value)
                      } else {
                        newValue.splice(newValue.indexOf(option.value), 1)
                      }
                      onFieldChange(field.id, newValue)
                    }}
                    disabled={isGenerating}
                  />
                  <label htmlFor={`${field.id}-${option.value}`}>
                    <span className="option-label">{option.label}</span>
                    {option.description && <span className="option-desc">{option.description}</span>}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
        break

      case 'textarea':
        inputElement = (
          <textarea
            {...sharedProps}
            value={value}
            placeholder={field.placeholder || ''}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            rows={4}
          />
        )
        break

      case 'filePath':
        inputElement = (
          <div className="file-path-wrapper">
            <input
              type="text"
              {...sharedProps}
              value={value}
              placeholder={field.placeholder || 'Select a directory...'}
              readOnly
              onClick={() => selectDirectory(field.id)}
            />
            <button 
              type="button"
              className="btn-browse"
              onClick={() => selectDirectory(field.id)}
              disabled={isGenerating}
            >
              Browse
            </button>
          </div>
        )
        break

      default:
        inputElement = (
          <input
            type="text"
            {...sharedProps}
            value={value}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
          />
        )
    }

    const label = field.type !== 'checkbox' && (
      <label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="required">*</span>}
      </label>
    )

    return (
      <div key={field.id} className={fieldClass}>
        {label}
        {inputElement}
        {field.help?.short && (
          <div className="help-hint">
            ℹ️ {field.help.short}
          </div>
        )}
      </div>
    )
  }

  const selectDirectory = (fieldId) => {
    // Electron API would go here
    // For web version, we can use a virtual picker
    const path = window.prompt('Enter directory path:')
    if (path) {
      onFieldChange(fieldId, path)
    }
  }

  // Group fields by their group
  const fieldsByGroup = {}
  schema.groups.forEach(group => {
    fieldsByGroup[group.id] = {
      label: group.label,
      description: group.description,
      fields: group.fields.filter(f => isFieldVisible(f, formData))
    }
  })

  return (
    <div className="form-container">
      <div className="form-wrapper">
        {schema.groups.map(group => {
          const visibleGroupFields = group.fields.filter(f => isFieldVisible(f, formData))
          if (visibleGroupFields.length === 0) return null

          return (
            <div key={group.id} className="form-group">
              <div className="group-header">
                <h3>{group.label}</h3>
                {group.description && <p className="group-desc">{group.description}</p>}
              </div>
              <div className="group-fields">
                {visibleGroupFields.map(field => renderField(field))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FormRenderer
