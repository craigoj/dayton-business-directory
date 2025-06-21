import { z } from 'zod'
import { BusinessCategory, BusinessStatus, LeadSource, LeadStatus, Priority, UserRole } from '@prisma/client'

export const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.nativeEnum(BusinessCategory),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2),
  zipCode: z.string().min(5, 'Valid zip code required').max(10),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  hours: z.record(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
})

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().max(1000).optional(),
  source: z.nativeEnum(LeadSource).optional(),
  businessId: z.string().cuid(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  content: z.string().max(1000).optional(),
  authorName: z.string().min(1, 'Name is required').max(100),
  authorEmail: z.string().email().optional(),
  businessId: z.string().cuid(),
})

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional(),
})

export const leadUpdateSchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  assignedTo: z.string().cuid().optional(),
  notes: z.string().max(1000).optional(),
})

export const businessUpdateSchema = businessSchema.partial()

export const analyticsSchema = z.object({
  metric: z.string(),
  value: z.number(),
  date: z.date().optional(),
  businessId: z.string().cuid().optional(),
  metadata: z.record(z.any()).optional(),
})

export type BusinessFormData = z.infer<typeof businessSchema>
export type LeadFormData = z.infer<typeof leadSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type UserUpdateData = z.infer<typeof userUpdateSchema>
export type LeadUpdateData = z.infer<typeof leadUpdateSchema>
export type BusinessUpdateData = z.infer<typeof businessUpdateSchema>
export type AnalyticsData = z.infer<typeof analyticsSchema>