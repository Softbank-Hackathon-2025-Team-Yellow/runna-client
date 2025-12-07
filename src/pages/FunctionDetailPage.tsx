import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Eye, Activity, Clock, CheckCircle, XCircle, RefreshCw, Copy, Link } from 'lucide-react'
import { LandingNavigation } from '../features/landing/components/LandingNavigation'
import { FunctionExecutor } from '../features/function-detail/components/FunctionExecutor'
import { api } from '@/api/services'
import type { FunctionDetail, FunctionMetrics, Job } from '@/api/types'

const FunctionDetailPage = () => {
  const navigate = useNavigate()
  const { functionId } = useParams<{ functionId: string }>()
  const [functionDetail, setFunctionDetail] = useState<FunctionDetail | null>(null)
  const [metrics, setMetrics] = useState<FunctionMetrics | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const fetchData = async () => {
    if (!functionId) return
    
    setLoading(true)
    try {
      const [functionData, metricsData, jobsData] = await Promise.all([
        api.functions.getFunction(functionId),
        api.functions.getMetrics(functionId),
        api.functions.getJobs(functionId)
      ])
      
      setFunctionDetail(functionData)
      setMetrics(metricsData)
      setJobs(jobsData.jobs)
    } catch (error) {
      console.error('Failed to fetch function details:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [functionId])

  const handleRefresh = () => {
    fetchData()
  }

  const handleCopyUrl = () => {
    const url = functionDetail?.knative_url || `https://runna-api.ajy720.me/functions/${functionId}`
    navigator.clipboard.writeText(url)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'running':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      default:
        return 'text-white/60 bg-white/5 border-white/10'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-background-dark">
        <LandingNavigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    )
  }

  if (!functionDetail) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-background-dark">
        <LandingNavigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white/60">Function not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background-dark">
      <LandingNavigation />

      <main className="flex-1 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(245, 166, 35, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 166, 35, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative z-10 px-4 sm:px-8 md:px-20 lg:px-40 py-8 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/gallery')}
                className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-normal">Back to Gallery</span>
              </button>
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <h1 className="font-pixel text-3xl text-[#fece6d]">{functionDetail.name}</h1>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  functionDetail.runtime === 'NODEJS' 
                    ? 'bg-green-400/10 text-green-400 border-green-400/30' 
                    : 'bg-blue-400/10 text-blue-400 border-blue-400/30'
                }`}>
                  {functionDetail.runtime}
                </span>
                {functionDetail.status && (
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    functionDetail.status === 'deployed' 
                      ? 'bg-green-400/10 text-green-400 border-green-400/30' 
                      : functionDetail.status === 'pending'
                      ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'
                      : 'bg-white/10 text-white/60 border-white/30'
                  }`}>
                    {functionDetail.status}
                  </span>
                )}
              </div>
              
              {/* Knative URL */}
              {functionDetail.knative_url && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-white/5 max-w-fit">
                  <Link className="w-4 h-4 text-primary flex-shrink-0" />
                  <code className="text-xs text-white/80 font-mono">
                    {functionDetail.knative_url}
                  </code>
                  <button
                    onClick={handleCopyUrl}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    title="Copy URL"
                  >
                    <Copy className={`w-3.5 h-3.5 ${copiedUrl ? 'text-green-400' : 'text-white/60'}`} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 py-2.5 px-4 rounded-lg border border-white/10 bg-white/5 text-white text-sm font-normal hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => navigate(`/edit/${functionId}`)}
                className="flex items-center gap-2 py-2.5 px-5 rounded-lg bg-primary text-background-dark text-sm font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <Eye className="w-4 h-4" />
                View Function
              </button>
            </div>
          </div>

          {/* Metrics Overview */}
          {metrics && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Executions */}
                <div className="group p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-white/60">Total Executions</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{metrics.total_executions.toLocaleString()}</div>
                  <div className="mt-2 text-xs text-white/40">All time</div>
                </div>

                {/* Success Count */}
                <div className="group p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-400/30 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-green-400/10 group-hover:bg-green-400/20 transition-colors">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-white/60">Successful</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400">{metrics.success_count.toLocaleString()}</div>
                  <div className="mt-2 text-xs text-green-400/60">
                    {metrics.total_executions > 0 ? ((metrics.success_count / metrics.total_executions) * 100).toFixed(1) : 0}% success rate
                  </div>
                </div>

                {/* Avg Duration */}
                <div className="group p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-blue-400/10 group-hover:bg-blue-400/20 transition-colors">
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-white/60">Avg Duration</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{metrics.avg_duration.toFixed(0)}ms</div>
                  <div className="mt-2 text-xs text-white/40">Per execution</div>
                </div>
              </div>
            </div>
          )}

          {/* Function Executor */}
          <FunctionExecutor functionId={functionId} onExecutionComplete={fetchData} />

          {/* Execution Logs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-normal text-white mb-1">Execution History</h2>
                <p className="text-sm text-white/50">{jobs.length} recent executions</p>
              </div>
              <button 
                onClick={() => navigate(`/functions/${functionId}/logs`)}
                className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/70 text-sm hover:bg-white/10 hover:text-white transition-all"
              >
                View All
              </button>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/[0.02] border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Job ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {jobs.length > 0 ? (
                      jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="px-6 py-4 text-sm font-mono text-primary group-hover:text-primary/80">{job.id}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusColor(job.status)}`}>
                              {job.status === 'success' && <CheckCircle className="w-3.5 h-3.5" />}
                              {job.status === 'error' && <XCircle className="w-3.5 h-3.5" />}
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-white/60">{formatTimestamp(job.created_at)}</td>
                          <td className="px-6 py-4 text-sm text-white/60">
                            {job.output ? (
                              <code className="text-xs bg-white/10 px-3 py-1.5 rounded font-mono">{JSON.stringify(job.output).substring(0, 50)}...</code>
                            ) : job.error ? (
                              <code className="text-xs bg-red-500/10 px-3 py-1.5 rounded font-mono text-red-400">{job.error.substring(0, 50)}...</code>
                            ) : (
                              <span className="text-white/40 italic">No result</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-white/40">
                          No execution history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default FunctionDetailPage
