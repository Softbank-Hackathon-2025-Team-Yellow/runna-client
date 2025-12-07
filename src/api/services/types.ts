// Service interfaces that both mock and real implementations follow

import type {
  User,
  UserCreate,
  UserLogin,
  Token,
  Workspace,
  WorkspaceCreate,
  WorkspaceUpdate,
  WorkspaceAuthKey,
  WorkspaceMetrics,
  FunctionItem,
  FunctionDetail,
  FunctionCreate,
  FunctionUpdate,
  FunctionMetrics,
  DeployRequest,
  DeployResult,
  Job,
  JobList,
} from '../types'

export interface IUserService {
  register(user: UserCreate): Promise<User>
  login(credentials: UserLogin): Promise<Token>
  getCurrentUser(): Promise<User>
}

export interface IWorkspaceService {
  getWorkspaces(): Promise<Workspace[]>
  getWorkspace(workspaceId: string): Promise<Workspace>
  createWorkspace(data: WorkspaceCreate): Promise<Workspace>
  updateWorkspace(workspaceId: string, data: WorkspaceUpdate): Promise<Workspace>
  deleteWorkspace(workspaceId: string): Promise<void>
  getApiKey(workspaceId: string): Promise<WorkspaceAuthKey>
  getMetrics(workspaceId: string): Promise<WorkspaceMetrics>
  getFunctions(workspaceId: string): Promise<FunctionItem[]>
}

export interface IFunctionService {
  getFunctions(): Promise<FunctionItem[]>
  getFunction(functionId: string): Promise<FunctionDetail>
  createFunction(data: FunctionCreate): Promise<FunctionDetail>
  updateFunction(functionId: string, data: FunctionUpdate): Promise<FunctionDetail>
  deleteFunction(functionId: string): Promise<void>
  deployFunction(functionId: string, deployRequest?: DeployRequest): Promise<DeployResult>
  getJobs(functionId: string): Promise<JobList>
  getMetrics(functionId: string): Promise<FunctionMetrics>
}

export interface IJobService {
  getJob(jobId: string): Promise<Job>
}
