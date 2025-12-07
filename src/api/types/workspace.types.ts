// Workspace related types from OpenAPI spec

export interface Workspace {
  id: string // UUID
  name: string
  created_at: string
  updated_at: string
  owner_id: number
}

export interface WorkspaceCreate {
  name: string
}

export interface WorkspaceUpdate {
  name?: string | null
}

export interface WorkspaceAuthKey {
  key: string
  workspace_id: string
  expires_at: string
}

export interface WorkspaceMetrics {
  total_functions: number
  total_executions: number
  total_execution_time: number
  success_rate: number
}
