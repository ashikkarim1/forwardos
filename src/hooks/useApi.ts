import { useState, useCallback } from 'react'

interface ApiResponse<T> {
  data: T | null
  loading: boolean
  error: string | null
  success: boolean
}

export function useApi<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  })

  const fetch = useCallback(async (overrideOptions?: RequestInit) => {
    setState({ data: null, loading: true, error: null, success: false })

    try {
      const response = await window.fetch(url, {
        ...options,
        ...overrideOptions,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
          ...overrideOptions?.headers,
          'x-user-id': localStorage.getItem('userId') || '',
          'x-user-email': localStorage.getItem('userEmail') || '',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        setState({
          data: null,
          loading: false,
          error: error.error || 'API request failed',
          success: false,
        })
        return null
      }

      const data = await response.json()

      setState({
        data: data.data || data,
        loading: false,
        error: null,
        success: data.success !== false,
      })

      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false,
      })
      return null
    }
  }, [url, options])

  return { ...state, fetch }
}

export function useDeals(limit = 20, offset = 0, filters?: any) {
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    ...filters,
  }).toString()

  return useApi(`/api/deals?${query}`)
}

export function useDeal(id: string) {
  return useApi(`/api/deals/${id}`)
}

export function useUserProfile() {
  return useApi('/api/users/profile')
}

export function useWatchlist() {
  return useApi('/api/users/watchlist')
}

export function useHeatMaps(limit = 20) {
  return useApi(`/api/intelligence/heat-maps?limit=${limit}`)
}

export function usePredictions(limit = 20) {
  return useApi(`/api/intelligence/predictions?limit=${limit}`)
}

export function useSignals(limit = 100) {
  return useApi(`/api/intelligence/signals?limit=${limit}`)
}

export function useFeeds() {
  return useApi('/api/intelligence/feeds?comparables=true')
}

export function useVerifications(status?: string) {
  const query = status ? `?status=${status}` : ''
  return useApi(`/api/verification${query}`)
}
