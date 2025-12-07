interface EmptyStateProps {
  title?: string
  description?: string
  message?: string
}

function EmptyState({ title, description, message = '데이터가 없습니다.' }: EmptyStateProps): JSX.Element {
  return (
    <div className="text-gray-500 text-center py-12">
      {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
      {description && <p className="text-sm">{description}</p>}
      {!title && !description && <p className="text-lg">{message}</p>}
    </div>
  )
}

export default EmptyState
