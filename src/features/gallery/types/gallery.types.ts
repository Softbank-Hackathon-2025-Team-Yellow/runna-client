import type { ExecutionType } from '@/api/types'

export type FunctionStatus = 'succeeded' | 'pending' | 'running' | 'failed'

export interface FunctionItem {
  id: string
  name: string
  language: string
  lastUpdated: string
  status: FunctionStatus
  executionType: ExecutionType
}

export interface GalleryContent {
  title: string
  description: string
  searchPlaceholder: string
  filterLabel: string
  newFunctionLabel: string
}
