// Real API service for job operations

import { http } from '../http'
import type { IJobService } from './types'
import type { Job } from '../types'

export const jobService: IJobService = {
  async getJob(jobId: string): Promise<Job> {
    const response = await http.get<Job>(`/jobs/${jobId}`)
    return response.data
  },
}
