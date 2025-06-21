'use client'

import { useState, useCallback, useMemo } from 'react'
import { BusinessCategory } from '@/types'

export interface SearchFilters {
  query: string
  category: BusinessCategory | 'ALL'
  location: string
  radius: number
  featured: boolean
  verified: boolean
  sortBy: 'relevance' | 'rating' | 'distance' | 'newest'
}

export interface SearchSuggestion {
  id: string
  type: 'service' | 'business' | 'category'
  label: string
  category?: BusinessCategory
  description?: string
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  category: 'ALL',
  location: '',
  radius: 10,
  featured: false,
  verified: false,
  sortBy: 'relevance'
}

const SERVICE_SUGGESTIONS: SearchSuggestion[] = [
  { id: 'restaurants', type: 'category', label: 'Restaurants', category: 'RESTAURANT', description: 'Dining, takeout, catering' },
  { id: 'coffee-shops', type: 'service', label: 'Coffee Shops', category: 'RESTAURANT', description: 'Coffee, espresso, cafes' },
  { id: 'pizza', type: 'service', label: 'Pizza', category: 'RESTAURANT', description: 'Pizza delivery and restaurants' },
  { id: 'italian-food', type: 'service', label: 'Italian Food', category: 'RESTAURANT', description: 'Italian restaurants and cuisine' },
  
  { id: 'retail', type: 'category', label: 'Retail', category: 'RETAIL', description: 'Shopping, stores, boutiques' },
  { id: 'clothing', type: 'service', label: 'Clothing Stores', category: 'RETAIL', description: 'Fashion, apparel, accessories' },
  { id: 'electronics', type: 'service', label: 'Electronics', category: 'RETAIL', description: 'Computers, phones, gadgets' },
  
  { id: 'services', type: 'category', label: 'Services', category: 'SERVICES', description: 'Professional services' },
  { id: 'plumbing', type: 'service', label: 'Plumbing', category: 'SERVICES', description: 'Plumbers, pipe repair, installation' },
  { id: 'electrician', type: 'service', label: 'Electrician', category: 'SERVICES', description: 'Electrical services and repair' },
  { id: 'lawn-care', type: 'service', label: 'Lawn Care', category: 'SERVICES', description: 'Landscaping, mowing, gardening' },
  { id: 'cleaning', type: 'service', label: 'Cleaning Services', category: 'SERVICES', description: 'House cleaning, commercial cleaning' },
  
  { id: 'healthcare', type: 'category', label: 'Healthcare', category: 'HEALTHCARE', description: 'Medical services, doctors' },
  { id: 'dentist', type: 'service', label: 'Dentist', category: 'HEALTHCARE', description: 'Dental care and orthodontics' },
  { id: 'doctor', type: 'service', label: 'Doctor', category: 'HEALTHCARE', description: 'Primary care physicians' },
  { id: 'veterinarian', type: 'service', label: 'Veterinarian', category: 'HEALTHCARE', description: 'Pet care and animal hospitals' },
  
  { id: 'automotive', type: 'category', label: 'Automotive', category: 'AUTOMOTIVE', description: 'Car services and repair' },
  { id: 'auto-repair', type: 'service', label: 'Auto Repair', category: 'AUTOMOTIVE', description: 'Car maintenance and fixing' },
  { id: 'oil-change', type: 'service', label: 'Oil Change', category: 'AUTOMOTIVE', description: 'Quick oil change services' },
  { id: 'tire-service', type: 'service', label: 'Tire Service', category: 'AUTOMOTIVE', description: 'Tire installation and repair' },
  
  { id: 'real-estate', type: 'category', label: 'Real Estate', category: 'REAL_ESTATE', description: 'Property services' },
  { id: 'realtor', type: 'service', label: 'Realtor', category: 'REAL_ESTATE', description: 'Real estate agents' },
  
  { id: 'fitness', type: 'category', label: 'Fitness', category: 'FITNESS', description: 'Gyms and wellness' },
  { id: 'gym', type: 'service', label: 'Gym', category: 'FITNESS', description: 'Fitness centers and workouts' },
  { id: 'yoga', type: 'service', label: 'Yoga Studio', category: 'FITNESS', description: 'Yoga classes and instruction' },
  
  { id: 'beauty', type: 'category', label: 'Beauty', category: 'BEAUTY', description: 'Beauty and personal care' },
  { id: 'hair-salon', type: 'service', label: 'Hair Salon', category: 'BEAUTY', description: 'Hair cutting and styling' },
  { id: 'nail-salon', type: 'service', label: 'Nail Salon', category: 'BEAUTY', description: 'Manicures and pedicures' },
  
  { id: 'education', type: 'category', label: 'Education', category: 'EDUCATION', description: 'Schools and learning' },
  { id: 'tutoring', type: 'service', label: 'Tutoring', category: 'EDUCATION', description: 'Academic tutoring services' },
  
  { id: 'technology', type: 'category', label: 'Technology', category: 'TECHNOLOGY', description: 'Tech services and support' },
  { id: 'computer-repair', type: 'service', label: 'Computer Repair', category: 'TECHNOLOGY', description: 'PC and laptop repair' },
]

const LOCATION_SUGGESTIONS = [
  'Dayton, OH',
  'Kettering, OH', 
  'Beavercreek, OH',
  'Fairborn, OH',
  'Centerville, OH',
  'Huber Heights, OH',
  'Springboro, OH',
  'Miamisburg, OH',
  'Oakwood, OH',
  'Vandalia, OH',
  'Trotwood, OH',
  'Bellbrook, OH',
  '45402', '45404', '45405', '45406', '45409', // Dayton ZIP codes
  '45429', '45440', '45449', // Kettering ZIP codes
  '45324', '45385', '45434', // Beavercreek ZIP codes
]

export function useSearch() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [isSearching, setIsSearching] = useState(false)

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const getServiceSuggestions = useCallback((query: string): SearchSuggestion[] => {
    if (!query.trim()) return []
    
    const lowerQuery = query.toLowerCase()
    return SERVICE_SUGGESTIONS.filter(suggestion =>
      suggestion.label.toLowerCase().includes(lowerQuery) ||
      suggestion.description?.toLowerCase().includes(lowerQuery)
    ).slice(0, 8)
  }, [])

  const getLocationSuggestions = useCallback((query: string): string[] => {
    if (!query.trim()) return []
    
    const lowerQuery = query.toLowerCase()
    return LOCATION_SUGGESTIONS.filter(location =>
      location.toLowerCase().includes(lowerQuery)
    ).slice(0, 6)
  }, [])

  const searchParams = useMemo(() => {
    const params = new URLSearchParams()
    
    if (filters.query) params.set('q', filters.query)
    if (filters.category !== 'ALL') params.set('category', filters.category)
    if (filters.location) params.set('location', filters.location)
    if (filters.radius !== 10) params.set('radius', filters.radius.toString())
    if (filters.featured) params.set('featured', 'true')
    if (filters.verified) params.set('verified', 'true')
    if (filters.sortBy !== 'relevance') params.set('sort', filters.sortBy)
    
    return params
  }, [filters])

  return {
    filters,
    updateFilters,
    resetFilters,
    getServiceSuggestions,
    getLocationSuggestions,
    searchParams,
    isSearching,
    setIsSearching,
  }
}