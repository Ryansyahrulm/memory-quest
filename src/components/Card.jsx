import './Card.css'

export default function Card({
  children,
  title,
  description,
  className = '',
  ...rest
}) {
  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {(title || description) && (
        <div className="card-header">
          {title && <h2 className="card-title">{title}</h2>}
          {description && <p className="card-description">{description}</p>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  )
}
