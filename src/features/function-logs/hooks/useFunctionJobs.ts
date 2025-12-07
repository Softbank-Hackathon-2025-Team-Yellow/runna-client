import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/api/services'
import type { Job } from '@/api/types'

export const useFunctionJobs = (functionId: number | null) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)

  const fetchJobs = useCallback(async () => {
    if (!functionId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await api.functions.getJobs(functionId)
      
      if (isMountedRef.current) {
        setJobs(data.jobs)
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to fetch jobs'))
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [functionId])

  useEffect(() => {
    isMountedRef.current = true
    fetchJobs()
    
    return () => {
      isMountedRef.current = false
    }
  }, [fetchJobs])

  const refresh = useCallback(() => {
    fetchJobs()
  }, [fetchJobs])

  return { jobs, loading, error, refresh }
}
