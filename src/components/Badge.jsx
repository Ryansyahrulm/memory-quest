import './Badge.css'

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
  ...rest
}) {
  const variantMap = {
    hit: 'badge-hit',
    fault: 'badge-fault',
    neutral: 'badge-neutral',
  }
  const variantClass = variantMap[variant] || 'badge-neutral'

  return (
    <span className={`badge ${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </span>
  )
}
