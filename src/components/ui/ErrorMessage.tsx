interface ErrorMessageProps {
  message?: string
  fullScreen?: boolean
}

function ErrorMessage({ message = '오류가 발생했습니다.', fullScreen = false }: ErrorMessageProps): JSX.Element {
  const content = (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      <p>{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {content}
      </div>
    )
  }

  return content
}

export default ErrorMessage
