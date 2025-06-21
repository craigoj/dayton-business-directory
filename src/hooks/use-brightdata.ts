import { useMutation, useQuery } from '@tanstack/react-query'

const API_BASE = '/api/brightdata'

// Search businesses using BrightData
export function useBrightDataSearch() {
  return useMutation({
    mutationFn: async (params: {
      location: string
      category?: string
      radius?: number
      limit?: number
    }) => {
      const response = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to search businesses')
      }
      
      return response.json()
    },
  })
}

// Enrich business data
export function useEnrichBusiness() {
  return useMutation({
    mutationFn: async (businessId: string) => {
      const response = await fetch(`${API_BASE}/enrich`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to enrich business data')
      }
      
      return response.json()
    },
  })
}

// Get competitor analysis
export function useCompetitorAnalysis() {
  return useMutation({
    mutationFn: async (businessId: string) => {
      const response = await fetch(`${API_BASE}/competitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze competitors')
      }
      
      return response.json()
    },
  })
}