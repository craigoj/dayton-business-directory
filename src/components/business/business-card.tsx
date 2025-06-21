'use client'

import { BusinessWithRelations } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import { MapPin, Phone, Globe, Clock, Mail, CheckCircle, ExternalLink } from 'lucide-react'
import { formatPhoneNumber, cn } from '@/lib/utils'
import Link from 'next/link'

interface BusinessCardProps {
  business: BusinessWithRelations & {
    avgRating?: number
    totalReviews?: number
    totalLeads?: number
  }
  showLeadButton?: boolean
  compact?: boolean
  className?: string
}

export function BusinessCard({ 
  business, 
  showLeadButton = true, 
  compact = false,
  className
}: BusinessCardProps) {
  const categoryColors = {
    RESTAURANT: 'bg-orange-100 text-orange-800 border-orange-200',
    RETAIL: 'bg-blue-100 text-blue-800 border-blue-200',
    SERVICES: 'bg-green-100 text-green-800 border-green-200',
    HEALTHCARE: 'bg-red-100 text-red-800 border-red-200',
    AUTOMOTIVE: 'bg-gray-100 text-gray-800 border-gray-200',
    REAL_ESTATE: 'bg-purple-100 text-purple-800 border-purple-200',
    ENTERTAINMENT: 'bg-pink-100 text-pink-800 border-pink-200',
    FITNESS: 'bg-teal-100 text-teal-800 border-teal-200',
    BEAUTY: 'bg-rose-100 text-rose-800 border-rose-200',
    EDUCATION: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    TECHNOLOGY: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return (
    <Card className={cn(
      'h-full hover:shadow-xl transition-all duration-200 border-0 shadow-md',
      'hover:transform hover:scale-[1.02]',
      compact ? 'p-3' : 'p-0',
      className
    )}>
      <CardHeader className={cn(
        'pb-3',
        compact ? 'p-0 pb-2' : 'p-6 pb-3'
      )}>
        <div className="flex flex-col space-y-3">
          {/* Top row - Title and Verification */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Link 
                href={`/business/${business.slug}`}
                className={cn(
                  'font-bold hover:text-primary transition-colors line-clamp-2',
                  compact ? 'text-base' : 'text-lg sm:text-xl'
                )}
              >
                {business.name}
              </Link>
            </div>
            
            {business.verified && (
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-800 border-green-200 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium whitespace-nowrap"
              >
                <CheckCircle className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Second row - Category and Featured */}
          <div className="flex items-center justify-between gap-2">
            <Badge 
              variant="secondary" 
              className={cn(
                categoryColors[business.category],
                'border text-xs font-medium px-2 py-1 rounded-md'
              )}
            >
              {business.category.replace('_', ' ')}
            </Badge>
            
            {business.featured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs font-medium px-2 py-1 rounded-md">
                ⭐ Featured
              </Badge>
            )}
          </div>

          {/* Third row - Rating */}
          {business.avgRating && business.avgRating > 0 && (
            <div className="flex items-center justify-between">
              <StarRating
                rating={business.avgRating}
                reviewCount={business.totalReviews}
                size={compact ? 'sm' : 'md'}
                showValue={true}
              />
              {!compact && business.totalReviews && business.totalReviews > 0 && (
                <Link 
                  href={`/business/${business.slug}#reviews`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Read reviews
                </Link>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn(
        'space-y-4',
        compact ? 'p-0 pt-0' : 'p-6 pt-0'
      )}>
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">
              {business.address}
            </p>
            <p className="text-sm text-muted-foreground">
              {business.city}, {business.state} {business.zipCode}
            </p>
          </div>
        </div>

        {/* Description */}
        {business.description && !compact && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {business.description}
          </p>
        )}

        {/* Contact Information Grid */}
        <div className={cn(
          'grid gap-3',
          compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
        )}>
          {business.phone && (
            <a 
              href={`tel:${business.phone}`}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
            >
              <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>{formatPhoneNumber(business.phone)}</span>
            </a>
          )}

          {business.email && (
            <a 
              href={`mailto:${business.email}`}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
            >
              <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="truncate">{business.email}</span>
            </a>
          )}

          {business.website && (
            <a 
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
            >
              <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="truncate">Visit Website</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          )}
        </div>

        {/* Hours - Show when available and not compact */}
        {business.hours && !compact && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Business Hours Available</span>
          </div>
        )}

        {/* Action Buttons */}
        {showLeadButton && (
          <div className={cn(
            'flex gap-2 pt-2',
            compact ? 'flex-col' : 'flex-row'
          )}>
            <Button 
              asChild 
              className={cn(
                'transition-all duration-200 hover:shadow-md',
                compact ? 'w-full' : 'flex-1'
              )}
            >
              <Link href={`/business/${business.slug}/contact`}>
                <Mail className="w-4 h-4 mr-2" />
                Contact Business
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild
              className={cn(
                'transition-all duration-200 hover:shadow-md border-2',
                compact ? 'w-full' : 'min-w-[120px]'
              )}
            >
              <Link href={`/business/${business.slug}`}>
                View Details
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}