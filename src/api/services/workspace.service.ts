// Real API service for workspace operations

import { http } from '../http'
import type { IWorkspaceService } from './types'
import type {
  Workspace,
  WorkspaceCreate,
  WorkspaceUpdate,
  WorkspaceAuthKey,
  WorkspaceMetrics,
  FunctionItem,
} from '../types'

// Helper function to extract workspace from various response formats
const extractWorkspace = (data: any): Workspace => {
  console.log('[Workspace API] Response data:', data)
  // If data has 'id' field, it's likely a direct workspace object
  if (data && typeof data === 'object' && 'id' in data && 'name' in data) {
    return data as Workspace
  }
  // If wrapped in 'workspace' key
  if (data && 'workspace' in data) {
    return data.workspace as Workspace
  }
  return data as Workspace
}

// Helper function to extract workspaces array from various response formats
const extractWorkspaces = (data: any): Workspace[] => {
  console.log('[Workspaces API] Response data:', data)
  if (Array.isArray(data)) {
    return data
  }
  if (data && 'workspaces' in data && Array.isArray(data.workspaces)) {
    return data.workspaces
  }
  return []
}

// Helper function to extract functions array from various response formats
const extractFunctions = (data: any): FunctionItem[] => {
  console.log('[Functions API] Response data:', data)
  if (Array.isArray(data)) {
    return data
  }
  if (data && 'functions' in data && Array.isArray(data.functions)) {
    return data.functions
  }
  return []
}

export const workspaceService: IWorkspaceService = {
  async getWorkspaces(): Promise<Workspace[]> {
    const response = await http.get('/workspaces/')
    return extractWorkspaces(response.data)
  },

  async getWorkspace(workspaceId: string): Promise<Workspace> {
    const response = await http.get(`/workspaces/${workspaceId}`)
    return extractWorkspace(response.data)
  },

  async createWorkspace(data: WorkspaceCreate): Promise<Workspace> {
    const response = await http.post('/workspaces/', data)
    return extractWorkspace(response.data)
  },

  async updateWorkspace(workspaceId: string, data: WorkspaceUpdate): Promise<Workspace> {
    const response = await http.put(`/workspaces/${workspaceId}`, data)
    return extractWorkspace(response.data)
  },

  async deleteWorkspace(workspaceId: string): Promise<void> {
    await http.delete(`/workspaces/${workspaceId}`)
  },

  async generateAuthKey(workspaceId: string, expiresHours?: number): Promise<WorkspaceAuthKey> {
    const response = await http.post(`/workspaces/${workspaceId}/auth-keys`, { expires_hours: expiresHours })
    const data = response.data
    console.log('[Auth Key API] Response data:', data)
    // Handle various response formats
    if (data && 'key' in data) {
      return data as WorkspaceAuthKey
    }
    if (data && 'auth_key' in data) {
      return data.auth_key as WorkspaceAuthKey
    }
    return data as WorkspaceAuthKey
  },

  async getMetrics(workspaceId: string): Promise<WorkspaceMetrics> {
    const response = await http.get(`/workspaces/${workspaceId}/metrics`)
    const data = response.data
    console.log('[Metrics API] Response data:', data)
    // Handle various response formats
    if (data && 'total_functions' in data) {
      return data as WorkspaceMetrics
    }
    if (data && 'metrics' in data) {
      return data.metrics as WorkspaceMetrics
    }
    return data as WorkspaceMetrics
  },

  async getFunctions(workspaceId: string): Promise<FunctionItem[]> {
    const response = await http.get(`/workspaces/${workspaceId}/functions`)
    return extractFunctions(response.data)
  },
}
