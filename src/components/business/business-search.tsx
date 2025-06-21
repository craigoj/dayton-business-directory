'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'
import { BusinessCategory } from '@prisma/client'

interface BusinessSearchProps {
  onSearch: (filters: BusinessSearchFilters) => void
  loading?: boolean
}

export interface BusinessSearchFilters {
  search?: string
  category?: BusinessCategory
  city?: string
  state?: string
  featured?: boolean
}

const BUSINESS_CATEGORIES = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'AUTOMOTIVE', label: 'Automotive' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'FITNESS', label: 'Fitness' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'OTHER', label: 'Other' },
]

const OHIO_CITIES = [
  'Dayton', 'Cincinnati', 'Columbus', 'Cleveland', 'Toledo', 'Akron', 
  'Youngstown', 'Canton', 'Springfield', 'Kettering', 'Beavercreek'
]

export function BusinessSearch({ onSearch, loading }: BusinessSearchProps) {
  const [filters, setFilters] = useState<BusinessSearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (search: string) => {
    const newFilters = { ...filters, search }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const handleFilterChange = (key: keyof BusinessSearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const clearFilter = (key: keyof BusinessSearchFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({})
    onSearch({})
  }

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof BusinessSearchFilters] !== undefined
  ).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search businesses..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={filters.category || ''}
              onValueChange={(value) => handleFilterChange('category', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {BUSINESS_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Select
              value={filters.city || ''}
              onValueChange={(value) => handleFilterChange('city', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All cities</SelectItem>
                {OHIO_CITIES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Featured</label>
            <Select
              value={filters.featured ? 'true' : ''}
              onValueChange={(value) => handleFilterChange('featured', value === 'true' ? true : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All businesses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All businesses</SelectItem>
                <SelectItem value="true">Featured only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('search')}
              />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="outline" className="flex items-center gap-1">
              {BUSINESS_CATEGORIES.find(c => c.value === filters.category)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('category')}
              />
            </Badge>
          )}
          {filters.city && (
            <Badge variant="outline" className="flex items-center gap-1">
              {filters.city}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('city')}
              />
            </Badge>
          )}
          {filters.featured && (
            <Badge variant="outline" className="flex items-center gap-1">
              Featured
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => clearFilter('featured')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}