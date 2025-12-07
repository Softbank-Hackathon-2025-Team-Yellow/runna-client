// Real API service for function operations

import { http } from '../http'
import type { IFunctionService } from './types'
import type {
  FunctionItem,
  FunctionDetail,
  FunctionCreate,
  FunctionUpdate,
  FunctionMetrics,
  DeployRequest,
  DeployResult,
  JobList,
} from '../types'

export const functionService: IFunctionService = {
  async getFunctions(): Promise<FunctionItem[]> {
    const response = await http.get<FunctionItem[] | { functions: FunctionItem[] }>('/functions/')
    // Handle both array and object response formats
    if (Array.isArray(response.data)) {
      return response.data
    }
    return response.data.functions || []
  },

  async getFunction(functionId: string): Promise<FunctionDetail> {
    const response = await http.get<FunctionDetail>(`/functions/${functionId}`)
    return response.data
  },

  async createFunction(data: FunctionCreate): Promise<FunctionDetail> {
    const response = await http.post<FunctionDetail>('/functions/', data)
    return response.data
  },

  async updateFunction(functionId: string, data: FunctionUpdate): Promise<FunctionDetail> {
    const response = await http.put<FunctionDetail>(`/functions/${functionId}`, data)
    return response.data
  },

  async deleteFunction(functionId: string): Promise<void> {
    await http.delete(`/functions/${functionId}`)
  },

  async deployFunction(functionId: string, deployRequest?: DeployRequest): Promise<DeployResult> {
    const response = await http.post<DeployResult>(
      `/functions/${functionId}/deploy`,
      deployRequest || {}
    )
    return response.data
  },

  async getJobs(functionId: string): Promise<JobList> {
    const response = await http.get<JobList | { jobs: any[] }>(`/functions/${functionId}/jobs`)
    // Handle different response formats
    if ('jobs' in response.data && Array.isArray(response.data.jobs)) {
      return { jobs: response.data.jobs, total: response.data.jobs.length }
    }
    return response.data as JobList
  },

  async getMetrics(functionId: string): Promise<FunctionMetrics> {
    const response = await http.get<FunctionMetrics>(`/functions/${functionId}/metrics`)
    return response.data
  },
}
