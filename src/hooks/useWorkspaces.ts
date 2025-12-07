import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/api/services'
import type { Workspace, WorkspaceCreate } from '@/api/types'

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)

  const fetchWorkspaces = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('[useWorkspaces] Fetching workspaces...')
      
      const data = await api.workspaces.getWorkspaces()
      console.log('[useWorkspaces] Received data:', data)
      console.log('[useWorkspaces] Is array:', Array.isArray(data))
      
      if (isMountedRef.current) {
        // Ensure data is an array
        const workspacesArray = Array.isArray(data) ? data : []
        console.log('[useWorkspaces] Setting workspaces:', workspacesArray)
        setWorkspaces(workspacesArray)
      }
    } catch (err: any) {
      console.error('[useWorkspaces] Fetch error:', err)
      if (isMountedRef.current) {
        const errorMessage = err?.message || err?.detail?.[0]?.msg || 'Failed to fetch workspaces'
        setError(new Error(errorMessage))
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  const createWorkspace = useCallback(async (data: WorkspaceCreate) => {
    try {
      const newWorkspace = await api.workspaces.createWorkspace(data)
      console.log('[useWorkspaces] Created workspace:', newWorkspace)
      
      if (isMountedRef.current && newWorkspace && newWorkspace.id) {
        setWorkspaces((prev) => [...prev, newWorkspace])
      } else if (isMountedRef.current) {
        // If workspace creation succeeded but response format is unexpected, refresh the list
        await fetchWorkspaces()
      }
      return newWorkspace
    } catch (err: any) {
      console.error('[useWorkspaces] Create error:', err)
      const errorMessage = err?.message || err?.detail?.[0]?.msg || 'Failed to create workspace'
      throw new Error(errorMessage)
    }
  }, [fetchWorkspaces])

  const deleteWorkspace = useCallback(async (workspaceId: string) => {
    try {
      await api.workspaces.deleteWorkspace(workspaceId)
      if (isMountedRef.current) {
        setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId))
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete workspace')
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    fetchWorkspaces()
    
    return () => {
      isMountedRef.current = false
    }
  }, [fetchWorkspaces])

  const refresh = useCallback(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  return { workspaces, loading, error, refresh, createWorkspace, deleteWorkspace }
}
