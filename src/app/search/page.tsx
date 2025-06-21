'use client'

import { useState, useEffect } from 'react'
import { SearchInterface } from '@/components/search/search-interface'
import { SearchResults } from '@/components/search/search-results'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import type { Business } from '@/types'

// Mock data for demonstration
const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Downtown Dayton Diner',
    slug: 'downtown-dayton-diner',
    description: 'Classic American comfort food with a modern twist. Family-owned since 1985, serving the best burgers, steaks, and homemade desserts in downtown Dayton.',
    category: 'RESTAURANT',
    address: '123 Main Street',
    city: 'Dayton',
    state: 'OH',
    zipCode: '45402',
    phone: '937-555-0123',
    email: 'info@downtowndiner.com',
    website: 'https://downtowndiner.com',
    verified: true,
    featured: true,
    avgRating: 4.8,
    totalReviews: 127,
    totalLeads: 45,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
    hours: JSON.stringify({
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '07:00', close: '23:00' },
      sunday: { open: '07:00', close: '21:00' }
    }),
    images: [],
    tags: [],
    socialLinks: null,
    ownerId: '1',
    isActive: true
  },
  {
    id: '2',
    name: 'Kettering Auto Repair',
    slug: 'kettering-auto-repair',
    description: 'Full-service automotive repair shop specializing in foreign and domestic vehicles. ASE certified technicians with 20+ years of experience.',
    category: 'AUTOMOTIVE',
    address: '456 Wilmington Avenue',
    city: 'Kettering',
    state: 'OH',
    zipCode: '45429',
    phone: '937-555-0456',
    email: 'service@ketteringauto.com',
    website: 'https://ketteringauto.com',
    verified: true,
    featured: false,
    avgRating: 4.6,
    totalReviews: 89,
    totalLeads: 23,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-01-10'),
    hours: JSON.stringify({
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: '09:00', close: '15:00' }
    }),
    images: [],
    tags: [],
    socialLinks: null,
    ownerId: '2',
    isActive: true
  },
  {
    id: '3',
    name: 'Beavercreek Family Dentistry',
    slug: 'beavercreek-family-dentistry',
    description: 'Comprehensive dental care for the whole family. Modern facility with the latest technology and a caring, professional staff.',
    category: 'HEALTHCARE',
    address: '789 Fairfield Commons',
    city: 'Beavercreek',
    state: 'OH',
    zipCode: '45324',
    phone: '937-555-0789',
    email: 'appointments@beavercreekdentistry.com',
    website: 'https://beavercreekdentistry.com',
    verified: true,
    featured: true,
    avgRating: 4.9,
    totalReviews: 156,
    totalLeads: 67,
    createdAt: new Date('2022-08-20'),
    updatedAt: new Date('2024-01-05'),
    hours: JSON.stringify({
      monday: { open: '08:00', close: '17:00' },
      tuesday: { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday: { open: '08:00', close: '17:00' },
      friday: { open: '08:00', close: '15:00' }
    }),
    images: [],
    tags: [],
    socialLinks: null,
    ownerId: '3',
    isActive: true
  },
  {
    id: '4',
    name: 'Centerville Fitness Center',
    slug: 'centerville-fitness-center',
    description: 'State-of-the-art fitness facility with modern equipment, group classes, personal training, and a welcoming community atmosphere.',
    category: 'FITNESS',
    address: '321 Whipp Road',
    city: 'Centerville',
    state: 'OH',
    zipCode: '45459',
    phone: '937-555-0321',
    email: 'info@centervillefitness.com',
    website: 'https://centervillefitness.com',
    verified: false,
    featured: false,
    avgRating: 4.3,
    totalReviews: 78,
    totalLeads: 34,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-12'),
    hours: JSON.stringify({
      monday: { open: '05:00', close: '22:00' },
      tuesday: { open: '05:00', close: '22:00' },
      wednesday: { open: '05:00', close: '22:00' },
      thursday: { open: '05:00', close: '22:00' },
      friday: { open: '05:00', close: '21:00' },
      saturday: { open: '06:00', close: '20:00' },
      sunday: { open: '07:00', close: '19:00' }
    }),
    images: [],
    tags: [],
    socialLinks: null,
    ownerId: '4',
    isActive: true
  },
  {
    id: '5',
    name: 'Dayton Tech Solutions',
    slug: 'dayton-tech-solutions',
    description: 'IT consulting and computer repair services for businesses and individuals. Specializing in network setup, cybersecurity, and data recovery.',
    category: 'TECHNOLOGY',
    address: '654 Brown Street',
    city: 'Dayton',
    state: 'OH',
    zipCode: '45409',
    phone: '937-555-0654',
    email: 'support@daytontech.com',
    website: 'https://daytontech.com',
    verified: true,
    featured: false,
    avgRating: 4.5,
    totalReviews: 43,
    totalLeads: 19,
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2024-01-08'),
    hours: JSON.stringify({
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' }
    }),
    images: [],
    tags: [],
    socialLinks: null,
    ownerId: '5',
    isActive: true
  }
]

const POPULAR_SEARCHES = [
  { query: 'restaurants', count: '1.2k' },
  { query: 'auto repair', count: '890' },
  { query: 'dentist', count: '756' },
  { query: 'pizza', count: '623' },
  { query: 'hair salon', count: '445' },
  { query: 'plumbing', count: '334' }
]

export default function SearchPage() {
  const [results, setResults] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const handleSearch = async (searchParams: URLSearchParams) => {
    setLoading(true)
    setHasSearched(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple filtering logic for demo
    let filteredResults = MOCK_BUSINESSES
    
    const query = searchParams.get('q')?.toLowerCase()
    const category = searchParams.get('category')
    const verified = searchParams.get('verified') === 'true'
    const featured = searchParams.get('featured') === 'true'

    if (query) {
      filteredResults = filteredResults.filter(business =>
        business.name.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query)
      )
    }

    if (category && category !== 'ALL') {
      filteredResults = filteredResults.filter(business => business.category === category)
    }

    if (verified) {
      filteredResults = filteredResults.filter(business => business.verified)
    }

    if (featured) {
      filteredResults = filteredResults.filter(business => business.featured)
    }

    setResults(filteredResults)
    setTotalCount(filteredResults.length)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Search Businesses</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Search Interface */}
          <SearchInterface
            onSearch={handleSearch}
            showFilters={true}
          />

          {/* Popular Searches - Show only when no search has been performed */}
          {!hasSearched && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Popular Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {POPULAR_SEARCHES.map((search) => (
                    <Button
                      key={search.query}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        const params = new URLSearchParams({ q: search.query })
                        handleSearch(params)
                      }}
                    >
                      {search.query}
                      <Badge variant="secondary" className="text-xs">
                        {search.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {hasSearched && (
            <SearchResults
              results={results}
              loading={loading}
              totalCount={totalCount}
              hasMore={false}
            />
          )}

          {/* Helper Text */}
          {!hasSearched && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <h2 className="text-xl font-semibold">Find Local Businesses</h2>
                <p className="text-muted-foreground">
                  Search for businesses by service type, name, or location. Use the filters to narrow down your results.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}