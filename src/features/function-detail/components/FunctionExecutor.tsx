import { useState } from 'react'
import { api } from '@/api/services'
import type { ExecutionResult } from '@/api/types'
import { Play, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'

interface FunctionExecutorProps {
  functionId?: string
  onExecutionComplete?: () => void
}

export const FunctionExecutor = ({ functionId, onExecutionComplete }: FunctionExecutorProps) => {
  const [payload, setPayload] = useState('{}')
  const [executing, setExecuting] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExecute = async () => {
    if (!functionId) return
    
    try {
      setExecuting(true)
      setError(null)
      setResult(null)

      // Parse payload
      let parsedPayload = {}
      if (payload.trim()) {
        try {
          parsedPayload = JSON.parse(payload)
        } catch (e) {
          throw new Error('Invalid JSON payload')
        }
      }

      const executionResult = await api.functions.invokeFunction(functionId, parsedPayload)
      setResult(executionResult)
      
      // Refresh data after execution
      if (onExecutionComplete) {
        onExecutionComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute function')
    } finally {
      setExecuting(false)
    }
  }

  if (!functionId) return null

  return (
    <div className="mb-8">
      <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
        <h2 className="text-xl font-normal text-white mb-4">Test Function</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Payload (JSON)
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              placeholder='{"key": "value"}'
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              disabled={executing}
            />
          </div>
          
          <button
            onClick={handleExecute}
            disabled={executing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-background-dark text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {executing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Execute Function</span>
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="mt-4 p-4 rounded-lg border border-white/10 bg-white/5">
              <h3 className="text-sm font-semibold text-white mb-3">Execution Result</h3>
              
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">Status:</span>
                  <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                    result.status === 'success'
                      ? 'bg-green-400/10 text-green-400'
                      : result.status === 'error'
                      ? 'bg-red-400/10 text-red-400'
                      : result.status === 'running'
                      ? 'bg-blue-400/10 text-blue-400'
                      : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {result.status === 'success' && <CheckCircle className="w-3 h-3" />}
                    {result.status === 'error' && <XCircle className="w-3 h-3" />}
                    {result.status}
                  </span>
                </div>

                {/* Duration */}
                {result.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-white/40" />
                    <span className="text-xs text-white/60">Duration: {result.duration}ms</span>
                  </div>
                )}

                {/* Output */}
                {result.output && (
                  <div>
                    <span className="text-xs text-white/60 block mb-2">Output:</span>
                    <pre className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs overflow-x-auto text-white/80 font-mono">
                      {JSON.stringify(result.output, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Error */}
                {result.error && (
                  <div>
                    <span className="text-xs text-red-400 block mb-2">Error:</span>
                    <pre className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs overflow-x-auto text-red-400 font-mono">
                      {result.error}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
