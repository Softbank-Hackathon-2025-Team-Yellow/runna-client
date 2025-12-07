import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import { LandingNavigation } from '@/features/landing/components/LandingNavigation'
import { Plus, Folder, Trash2, Calendar } from 'lucide-react'

export const WorkspacesPage = () => {
  const navigate = useNavigate()
  const { workspaces, loading, error, createWorkspace, deleteWorkspace, refresh } = useWorkspaces()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Debug logging
  console.log('[WorkspacesPage] State:', { workspaces, loading, error })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateError(null)

    // Validation
    if (newWorkspaceName.length > 20) {
      setCreateError('Workspace name must be 20 characters or less')
      setCreating(false)
      return
    }

    if (!/^[a-zA-Z0-9-]+$/.test(newWorkspaceName)) {
      setCreateError('Workspace name can only contain letters, numbers, and hyphens (-)')
      setCreating(false)
      return
    }

    try {
      await createWorkspace({ name: newWorkspaceName })
      setNewWorkspaceName('')
      setShowCreateModal(false)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create workspace')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (workspaceId: string, workspaceName: string) => {
    if (!confirm(`Are you sure you want to delete "${workspaceName}"?`)) {
      return
    }

    try {
      await deleteWorkspace(workspaceId)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete workspace')
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

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-background-dark">
        <LandingNavigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
              <p className="text-red-400">{error.message}</p>
            </div>
            <button
              onClick={refresh}
              className="px-6 py-2.5 rounded-lg bg-primary text-background-dark font-medium hover:brightness-110 transition-all"
            >
              Retry
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
            <div>
              <h1 className="font-pixel text-4xl text-primary mb-2">Workspaces</h1>
              <p className="text-white/60">Manage your function workspaces</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-background-dark font-medium hover:brightness-110 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Create Workspace</span>
            </button>
          </div>

          {/* Workspaces Grid */}
          {workspaces.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <Folder className="w-16 h-16 text-white/40" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No workspaces yet</h3>
              <p className="text-white/60 mb-6">Create your first workspace to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-background-dark font-medium hover:brightness-110 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Workspace</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="group p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/50 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/workspaces/${workspace.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <Folder className="w-6 h-6 text-primary" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(workspace.id, workspace.name)
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-white/40 hover:text-red-400" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {workspace.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <Calendar className="w-4 h-4" />
                    <span>Created {new Date(workspace.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md p-6 rounded-xl border border-white/10 bg-background-dark shadow-2xl">
            <h2 className="font-pixel text-2xl text-primary mb-6">Create Workspace</h2>
            
            {createError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                <p className="text-red-400 text-sm">{createError}</p>
              </div>
            )}
            
            <form onSubmit={handleCreate}>
              <div className="mb-6">
                <label htmlFor="workspaceName" className="block text-sm font-medium text-white/80 mb-2">
                  Workspace Name
                </label>
                <input
                  id="workspaceName"
                  type="text"
                  required
                  maxLength={20}
                  pattern="[a-zA-Z0-9-]+"
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  placeholder="my-workspace"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  disabled={creating}
                  autoFocus
                />
                <div className="mt-2 flex items-center justify-between text-xs">
                  <p className="text-white/50">
                    Only letters, numbers, and hyphens (-)
                  </p>
                  <p className={`${newWorkspaceName.length > 20 ? 'text-red-400' : 'text-white/50'}`}>
                    {newWorkspaceName.length}/20
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewWorkspaceName('')
                    setCreateError(null)
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition-all"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-background-dark font-medium hover:brightness-110 transition-all disabled:opacity-50"
                  disabled={creating}
                >
                  {creating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background-dark"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
