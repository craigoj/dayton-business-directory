import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LeadWithRelations, LeadFormData, LeadUpdateData } from '@/types'
import { LeadStatus, Priority } from '@prisma/client'

const API_BASE = '/api/leads'

// Fetch leads with filters
export function useLeads(params: {
  businessId?: string
  status?: LeadStatus
  priority?: Priority
  assignedTo?: string
  page?: number
  limit?: number
} = {}) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
      
      const response = await fetch(`${API_BASE}?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }
      return response.json()
    },
  })
}

// Fetch single lead by ID
export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch lead')
      }
      return response.json()
    },
    enabled: !!id,
  })
}

// Create lead mutation
export function useCreateLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create lead')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

// Update lead mutation
export function useUpdateLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LeadUpdateData }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update lead')
      }
      
      return response.json()
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] })
    },
  })
}

// Route lead mutation
export function useRouteLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      leadId: string
      assignmentType: 'auto' | 'manual'
      assignedTo?: string
      priority?: Priority
    }) => {
      const response = await fetch(`${API_BASE}/route-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to route lead')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

// Delete lead mutation
export function useDeleteLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete lead')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}