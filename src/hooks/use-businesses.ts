import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BusinessWithRelations, BusinessFormData, BusinessUpdateData } from '@/types'

const API_BASE = '/api/businesses'

// Fetch businesses with pagination and filters
export function useBusinesses(params: {
  category?: string
  city?: string
  state?: string
  featured?: boolean
  search?: string
  page?: number
  limit?: number
} = {}) {
  return useQuery({
    queryKey: ['businesses', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
      
      const response = await fetch(`${API_BASE}?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch businesses')
      }
      return response.json()
    },
  })
}

// Fetch single business by ID
export function useBusiness(id: string) {
  return useQuery({
    queryKey: ['business', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch business')
      }
      return response.json()
    },
    enabled: !!id,
  })
}

// Create business mutation
export function useCreateBusiness() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: BusinessFormData) => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create business')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] })
    },
  })
}

// Update business mutation
export function useUpdateBusiness() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BusinessUpdateData }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update business')
      }
      
      return response.json()
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] })
      queryClient.invalidateQueries({ queryKey: ['business', variables.id] })
    },
  })
}

// Delete business mutation
export function useDeleteBusiness() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete business')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] })
    },
  })
}