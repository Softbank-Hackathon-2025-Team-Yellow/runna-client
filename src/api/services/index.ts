// Service factory that switches between mock and real services based on environment

import { userService } from './user.service'
import { workspaceService } from './workspace.service'
import { functionService } from './function.service'
import { jobService } from './job.service'

import { mockUserService } from '../mock/user.mock'
import { mockWorkspaceService } from '../mock/workspace.mock'
import { mockFunctionService } from '../mock/function.mock'
import { mockJobService } from '../mock/job.mock'

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

export const api = {
  users: USE_MOCK_DATA ? mockUserService : userService,
  workspaces: USE_MOCK_DATA ? mockWorkspaceService : workspaceService,
  functions: USE_MOCK_DATA ? mockFunctionService : functionService,
  jobs: USE_MOCK_DATA ? mockJobService : jobService,
}

// Export types for convenience
export type { IUserService, IWorkspaceService, IFunctionService, IJobService } from './types'
