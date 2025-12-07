// Function related types from OpenAPI spec

export type Runtime = 'PYTHON' | 'NODEJS'
export type ExecutionType = 'SYNC' | 'ASYNC'
export type FunctionStatus = 'active' | 'inactive' | 'error' | 'pending' | 'running' | 'succeeded' | 'failed'

export interface FunctionItem {
  id: string // UUID
  name: string
  runtime: Runtime
  execution_type: ExecutionType
  workspace_id: string // UUID
  created_at: string
  updated_at: string
  status?: FunctionStatus
  endpoint?: string | null
}

export interface FunctionDetail extends FunctionItem {
  code: string
}

export interface FunctionCreate {
  name: string
  runtime: Runtime
  code: string
  execution_type: ExecutionType
  workspace_id: string // UUID
  endpoint?: string | null
}

export interface FunctionUpdate {
  name?: string | null
  runtime?: Runtime | null
  code?: string | null
  execution_type?: ExecutionType | null
  endpoint?: string | null
}

export interface FunctionMetrics {
  total_executions: number
  success_count: number
  error_count: number
  avg_duration: number
}

export interface ExecutionResult {
  job_id?: string
  status: 'success' | 'error' | 'pending' | 'running'
  output?: any
  error?: string
  duration?: number
}

export interface InvokeFunctionRequest {
  [key: string]: any
}
