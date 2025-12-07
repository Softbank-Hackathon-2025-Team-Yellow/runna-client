import { useState, useEffect } from 'react'
import { api } from '@/api/services'
import type { FunctionMetrics as FunctionMetricsType } from '@/api/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

interface FunctionMetricsProps {
  functionId: number
}

export const FunctionMetrics = ({ functionId }: FunctionMetricsProps) => {
  const [metrics, setMetrics] = useState<FunctionMetricsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.functions.getMetrics(functionId)
        setMetrics(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch metrics'))
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [functionId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <ErrorMessage message={error.message} />
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  const successRate = metrics.total_executions > 0
    ? (metrics.success_count / metrics.total_executions) * 100
    : 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Executions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Executions</h3>
          <p className="text-3xl font-bold text-gray-900">{metrics.total_executions}</p>
        </div>

        {/* Success Count */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-700 mb-1">Successful</h3>
          <p className="text-3xl font-bold text-green-900">{metrics.success_count}</p>
        </div>

        {/* Error Count */}
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-700 mb-1">Failed</h3>
          <p className="text-3xl font-bold text-red-900">{metrics.error_count}</p>
        </div>

        {/* Success Rate */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-700 mb-1">Success Rate</h3>
          <p className="text-3xl font-bold text-blue-900">{successRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Average Duration */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Average Duration</h3>
        <p className="text-2xl font-bold text-gray-900">{metrics.avg_duration}ms</p>
      </div>

      {/* Last Execution */}
      {metrics.last_execution && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Last Execution</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  metrics.last_execution.status === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {metrics.last_execution.status}
              </span>
            </div>
            {metrics.last_execution.duration && (
              <div className="text-gray-600">
                Duration: <span className="font-medium">{metrics.last_execution.duration}ms</span>
              </div>
            )}
            <div className="text-gray-600">
              Time: {new Date(metrics.last_execution.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
