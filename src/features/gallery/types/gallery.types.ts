export type FunctionStatus = 'succeeded' | 'pending' | 'running' | 'failed' | 'deployed'

export interface FunctionItem {
  id: string
  name: string
  language: string
  lastUpdated: string
  status: FunctionStatus
  knativeUrl?: string | null
}

export interface GalleryContent {
  title: string
  description: string
  searchPlaceholder: string
  filterLabel: string
  newFunctionLabel: string
}
