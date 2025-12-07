import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/api/services'
import type { FunctionDetail } from '@/api/types'

export const useFunction = (functionId: number | null) => {
  const [functionData, setFunctionData] = useState<FunctionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)

  const fetchFunction = useCallback(async () => {
    if (!functionId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await api.functions.getFunction(functionId)
      
      if (isMountedRef.current) {
        setFunctionData(data)
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to fetch function'))
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [functionId])

  useEffect(() => {
    isMountedRef.current = true
    fetchFunction()
    
    return () => {
      isMountedRef.current = false
    }
  }, [fetchFunction])

  const refresh = useCallback(() => {
    fetchFunction()
  }, [fetchFunction])

  return { functionData, loading, error, refresh }
}
