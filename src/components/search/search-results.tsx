'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BusinessCard } from '@/components/business/business-card'
import { Grid, List, MapPin, Filter, SortAsc } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Business } from '@/types'

interface SearchResultsProps {
  results: Business[]
  loading?: boolean
  totalCount?: number
  className?: string
  onLoadMore?: () => void
  hasMore?: boolean
}

type ViewMode = 'grid' | 'list'

export function SearchResults({
  results,
  loading = false,
  totalCount = 0,
  className,
  onLoadMore,
  hasMore = false
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  if (loading && results.length === 0) {
    return <SearchResultsSkeleton />
  }

  if (!loading && results.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No businesses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or expanding your search area.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Suggestions:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Check your spelling</li>
                <li>• Use more general terms</li>
                <li>• Expand your search radius</li>
                <li>• Remove some filters</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {totalCount > 0 ? (
                <>
                  Showing {results.length} of {totalCount} businesses
                </>
              ) : (
                <>
                  {results.length} businesses found
                </>
              )}
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Grid/List */}
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      )}>
        {results.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
            className={viewMode === 'list' ? 'max-w-none' : ''}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="outline"
            size="lg"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More Results'
            )}
          </Button>
        </div>
      )}

      {/* Loading State for Additional Results */}
      {loading && results.length > 0 && (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        )}>
          {Array.from({ length: 3 }).map((_, i) => (
            <SearchResultSkeleton key={i} variant={viewMode} />
          ))}
        </div>
      )}
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Results Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SearchResultSkeleton key={i} variant="grid" />
        ))}
      </div>
    </div>
  )
}

function SearchResultSkeleton({ variant }: { variant: ViewMode }) {
  if (variant === 'list') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}