'use client'

import { SearchInterface } from '@/components/search/search-interface'
import { SearchResults } from '@/components/search/search-results'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, Grid, List, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Business } from '@/types'

// Mock data for demonstration
const DEMO_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'The Pizza Corner',
    slug: 'the-pizza-corner',
    description: 'Authentic wood-fired pizza with fresh ingredients. Family recipes passed down through generations.',
    category: 'RESTAURANT',
    address: '123 Main Street',
    city: 'Dayton',
    state: 'OH',
    zipCode: '45402',
    phone: '937-555-0123',
    email: 'info@pizzacorner.com',
    website: 'https://pizzacorner.com',
    verified: true,
    featured: true,
    avgRating: 4.8,
    totalReviews: 127,
    totalLeads: 45,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
    hours: '{}',
    images: [],
    tags: [],
    socialLinks: null,
    ownerId: '1',
    isActive: true
  },
  {
    id: '2',
    name: 'Express Auto Service',
    slug: 'express-auto-service',
    description: 'Quick and reliable auto service. Oil changes, tire rotations, and basic maintenance.',
    category: 'AUTOMOTIVE',
    address: '456 Wilmington Avenue',
    city: 'Kettering',
    state: 'OH',
    zipCode: '45429',
    phone: '937-555-0456',
    email: 'service@expressauto.com',
    website: 'https://expressauto.com',
    verified: false,
    featured: false,
    avgRating: 4.6,
    totalReviews: 89,
    totalLeads: 23,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-01-10'),
    hours: '{}',
    images: [],
    tags: [],
    socialLinks: null,
    ownerId: '2',
    isActive: true
  },
  {
    id: '3',
    name: 'Smile Dentistry',
    slug: 'smile-dentistry',
    description: 'Complete dental care for the whole family. Modern facility with advanced technology.',
    category: 'HEALTHCARE',
    address: '789 Fairfield Commons',
    city: 'Beavercreek',
    state: 'OH',
    zipCode: '45324',
    phone: '937-555-0789',
    email: 'appointments@smiledentistry.com',
    website: 'https://smiledentistry.com',
    verified: true,
    featured: false,
    avgRating: 4.9,
    totalReviews: 156,
    totalLeads: 67,
    createdAt: new Date('2022-08-20'),
    updatedAt: new Date('2024-01-05'),
    hours: '{}',
    images: [],
    tags: [],
    socialLinks: null,
    ownerId: '3',
    isActive: true
  }
]

export default function SearchDemoPage() {
  const handleDemoSearch = (searchParams: URLSearchParams) => {
    console.log('Demo search params:', Object.fromEntries(searchParams.entries()))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/demo/business-cards">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Business Cards
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Search Interface Demo</h1>
                <p className="text-sm text-muted-foreground">
                  Interactive search with autocomplete and filtering
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Demo Mode
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Interface Features
              </CardTitle>
              <CardDescription>
                Comprehensive search functionality with autocomplete, filtering, and responsive design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Search className="w-4 h-4" />
                    Service Autocomplete
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Smart suggestions for services and business types with descriptions
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Filter className="w-4 h-4" />
                    Advanced Filtering
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filter by category, location, radius, verification status, and more
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Grid className="w-4 h-4" />
                    <List className="w-4 h-4" />
                    Multiple Views
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Grid and list view modes for different user preferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Search Interface */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Live Search Interface</h2>
              <p className="text-muted-foreground">
                Try searching for different services like "pizza", "auto repair", "dentist", or locations like "Dayton", "Kettering"
              </p>
            </div>
            
            <SearchInterface
              onSearch={handleDemoSearch}
              showFilters={true}
            />
          </div>

          {/* Sample Results */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Sample Search Results</h2>
              <p className="text-muted-foreground">
                Example of how search results appear with both grid and list view options
              </p>
            </div>
            
            <SearchResults
              results={DEMO_BUSINESSES}
              loading={false}
              totalCount={DEMO_BUSINESSES.length}
              hasMore={false}
            />
          </div>

          {/* Feature Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Autocomplete Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Service Suggestions</h4>
                  <p className="text-sm text-muted-foreground">
                    Pre-populated service categories and specific services with descriptions
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Location Suggestions</h4>
                  <p className="text-sm text-muted-foreground">
                    Dayton area cities and ZIP codes for precise location filtering
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Smart Matching</h4>
                  <p className="text-sm text-muted-foreground">
                    Searches both labels and descriptions for comprehensive results
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filter Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Business Categories</h4>
                  <p className="text-sm text-muted-foreground">
                    Filter by restaurant, retail, services, healthcare, and more
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Distance & Location</h4>
                  <p className="text-sm text-muted-foreground">
                    Radius-based filtering with customizable distance ranges
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Business Status</h4>
                  <p className="text-sm text-muted-foreground">
                    Filter for verified businesses, featured listings, and sorting options
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>
                Built with modern React patterns and TypeScript for type safety
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Components</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SearchInterface - Main search form</li>
                    <li>• Autocomplete - Reusable input component</li>
                    <li>• SearchResults - Results display with views</li>
                    <li>• useSearch - Custom hook for state management</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time search suggestions</li>
                    <li>• URL parameter synchronization</li>
                    <li>• Responsive design for all devices</li>
                    <li>• Keyboard navigation support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild>
              <Link href="/search">
                Try Live Search Interface
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/demo/business-cards">
                View Business Cards Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}