import { User, Business, Lead, Review, Analytics, UserRole, BusinessCategory, BusinessStatus, LeadSource, LeadStatus, Priority, AnalyticType } from '@prisma/client'

export type {
  User,
  Business,
  Lead,
  Review,
  Analytics,
  UserRole,
  BusinessCategory,
  BusinessStatus,
  LeadSource,
  LeadStatus,
  Priority,
  AnalyticType
}

export interface BusinessWithRelations extends Business {
  owner: User
  leads: Lead[]
  reviews: Review[]
  analytics: Analytics[]
}

export interface LeadWithRelations extends Lead {
  business: Business
  assignedTo?: User
}

export interface DashboardStats {
  totalBusinesses: number
  totalLeads: number
  newLeads: number
  conversionRate: number
  avgRating: number
}

export interface LeadRouting {
  leadId: string
  businessId: string
  assignedTo?: string
  priority: Priority
  estimatedValue?: number
}

export interface BrightDataResult {
  businessName: string
  address: string
  phone?: string
  website?: string
  category: string
  hours?: Record<string, string>
  socialMedia?: Record<string, string>
}

export interface SocketEvents {
  'lead:new': LeadWithRelations
  'lead:updated': LeadWithRelations
  'lead:assigned': LeadRouting
  'business:updated': Business
  'analytics:updated': Analytics
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
    }
  }

  interface User {
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
  }
}