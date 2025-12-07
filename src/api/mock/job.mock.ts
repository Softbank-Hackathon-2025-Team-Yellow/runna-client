// Mock service for job operations

import type { IJobService } from '../services/types'
import type { Job } from '../types'
import { delay } from './utils'

const MOCK_JOBS: Job[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    function_id: '550e8400-e29b-41d4-a716-446655440001',
    status: 'success',
    input: { image: 'test.jpg', width: 800, height: 600 },
    output: { resized_image: 'test_resized.jpg' },
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    started_at: new Date(Date.now() - 59 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 58 * 60 * 1000).toISOString(),
    duration: 1234,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    function_id: '550e8400-e29b-41d4-a716-446655440002',
    status: 'error',
    input: { data: 'invalid' },
    error: 'Validation failed: Invalid data format',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    started_at: new Date(Date.now() - 119 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 118 * 60 * 1000).toISOString(),
    duration: 567,
  },
]

export const mockJobService: IJobService = {
  async getJob(jobId: string): Promise<Job> {
    await delay(300)
    const job = MOCK_JOBS.find((j) => j.id === jobId)
    if (!job) {
      throw new Error('Job not found')
    }
    return job
  },
}
