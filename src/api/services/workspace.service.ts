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
  console.log('[Workspaces API] Response data:', JSON.stringify(data, null, 2), 'Type:', typeof data)
  
  // Handle null/undefined
  if (!data) {
    console.log('[Workspaces API] Data is null/undefined, returning empty array')
    return []
  }
  
  // Direct array
  if (Array.isArray(data)) {
    console.log('[Workspaces API] Data is array, length:', data.length)
    return data
  }
  
  // Wrapped in 'workspaces' key
  if ('workspaces' in data && Array.isArray(data.workspaces)) {
    console.log('[Workspaces API] Data has workspaces key, length:', data.workspaces.length)
    return data.workspaces
  }
  
  // Wrapped in 'data' key (common pattern)
  if ('data' in data && Array.isArray(data.data)) {
    console.log('[Workspaces API] Data has data key, length:', data.data.length)
    return data.data
  }
  
  // Wrapped in 'items' key
  if ('items' in data && Array.isArray(data.items)) {
    console.log('[Workspaces API] Data has items key, length:', data.items.length)
    return data.items
  }
  
  // If data is an object (dictionary-like response with workspace IDs as keys)
  // e.g., { "uuid-1": { id: "uuid-1", name: "ws1", ... }, "uuid-2": { ... } }
  if (typeof data === 'object') {
    const keys = Object.keys(data)
    const values = Object.values(data)
    
    // Check if all values look like workspace objects
    if (values.length > 0) {
      const allWorkspaces = values.every((v: any) => 
        v && typeof v === 'object' && 'id' in v && 'name' in v
      )
      if (allWorkspaces) {
        console.log('[Workspaces API] Data is object with workspace values, length:', values.length)
        return values as Workspace[]
      }
    }
    
    // Check if data itself is a single workspace object (edge case)
    if ('id' in data && 'name' in data && 'created_at' in data) {
      console.log('[Workspaces API] Data is a single workspace, wrapping in array')
      return [data as Workspace]
    }
    
    // Empty object case
    if (keys.length === 0) {
      console.log('[Workspaces API] Data is empty object, returning empty array')
      return []
    }
  }
  
  console.log('[Workspaces API] Could not extract workspaces, returning empty array')
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
