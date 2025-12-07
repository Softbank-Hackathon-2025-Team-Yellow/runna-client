// Mock service for function operations

import type { IFunctionService } from '../services/types'
import type {
  FunctionItem,
  FunctionDetail,
  FunctionCreate,
  FunctionUpdate,
  FunctionMetrics,
  DeployRequest,
  DeployResult,
  JobList,
  Runtime,
} from '../types'
import { delay } from './utils'

const MOCK_FUNCTIONS: FunctionDetail[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Image Resizer',
    runtime: 'NODEJS' as Runtime,
    workspace_id: '550e8400-e29b-41d4-a716-446655440000',
    status: 'deployed',
    knative_url: 'https://image-resizer.default.example.com',
    code: `exports.handler = async (event) => {
  const { width, height, imageUrl } = JSON.parse(event.body);
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};`,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Data Validator',
    runtime: 'PYTHON' as Runtime,
    workspace_id: '550e8400-e29b-41d4-a716-446655440000',
    status: 'pending',
    code: `def handler(event, context):
    return {"statusCode": 200, "body": "Data validated"}`,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockFunctionService: IFunctionService = {
  async getFunctions(): Promise<FunctionItem[]> {
    await delay(500)
    return MOCK_FUNCTIONS.map(({ code, ...item }) => item)
  },

  async getFunction(functionId: string): Promise<FunctionDetail> {
    await delay(300)
    const func = MOCK_FUNCTIONS.find((f) => f.id === functionId)
    if (!func) {
      throw new Error('Function not found')
    }
    return func
  },

  async createFunction(data: FunctionCreate): Promise<FunctionDetail> {
    await delay(600)
    const newFunction: FunctionDetail = {
      id: crypto.randomUUID(),
      name: data.name,
      runtime: data.runtime,
      workspace_id: data.workspace_id,
      code: data.code,
      status: 'pending',
      endpoint: data.endpoint,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    MOCK_FUNCTIONS.push(newFunction)
    return newFunction
  },

  async updateFunction(functionId: string, data: FunctionUpdate): Promise<FunctionDetail> {
    await delay(400)
    const func = MOCK_FUNCTIONS.find((f) => f.id === functionId)
    if (!func) {
      throw new Error('Function not found')
    }
    
    if (data.name !== undefined && data.name !== null) func.name = data.name
    if (data.runtime !== undefined && data.runtime !== null) func.runtime = data.runtime
    if (data.code !== undefined && data.code !== null) func.code = data.code
    
    func.updated_at = new Date().toISOString()
    return func
  },

  async deleteFunction(functionId: string): Promise<void> {
    await delay(300)
    const index = MOCK_FUNCTIONS.findIndex((f) => f.id === functionId)
    if (index === -1) {
      throw new Error('Function not found')
    }
    MOCK_FUNCTIONS.splice(index, 1)
  },

  async deployFunction(functionId: string, deployRequest?: DeployRequest): Promise<DeployResult> {
    await delay(2000) // Simulate deployment time
    const func = MOCK_FUNCTIONS.find((f) => f.id === functionId)
    if (!func) {
      throw new Error('Function not found')
    }
    
    const isSuccess = Math.random() > 0.1
    
    if (isSuccess) {
      const knativeUrl = `https://${func.name.toLowerCase().replace(/\s+/g, '-')}.default.example.com`
      func.status = 'deployed'
      func.knative_url = knativeUrl
      func.updated_at = new Date().toISOString()
      
      return {
        status: 'SUCCESS',
        knative_url: knativeUrl,
        message: 'Function deployed successfully to K8s cluster',
      }
    } else {
      return {
        status: 'FAILED',
        success: false,
        error: {
          code: 'DEPLOYMENT_FAILED',
          message: 'Failed to deploy function to K8s cluster',
        },
      }
    }
  },

  async getJobs(functionId: string): Promise<JobList> {
    await delay(400)
    const func = MOCK_FUNCTIONS.find((f) => f.id === functionId)
    if (!func) {
      throw new Error('Function not found')
    }
    
    return {
      jobs: [
        {
          id: crypto.randomUUID(),
          function_id: functionId,
          status: 'success',
          input: { test: 'data' },
          output: { result: 'completed' },
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          duration: 1234,
        },
        {
          id: crypto.randomUUID(),
          function_id: functionId,
          status: 'error',
          input: { test: 'data2' },
          error: 'Execution failed',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          duration: 567,
        },
      ],
    }
  },

  async getMetrics(functionId: string): Promise<FunctionMetrics> {
    await delay(350)
    const func = MOCK_FUNCTIONS.find((f) => f.id === functionId)
    if (!func) {
      throw new Error('Function not found')
    }
    
    return {
      total_executions: 156,
      success_count: 142,
      error_count: 14,
      avg_duration: 1234,
    }
  },
}
