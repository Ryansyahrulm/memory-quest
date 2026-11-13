import './Button.css'

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary'

  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn ${variantClass} ${className}`.trim()}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
}
