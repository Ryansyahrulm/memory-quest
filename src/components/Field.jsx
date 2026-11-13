import { useId } from 'react'
import './Field.css'

export default function Field({
  label,
  id,
  error,
  hint,
  disabled = false,
  className = '',
  type = 'text',
  ...rest
}) {
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const hintId = hint ? `${inputId}-hint` : undefined

  return (
    <div className={`field-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        className={`field-input ${error ? 'has-error' : ''}`.trim()}
        {...rest}
      />
      {hint && !error && (
        <span id={hintId} className="field-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
