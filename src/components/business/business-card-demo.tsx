'use client'

import { BusinessCard } from './business-card'
import { BusinessWithRelations } from '@/types'

// Sample business data for demonstration
const sampleBusiness: BusinessWithRelations & { avgRating: number; totalReviews: number; totalLeads: number } = {
  id: '1',
  name: 'The Local Coffee House & Roastery',
  slug: 'local-coffee-house-roastery',
  description: 'Premium coffee roasted locally with exceptional customer service. We offer specialty drinks, fresh pastries, and a cozy atmosphere perfect for meetings or relaxation.',
  category: 'RESTAURANT' as const,
  phone: '9371234567',
  email: 'hello@localcoffeehouse.com',
  website: 'https://localcoffeehouse.com',
  address: '123 Main Street',
  city: 'Dayton',
  state: 'OH',
  zipCode: '45402',
  latitude: 39.7589,
  longitude: -84.1916,
  hours: {
    monday: '6:00 AM - 9:00 PM',
    tuesday: '6:00 AM - 9:00 PM',
    wednesday: '6:00 AM - 9:00 PM',
    thursday: '6:00 AM - 9:00 PM',
    friday: '6:00 AM - 10:00 PM',
    saturday: '7:00 AM - 10:00 PM',
    sunday: '7:00 AM - 8:00 PM'
  },
  images: ['/coffee-shop-1.jpg', '/coffee-shop-2.jpg'],
  verified: true,
  featured: true,
  status: 'ACTIVE' as const,
  brightDataId: null,
  lastDataSync: null,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-06-20'),
  ownerId: 'owner123',
  avgRating: 4.8,
  totalReviews: 127,
  totalLeads: 45,
  owner: {
    id: 'owner123',
    name: 'John Smith',
    email: 'john@localcoffeehouse.com',
    emailVerified: new Date(),
    image: null,
    role: 'BUSINESS_OWNER' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  leads: [],
  reviews: [],
  analytics: []
}

const unverifiedBusiness: BusinessWithRelations & { avgRating: number; totalReviews: number; totalLeads: number } = {
  ...sampleBusiness,
  id: '2',
  name: 'Quick Auto Repair',
  slug: 'quick-auto-repair',
  description: 'Fast and reliable automotive service for all makes and models.',
  category: 'AUTOMOTIVE' as const,
  phone: '9375551234',
  email: 'service@quickautorepair.com',
  website: 'https://quickautorepair.com',
  verified: false,
  featured: false,
  avgRating: 4.2,
  totalReviews: 89,
  totalLeads: 23
}

const newBusiness: BusinessWithRelations & { avgRating?: number; totalReviews?: number; totalLeads: number } = {
  ...sampleBusiness,
  id: '3',
  name: 'Dayton Digital Marketing',
  slug: 'dayton-digital-marketing',
  description: 'Professional digital marketing services for local businesses.',
  category: 'TECHNOLOGY' as const,
  phone: '9375559999',
  email: null,
  website: 'https://daytondigital.com',
  verified: true,
  featured: false,
  avgRating: undefined,
  totalReviews: undefined,
  totalLeads: 8
}

export function BusinessCardDemo() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Business Cards</h1>
          <p className="text-gray-600">Responsive business listing cards with ratings, verification, and contact features</p>
        </div>

        {/* Single Column Layout */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Single Column Layout</h2>
          <div className="max-w-md mx-auto">
            <BusinessCard business={sampleBusiness} />
          </div>
        </section>

        {/* Two Column Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Two Column Grid</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <BusinessCard business={sampleBusiness} />
            <BusinessCard business={unverifiedBusiness} />
          </div>
        </section>

        {/* Three Column Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Three Column Grid</h2>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            <BusinessCard business={sampleBusiness} />
            <BusinessCard business={unverifiedBusiness} />
            <BusinessCard business={newBusiness} />
          </div>
        </section>

        {/* Compact Mode */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Compact Mode</h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            <BusinessCard business={sampleBusiness} compact />
            <BusinessCard business={unverifiedBusiness} compact />
            <BusinessCard business={newBusiness} compact />
            <BusinessCard business={sampleBusiness} compact showLeadButton={false} />
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Features Showcase</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">✅ Verified & Featured Business</h3>
              <BusinessCard business={sampleBusiness} />
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">📋 Standard Business</h3>
              <BusinessCard business={unverifiedBusiness} />
            </div>
          </div>
        </section>

        {/* Mobile Preview */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Mobile Preview</h2>
          <div className="max-w-sm mx-auto border-4 border-gray-300 rounded-2xl p-4 bg-white">
            <div className="space-y-4">
              <BusinessCard business={sampleBusiness} />
              <BusinessCard business={unverifiedBusiness} compact />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}