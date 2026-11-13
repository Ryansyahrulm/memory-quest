import './StatBlock.css'

export default function StatBlock({
  label,
  value,
  description,
  variant = 'default',
  className = '',
  ...rest
}) {
  const variantMap = {
    hit: 'stat-hit',
    fault: 'stat-fault',
    accent: 'stat-accent',
    default: '',
  }
  const valueColorClass = variantMap[variant] || ''

  return (
    <div className={`stat-block ${className}`.trim()} {...rest}>
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${valueColorClass}`.trim()}>{value}</span>
      {description && <span className="stat-description">{description}</span>}
    </div>
  )
}
