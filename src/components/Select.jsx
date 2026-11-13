import { useId } from 'react'
import './Select.css'

export default function Select({
  label,
  id,
  options = [],
  children,
  error,
  hint,
  disabled = false,
  className = '',
  value,
  onChange,
  ...rest
}) {
  const generatedId = useId()
  const selectId = id || generatedId
  const errorId = error ? `${selectId}-error` : undefined
  const hintId = hint ? `${selectId}-hint` : undefined

  return (
    <div className={`select-group ${className}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        disabled={disabled}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        className={`select-input ${error ? 'has-error' : ''}`.trim()}
        {...rest}
      >
        {children ||
          options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt
            const optLabel = typeof opt === 'object' ? opt.label : opt
            return (
              <option key={String(optVal)} value={optVal}>
                {optLabel}
              </option>
            )
          })}
      </select>
      {hint && !error && (
        <span id={hintId} className="select-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="select-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
