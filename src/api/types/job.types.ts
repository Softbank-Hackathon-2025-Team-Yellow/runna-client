// Job related types from OpenAPI spec

export type JobStatus = 'pending' | 'running' | 'success' | 'error'

export interface Job {
  id: string // UUID or number depending on API
  function_id: string // UUID
  status: JobStatus
  input?: any
  output?: any
  error?: string
  created_at: string
  started_at?: string
  completed_at?: string
  duration?: number
}

export interface JobList {
  jobs: Job[]
  total?: number
}
