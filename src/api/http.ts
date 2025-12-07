import axios from 'axios'
import type { ApiError } from './types'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('[API Response]', {
      url: response.config?.url,
      method: response.config?.method,
      status: response.status,
      data: response.data,
    })
    return response
  },
  (error) => {
    // Transform error into ApiError format
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status || 0,
      code: error.response?.data?.code,
      errors: error.response?.data?.errors,
      detail: error.response?.data?.detail,
    }

    // Categorize error type
    if (apiError.status === 0) {
      // Network error
      apiError.message = 'Network error: Unable to connect to the server'
      console.error('[Network Error]', apiError)
    } else if (apiError.status >= 400 && apiError.status < 500) {
      // Client error (4xx)
      console.error('[Client Error]', apiError)
      
      // Handle authentication error
      if (apiError.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } else if (apiError.status >= 500) {
      // Server error (5xx)
      apiError.message = apiError.message || 'Server error: Please try again later'
      console.error('[Server Error]', apiError)
    }

    // Log error for debugging
    console.error('[API Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: apiError.status,
      message: apiError.message,
    })

    return Promise.reject(apiError)
  }
)

export { http }
