'use client'

import { useState } from 'react'
import { Search, MapPin, Filter, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete'
import { useSearch } from '@/hooks/use-search'
import { cn } from '@/lib/utils'

interface SearchInterfaceProps {
  onSearch?: (searchParams: URLSearchParams) => void
  className?: string
  showFilters?: boolean
}

export function SearchInterface({ 
  onSearch, 
  className,
  showFilters = true 
}: SearchInterfaceProps) {
  const {
    filters,
    updateFilters,
    resetFilters,
    getServiceSuggestions,
    getLocationSuggestions,
    searchParams
  } = useSearch()

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleSearch = () => {
    onSearch?.(searchParams)
  }

  const handleServiceSearch = (value: string) => {
    updateFilters({ query: value })
  }

  const handleLocationSearch = (value: string) => {
    updateFilters({ location: value })
  }

  const serviceOptions: AutocompleteOption[] = getServiceSuggestions(filters.query).map(suggestion => ({
    value: suggestion.id,
    label: suggestion.label,
    description: suggestion.description,
    icon: suggestion.type === 'category' ? 
      <div className="w-4 h-4 bg-primary/20 rounded-sm flex items-center justify-center">
        <div className="w-2 h-2 bg-primary rounded-sm" />
      </div> : 
      <Search className="w-4 h-4 text-muted-foreground" />
  }))

  const locationOptions: AutocompleteOption[] = getLocationSuggestions(filters.location).map(location => ({
    value: location,
    label: location,
    icon: <MapPin className="w-4 h-4 text-muted-foreground" />
  }))

  const activeFiltersCount = [
    filters.category !== 'ALL',
    filters.featured,
    filters.verified,
    filters.radius !== 10,
    filters.sortBy !== 'relevance'
  ].filter(Boolean).length

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        {/* Main Search Bar */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Search */}
            <div className="space-y-2">
              <Label htmlFor="service-search" className="text-sm font-medium">
                What are you looking for?
              </Label>
              <Autocomplete
                value={filters.query}
                onValueChange={handleServiceSearch}
                options={serviceOptions}
                placeholder="Search services, businesses..."
                className="w-full"
              />
            </div>

            {/* Location Search */}
            <div className="space-y-2">
              <Label htmlFor="location-search" className="text-sm font-medium">
                Where?
              </Label>
              <Autocomplete
                value={filters.location}
                onValueChange={handleLocationSearch}
                options={locationOptions}
                placeholder="Dayton, OH or ZIP code"
                className="w-full"
              />
            </div>
          </div>

          {/* Search Button and Advanced Filters Toggle */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSearch}
              className="flex-1 md:flex-none md:px-8"
              size="lg"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>

            {showFilters && (
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-2 py-0.5 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {(filters.query || filters.location || activeFiltersCount > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {filters.query && (
                <Badge variant="outline" className="gap-1">
                  Service: {filters.query}
                  <button 
                    onClick={() => updateFilters({ query: '' })}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.location && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  {filters.location}
                  <button 
                    onClick={() => updateFilters({ location: '' })}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.category !== 'ALL' && (
                <Badge variant="outline" className="gap-1">
                  Category: {filters.category}
                  <button 
                    onClick={() => updateFilters({ category: 'ALL' })}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-6 px-2 text-xs text-muted-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && showFilters && (
          <>
            <Separator className="my-6" />
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select 
                    value={filters.category} 
                    onValueChange={(value) => updateFilters({ category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Categories</SelectItem>
                      <SelectItem value="RESTAURANT">Restaurants</SelectItem>
                      <SelectItem value="RETAIL">Retail</SelectItem>
                      <SelectItem value="SERVICES">Services</SelectItem>
                      <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                      <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                      <SelectItem value="REAL_ESTATE">Real Estate</SelectItem>
                      <SelectItem value="FITNESS">Fitness</SelectItem>
                      <SelectItem value="BEAUTY">Beauty</SelectItem>
                      <SelectItem value="EDUCATION">Education</SelectItem>
                      <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Radius Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Distance</Label>
                  <Select 
                    value={filters.radius.toString()} 
                    onValueChange={(value) => updateFilters({ radius: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Within 5 miles</SelectItem>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="25">Within 25 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select 
                    value={filters.sortBy} 
                    onValueChange={(value) => updateFilters({ sortBy: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="distance">Nearest</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Checkbox Filters */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Business Type</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={filters.featured}
                      onCheckedChange={(checked) => updateFilters({ featured: !!checked })}
                    />
                    <Label htmlFor="featured" className="text-sm cursor-pointer">
                      Featured businesses
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={filters.verified}
                      onCheckedChange={(checked) => updateFilters({ verified: !!checked })}
                    />
                    <Label htmlFor="verified" className="text-sm cursor-pointer">
                      Verified businesses
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}