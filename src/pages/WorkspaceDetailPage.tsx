import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/api/services'
import type { Workspace, WorkspaceMetrics, FunctionItem } from '@/api/types'
import { LandingNavigation } from '@/features/landing/components/LandingNavigation'
import { ArrowLeft, Plus, Activity, TrendingUp, Clock, Zap, Trash2, Key, Copy, Check } from 'lucide-react'

export const WorkspaceDetailPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const navigate = useNavigate()
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [metrics, setMetrics] = useState<WorkspaceMetrics | null>(null)
  const [functions, setFunctions] = useState<FunctionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!workspaceId) return

      try {
        setLoading(true)
        setError(null)

        // First fetch workspace data
        const workspaceData = await api.workspaces.getWorkspace(workspaceId)
        setWorkspace(workspaceData)

        // Then fetch metrics and functions in parallel (these may fail independently)
        const [metricsData, functionsData] = await Promise.all([
          api.workspaces.getMetrics(workspaceId).catch(() => null),
          api.workspaces.getFunctions(workspaceId).catch(() => []),
        ])

        setMetrics(metricsData)
        setFunctions(Array.isArray(functionsData) ? functionsData : [])
      } catch (err: any) {
        const errorMessage = err?.message || err?.detail?.[0]?.msg || 'Failed to fetch workspace'
        setError(new Error(errorMessage))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [workspaceId])

  const handleDeleteWorkspace = async () => {
    if (!workspaceId) return

    setDeleting(true)
    try {
      await api.workspaces.deleteWorkspace(workspaceId)
      
      // Navigate back to workspaces list after successful deletion
      navigate('/workspaces')
    } catch (err) {
      alert('Failed to delete workspace')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleCopyAuthKey = async () => {
    if (!workspaceId) return
    
    try {
      // Generate a new auth key (or get existing one from workspace data if available)
      const authKeyData = await api.workspaces.generateAuthKey(workspaceId)
      
      navigator.clipboard.writeText(authKeyData.key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to get auth key')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-background-dark">
        <LandingNavigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !workspace) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-background-dark">
        <LandingNavigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
              <p className="text-red-400">{error?.message || 'Workspace not found'}</p>
            </div>
            <button
              onClick={() => navigate('/workspaces')}
              className="px-6 py-2.5 rounded-lg bg-primary text-background-dark font-medium hover:brightness-110 transition-all"
            >
              Back to Workspaces
            </button>
          </div>
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

        <div className="relative z-10 px-4 sm:px-8 md:px-20 lg:px-40 py-12 sm:py-16 md:py-20">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate('/workspaces')}
                className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Workspaces</span>
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Delete Workspace</span>
              </button>
            </div>
            
            <h1 className="font-pixel text-4xl text-primary mb-2">{workspace.name}</h1>
            <p className="text-white/60">
              Created {new Date(workspace.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Dashboard Container */}
          <div className="mb-12 p-6 rounded-xl border border-white/10 bg-white/[0.02]">
            {/* Auth Key Section */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Key className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Workspace Auth Key</h3>
                  <p className="text-xs text-white/60">Use this key to authenticate API requests</p>
                </div>
              </div>
              
              <button
                onClick={handleCopyAuthKey}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-xs">Copy Key</span>
                  </>
                )}
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-xs text-white/60">Total Functions</span>
                </div>
                <p className="text-2xl font-bold text-white">{metrics?.total_functions ?? functions.length}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs text-white/60">Total Executions</span>
                </div>
                <p className="text-2xl font-bold text-white">{metrics?.total_executions ?? 0}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-white/60">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {metrics ? `${(metrics.success_rate * 100).toFixed(1)}%` : '-'}
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-white/60">Avg Time</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {metrics && metrics.total_executions > 0 
                    ? `${(metrics.total_execution_time / metrics.total_executions).toFixed(0)}ms`
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Functions */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">Functions</h2>
                <p className="text-white/60 text-sm">{functions.length} functions in this workspace</p>
              </div>
              <button
                onClick={() => navigate(`/create?workspace_id=${workspaceId}`)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-background-dark font-medium hover:brightness-110 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Create Function</span>
              </button>
            </div>

            {functions.length === 0 ? (
              <div className="text-center py-20 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="inline-flex p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <Activity className="w-16 h-16 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No functions yet</h3>
                <p className="text-white/60 mb-6">Create your first function in this workspace</p>
                <button
                  onClick={() => navigate(`/create?workspace_id=${workspaceId}`)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-background-dark font-medium hover:brightness-110 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Function</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {functions.map((func) => {
                  const getStatusConfig = (status: string) => {
                    if (status === 'succeeded' || status === 'active') {
                      return { icon: '✓', color: 'text-green-400', bgColor: 'bg-green-400/10', label: 'Succeeded' }
                    } else if (status === 'failed' || status === 'error') {
                      return { icon: '✕', color: 'text-red-400', bgColor: 'bg-red-400/10', label: 'Failed' }
                    } else if (status === 'running') {
                      return { icon: '⟳', color: 'text-blue-400', bgColor: 'bg-blue-400/10', label: 'Running' }
                    } else {
                      return { icon: '⚠', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', label: 'Pending' }
                    }
                  }
                  
                  const statusConfig = func.status ? getStatusConfig(func.status) : null
                  const isNodejs = func.runtime.toUpperCase() === 'NODEJS'
                  const isSync = func.execution_type.toUpperCase() === 'SYNC'
                  
                  return (
                    <div
                      key={func.id}
                      onClick={() => navigate(`/functions/${func.id}`)}
                      className="group flex cursor-pointer flex-col rounded-xl border border-white/10 bg-white/[.03] p-5 transition-all duration-300 hover:border-primary/50 hover:bg-white/5 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 h-[150px]"
                    >
                      {/* Header with Title and Status */}
                      <div className="flex items-start justify-between gap-3 min-h-[48px] mb-4">
                        <h3 className="text-base font-normal text-white group-hover:text-[#fece6d] transition-colors duration-300 flex-1 line-clamp-2 overflow-hidden" title={func.name}>
                          {func.name}
                        </h3>
                        {statusConfig && (
                          <div className={`flex items-center gap-1.5 ${statusConfig.bgColor} rounded-md px-2 py-1 text-xs flex-shrink-0 h-fit`}>
                            <span className={`${statusConfig.color} font-normal whitespace-nowrap`}>{statusConfig.label}</span>
                          </div>
                        )}
                      </div>

                      {/* Spacer */}
                      <div className="flex-1"></div>

                      {/* Language and Time Info */}
                      <div className="flex flex-col gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          {isNodejs ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 1.5C11.5 1.5 11 1.7 10.7 2L2.2 7.5C1.5 7.9 1 8.7 1 9.5V14.5C1 15.3 1.5 16.1 2.2 16.5L10.7 22C11 22.3 11.5 22.5 12 22.5C12.5 22.5 13 22.3 13.3 22L21.8 16.5C22.5 16.1 23 15.3 23 14.5V9.5C23 8.7 22.5 7.9 21.8 7.5L13.3 2C13 1.7 12.5 1.5 12 1.5Z" fill="#68A063"/>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.585 11.692h4.328s2.432.039 2.432-2.35V5.391S16.714 3 11.936 3C7.362 3 7.647 3 7.647 3l-.006 2.347h4.363v.617H5.92s-2.927-.332-2.927 4.282 0 4.09 0 4.09h1.735v-2.383s-.093-2.261 2.226-2.261z" fill="url(#python-gradient-1)"/>
                              <path d="M14.415 12.308h-4.328s-2.432-.04-2.432 2.35v3.951S7.286 21 12.064 21c4.574 0 4.289 0 4.289 0l.006-2.347h-4.363v-.617h6.084s2.927.332 2.927-4.282 0-4.09 0-4.09h-1.735v2.383s.093 2.261-2.226 2.261z" fill="url(#python-gradient-2)"/>
                              <defs>
                                <linearGradient id="python-gradient-1" x1="7" y1="3" x2="7" y2="14" gradientUnits="userSpaceOnUse">
                                  <stop stopColor="#387EB8"/>
                                  <stop offset="1" stopColor="#366994"/>
                                </linearGradient>
                                <linearGradient id="python-gradient-2" x1="17" y1="10" x2="17" y2="21" gradientUnits="userSpaceOnUse">
                                  <stop stopColor="#FFE873"/>
                                  <stop offset="1" stopColor="#FFC331"/>
                                </linearGradient>
                              </defs>
                            </svg>
                          )}
                          <span className={`font-normal ${isNodejs ? 'text-green-400' : 'text-blue-400'}`}>
                            {func.runtime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-white/50">
                            <Clock className="w-4 h-4" />
                            <span className="font-normal">{new Date(func.updated_at || func.created_at).toLocaleDateString()}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isSync
                              ? 'bg-purple-400/10 text-purple-400' 
                              : 'bg-orange-400/10 text-orange-400'
                          }`}>
                            {func.execution_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-xl border border-white/10 bg-background-dark shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Delete Workspace</h3>
            </div>
            
            <p className="text-white/60 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">"{workspace.name}"</span>? 
              This action cannot be undone and will delete all functions in this workspace.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorkspace}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
