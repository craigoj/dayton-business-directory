import { create } from 'zustand'
import { LeadWithRelations, LeadStatus, Priority } from '@/types'

interface LeadState {
  leads: LeadWithRelations[]
  newLeadsCount: number
  isLoading: boolean
  setLeads: (leads: LeadWithRelations[]) => void
  setLoading: (loading: boolean) => void
  addLead: (lead: LeadWithRelations) => void
  updateLead: (id: string, updates: Partial<LeadWithRelations>) => void
  removeLead: (id: string) => void
  getLeadsByStatus: (status: LeadStatus) => LeadWithRelations[]
  getLeadsByPriority: (priority: Priority) => LeadWithRelations[]
  markAsRead: (id: string) => void
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  newLeadsCount: 0,
  isLoading: false,
  
  setLeads: (leads) => set({ 
    leads,
    newLeadsCount: leads.filter(l => l.status === 'NEW').length
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  addLead: (lead) => set((state) => ({
    leads: [lead, ...state.leads],
    newLeadsCount: lead.status === 'NEW' ? state.newLeadsCount + 1 : state.newLeadsCount
  })),
  
  updateLead: (id, updates) => set((state) => {
    const updatedLeads = state.leads.map(l => 
      l.id === id ? { ...l, ...updates } : l
    )
    
    return {
      leads: updatedLeads,
      newLeadsCount: updatedLeads.filter(l => l.status === 'NEW').length
    }
  }),
  
  removeLead: (id) => set((state) => {
    const leadToRemove = state.leads.find(l => l.id === id)
    const filteredLeads = state.leads.filter(l => l.id !== id)
    
    return {
      leads: filteredLeads,
      newLeadsCount: leadToRemove?.status === 'NEW' 
        ? state.newLeadsCount - 1 
        : state.newLeadsCount
    }
  }),
  
  getLeadsByStatus: (status) => {
    return get().leads.filter(l => l.status === status)
  },
  
  getLeadsByPriority: (priority) => {
    return get().leads.filter(l => l.priority === priority)
  },
  
  markAsRead: (id) => {
    const { updateLead } = get()
    updateLead(id, { status: 'CONTACTED' })
  },
}))