// Mock service for workspace operations

import type { IWorkspaceService } from '../services/types'
import type {
  Workspace,
  WorkspaceCreate,
  WorkspaceUpdate,
  WorkspaceAuthKey,
  WorkspaceMetrics,
  FunctionItem,
} from '../types'
import { delay } from './utils'

const MOCK_WORKSPACES: Workspace[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Production Environment',
    owner_id: 1,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Development Workspace',
    owner_id: 1,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Staging Environment',
    owner_id: 1,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Testing Sandbox',
    owner_id: 1,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Personal Projects',
    owner_id: 1,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'API Microservices',
    owner_id: 1,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockWorkspaceService: IWorkspaceService = {
  async getWorkspaces(): Promise<Workspace[]> {
    await delay(400)
    return MOCK_WORKSPACES
  },

  async getWorkspace(workspaceId: string): Promise<Workspace> {
    await delay(300)
    const workspace = MOCK_WORKSPACES.find((w) => w.id === workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    return workspace
  },

  async createWorkspace(data: WorkspaceCreate): Promise<Workspace> {
    await delay(500)
    const newWorkspace: Workspace = {
      id: `550e8400-e29b-41d4-a716-${Date.now()}`,
      name: data.name,
      owner_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    MOCK_WORKSPACES.push(newWorkspace)
    return newWorkspace
  },

  async updateWorkspace(workspaceId: string, data: WorkspaceUpdate): Promise<Workspace> {
    await delay(400)
    const workspace = MOCK_WORKSPACES.find((w) => w.id === workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    if (data.name) {
      workspace.name = data.name
    }
    workspace.updated_at = new Date().toISOString()
    return workspace
  },

  async deleteWorkspace(workspaceId: string): Promise<void> {
    await delay(300)
    const index = MOCK_WORKSPACES.findIndex((w) => w.id === workspaceId)
    if (index === -1) {
      throw new Error('Workspace not found')
    }
    MOCK_WORKSPACES.splice(index, 1)
  },

  async generateAuthKey(workspaceId: string, expiresHours: number = 24): Promise<WorkspaceAuthKey> {
    await delay(300)
    const workspace = MOCK_WORKSPACES.find((w) => w.id === workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    return {
      key: `ws_key_${Math.random().toString(36).substring(7)}`,
      workspace_id: workspaceId,
      expires_at: new Date(Date.now() + expiresHours * 60 * 60 * 1000).toISOString(),
    }
  },

  async getMetrics(workspaceId: string): Promise<WorkspaceMetrics> {
    await delay(400)
    const workspace = MOCK_WORKSPACES.find((w) => w.id === workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    
    // Different metrics for different workspaces
    const metricsMap: Record<string, WorkspaceMetrics> = {
      '550e8400-e29b-41d4-a716-446655440000': {
        total_functions: 12,
        total_executions: 3547,
        total_execution_time: 125890,
        success_rate: 0.97,
      },
      '550e8400-e29b-41d4-a716-446655440001': {
        total_functions: 8,
        total_executions: 1247,
        total_execution_time: 45623,
        success_rate: 0.89,
      },
      '550e8400-e29b-41d4-a716-446655440002': {
        total_functions: 6,
        total_executions: 892,
        total_execution_time: 32145,
        success_rate: 0.95,
      },
      '550e8400-e29b-41d4-a716-446655440003': {
        total_functions: 15,
        total_executions: 567,
        total_execution_time: 18234,
        success_rate: 0.82,
      },
      '550e8400-e29b-41d4-a716-446655440004': {
        total_functions: 4,
        total_executions: 234,
        total_execution_time: 8912,
        success_rate: 0.91,
      },
      '550e8400-e29b-41d4-a716-446655440005': {
        total_functions: 10,
        total_executions: 2156,
        total_execution_time: 78456,
        success_rate: 0.96,
      },
    }
    
    return metricsMap[workspaceId] || {
      total_functions: 8,
      total_executions: 1247,
      total_execution_time: 45623,
      success_rate: 0.94,
    }
  },

  async getFunctions(workspaceId: string): Promise<FunctionItem[]> {
    await delay(500)
    const workspace = MOCK_WORKSPACES.find((w) => w.id === workspaceId)
    if (!workspace) {
      throw new Error('Workspace not found')
    }
    
    // Different functions for different workspaces
    const functionsMap: Record<string, FunctionItem[]> = {
      '550e8400-e29b-41d4-a716-446655440000': [
        {
          id: 1,
          name: 'Image Resizer',
          runtime: 'nodejs',
          execution_type: 'sync',
          workspace_id: workspaceId,
          status: 'succeeded',
          description: 'Resize images on the fly',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          name: 'Data Validator',
          runtime: 'python',
          execution_type: 'async',
          workspace_id: workspaceId,
          status: 'succeeded',
          description: 'Validate incoming data',
          created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          name: 'Auth Token Generator',
          runtime: 'nodejs',
          execution_type: 'sync',
          workspace_id: workspaceId,
          status: 'running',
          description: 'Generate JWT tokens',
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 4,
          name: 'PDF Report Creator',
          runtime: 'python',
          execution_type: 'async',
          workspace_id: workspaceId,
          status: 'succeeded',
          description: 'Generate PDF reports',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      '550e8400-e29b-41d4-a716-446655440001': [
        {
          id: 5,
          name: 'Webhook Processor',
          runtime: 'nodejs',
          execution_type: 'async',
          workspace_id: workspaceId,
          status: 'succeeded',
          description: 'Process incoming webhooks',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 6,
          name: 'Email Notifier',
          runtime: 'python',
          execution_type: 'async',
          workspace_id: workspaceId,
          status: 'pending',
          description: 'Send email notifications',
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 7,
          name: 'DB Query Executor',
          runtime: 'python',
          execution_type: 'sync',
          workspace_id: workspaceId,
          status: 'failed',
          description: 'Execute database queries',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      '550e8400-e29b-41d4-a716-446655440002': [
        {
          id: 8,
          name: 'Cache Manager',
          runtime: 'nodejs',
          execution_type: 'sync',
          workspace_id: workspaceId,
          status: 'succeeded',
          description: 'Manage Redis cache',
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 9,
          name: 'File Uploader',
          runtime: 'nodejs',
          execution_type: 'async',
          workspace_id: workspaceId,
          status: 'running',
          description: 'Upload files to S3',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    }
    
    return functionsMap[workspaceId] || []
  },
}
