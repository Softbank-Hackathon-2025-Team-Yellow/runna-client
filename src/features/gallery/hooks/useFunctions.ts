import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/api/services'
import type { FunctionItem } from '@/api/types'

// Helper function to convert API FunctionItem to gallery FunctionItem
const convertToGalleryFunction = (apiFunc: FunctionItem): any => {
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    const diffWeeks = Math.floor(diffMs / 604800000)
    const diffMonths = Math.floor(diffMs / 2592000000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffWeeks < 4) return `${diffWeeks} weeks ago`
    return `${diffMonths} months ago`
  }

  return {
    id: apiFunc.id,
    name: apiFunc.name,
    language: apiFunc.runtime === 'NODEJS' ? 'Node.js' : 'Python',
    lastUpdated: getRelativeTime(apiFunc.updated_at),
    status: apiFunc.status || 'pending',
    knativeUrl: apiFunc.knative_url,
  }
}

export const useFunctions = () => {
  const [functions, setFunctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)

  const fetchFunctions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await api.functions.getFunctions()
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        const galleryFunctions = data.map(convertToGalleryFunction)
        setFunctions(galleryFunctions)
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to fetch functions'))
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true
    fetchFunctions()
    
    return () => {
      isMountedRef.current = false
    }
  }, [fetchFunctions])

  const refresh = useCallback(() => {
    fetchFunctions()
  }, [fetchFunctions])

  return { functions, loading, error, refresh }
}
