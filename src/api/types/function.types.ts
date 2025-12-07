// Function related types from OpenAPI spec

export type Runtime = 'PYTHON' | 'NODEJS'
export type FunctionStatus = 'active' | 'inactive' | 'error' | 'pending' | 'running' | 'succeeded' | 'failed' | 'deployed'

export interface FunctionItem {
  id: string // UUID
  name: string
  runtime: Runtime
  workspace_id: string // UUID
  created_at: string
  updated_at: string
  status?: FunctionStatus
  endpoint?: string | null
  knative_url?: string | null
}

export interface FunctionDetail extends FunctionItem {
  code: string
}

export interface FunctionCreate {
  name: string
  runtime: Runtime
  code: string
  workspace_id: string // UUID
  endpoint?: string | null
}

export interface FunctionUpdate {
  name?: string | null
  runtime?: Runtime | null
  code?: string | null
  endpoint?: string | null
}

export interface FunctionMetrics {
  total_executions: number
  success_count: number
  error_count: number
  avg_duration: number
}

// Deploy related types
export interface DeployRequest {
  env_vars?: Record<string, string>
}

export interface DeployResult {
  status: 'SUCCESS' | 'FAILED'
  knative_url?: string
  message?: string
  success?: boolean
  error?: {
    code?: string
    message?: string
  }
}
