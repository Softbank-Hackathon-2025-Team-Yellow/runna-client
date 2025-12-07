import { useState } from 'react'
import { api } from '@/api/services'
import type { DeployResult } from '@/api/types'
import { Rocket, CheckCircle, XCircle, Link, Loader2 } from 'lucide-react'

interface FunctionExecutorProps {
  functionId?: string
  onExecutionComplete?: () => void
}

export const FunctionExecutor = ({ functionId, onExecutionComplete }: FunctionExecutorProps) => {
  const [deploying, setDeploying] = useState(false)
  const [result, setResult] = useState<DeployResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDeploy = async () => {
    if (!functionId) return
    
    try {
      setDeploying(true)
      setError(null)
      setResult(null)

      const deployResult = await api.functions.deployFunction(functionId)
      setResult(deployResult)
      
      // Refresh data after deployment
      if (onExecutionComplete) {
        onExecutionComplete()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deploy function')
    } finally {
      setDeploying(false)
    }
  }

  if (!functionId) return null

  return (
    <div className="mb-8">
      <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
        <h2 className="text-xl font-normal text-white mb-4">Deploy Function</h2>
        <div className="space-y-4">
          <p className="text-sm text-white/60">
            Deploy this function to the K8s cluster. The deployment process will create a Knative service and return the URL.
          </p>
          
          <button
            onClick={handleDeploy}
            disabled={deploying}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-background-dark text-sm font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deploying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Deploy to K8s</span>
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
              <h3 className="text-sm font-semibold text-white mb-3">Deployment Result</h3>
              
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">Status:</span>
                  <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                    result.status === 'SUCCESS'
                      ? 'bg-green-400/10 text-green-400'
                      : 'bg-red-400/10 text-red-400'
                  }`}>
                    {result.status === 'SUCCESS' && <CheckCircle className="w-3 h-3" />}
                    {result.status === 'FAILED' && <XCircle className="w-3 h-3" />}
                    {result.status}
                  </span>
                </div>

                {/* Knative URL */}
                {result.knative_url && (
                  <div className="flex items-center gap-2">
                    <Link className="w-3 h-3 text-primary" />
                    <span className="text-xs text-white/60">URL:</span>
                    <code className="text-xs text-primary font-mono">{result.knative_url}</code>
                  </div>
                )}

                {/* Message */}
                {result.message && (
                  <div>
                    <span className="text-xs text-white/60 block mb-2">Message:</span>
                    <p className="text-sm text-white/80">{result.message}</p>
                  </div>
                )}

                {/* Error */}
                {result.error && (
                  <div>
                    <span className="text-xs text-red-400 block mb-2">Error:</span>
                    <pre className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs overflow-x-auto text-red-400 font-mono">
                      {result.error.message || JSON.stringify(result.error, null, 2)}
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
