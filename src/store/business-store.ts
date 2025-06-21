import { create } from 'zustand'
import { BusinessWithRelations, DashboardStats } from '@/types'

interface BusinessState {
  businesses: BusinessWithRelations[]
  selectedBusiness: BusinessWithRelations | null
  stats: DashboardStats | null
  isLoading: boolean
  setBusinesses: (businesses: BusinessWithRelations[]) => void
  setSelectedBusiness: (business: BusinessWithRelations | null) => void
  setStats: (stats: DashboardStats) => void
  setLoading: (loading: boolean) => void
  addBusiness: (business: BusinessWithRelations) => void
  updateBusiness: (id: string, updates: Partial<BusinessWithRelations>) => void
  removeBusiness: (id: string) => void
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  selectedBusiness: null,
  stats: null,
  isLoading: false,
  
  setBusinesses: (businesses) => set({ businesses }),
  setSelectedBusiness: (selectedBusiness) => set({ selectedBusiness }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  
  addBusiness: (business) => set((state) => ({
    businesses: [...state.businesses, business]
  })),
  
  updateBusiness: (id, updates) => set((state) => ({
    businesses: state.businesses.map(b => 
      b.id === id ? { ...b, ...updates } : b
    ),
    selectedBusiness: state.selectedBusiness?.id === id 
      ? { ...state.selectedBusiness, ...updates }
      : state.selectedBusiness
  })),
  
  removeBusiness: (id) => set((state) => ({
    businesses: state.businesses.filter(b => b.id !== id),
    selectedBusiness: state.selectedBusiness?.id === id 
      ? null 
      : state.selectedBusiness
  })),
}))