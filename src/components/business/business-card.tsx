'use client'

import { BusinessWithRelations } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Phone, Globe, Clock } from 'lucide-react'
import { formatPhoneNumber } from '@/lib/utils'
import Link from 'next/link'

interface BusinessCardProps {
  business: BusinessWithRelations & {
    avgRating?: number
    totalReviews?: number
    totalLeads?: number
  }
  showLeadButton?: boolean
  compact?: boolean
}

export function BusinessCard({ 
  business, 
  showLeadButton = true, 
  compact = false 
}: BusinessCardProps) {
  const categoryColors = {
    RESTAURANT: 'bg-orange-100 text-orange-800',
    RETAIL: 'bg-blue-100 text-blue-800',
    SERVICES: 'bg-green-100 text-green-800',
    HEALTHCARE: 'bg-red-100 text-red-800',
    AUTOMOTIVE: 'bg-gray-100 text-gray-800',
    REAL_ESTATE: 'bg-purple-100 text-purple-800',
    ENTERTAINMENT: 'bg-pink-100 text-pink-800',
    FITNESS: 'bg-teal-100 text-teal-800',
    BEAUTY: 'bg-rose-100 text-rose-800',
    EDUCATION: 'bg-indigo-100 text-indigo-800',
    TECHNOLOGY: 'bg-cyan-100 text-cyan-800',
    OTHER: 'bg-gray-100 text-gray-800',
  }

  return (
    <Card className={`h-full hover:shadow-lg transition-shadow ${compact ? 'p-2' : ''}`}>
      <CardHeader className={compact ? 'pb-2' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href={`/business/${business.slug}`}
                className="text-lg font-semibold hover:text-primary truncate"
              >
                {business.name}
              </Link>
              {business.featured && (
                <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
              )}
            </div>
            
            <Badge 
              variant="secondary" 
              className={categoryColors[business.category]}
            >
              {business.category.replace('_', ' ')}
            </Badge>
          </div>
          
          {business.avgRating && business.avgRating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{business.avgRating.toFixed(1)}</span>
              {business.totalReviews && (
                <span className="text-muted-foreground">
                  ({business.totalReviews})
                </span>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={compact ? 'pt-0' : ''}>
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="truncate">
              {business.address}, {business.city}, {business.state} {business.zipCode}
            </span>
          </div>

          {/* Description */}
          {business.description && !compact && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {business.description}
            </p>
          )}

          {/* Contact Info */}
          <div className="flex flex-col gap-2">
            {business.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a 
                  href={`tel:${business.phone}`}
                  className="text-primary hover:underline"
                >
                  {formatPhoneNumber(business.phone)}
                </a>
              </div>
            )}

            {business.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a 
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>

          {/* Hours */}
          {business.hours && !compact && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>View Hours</span>
            </div>
          )}

          {/* Action Buttons */}
          {showLeadButton && (
            <div className="flex gap-2 pt-2">
              <Button asChild className="flex-1">
                <Link href={`/business/${business.slug}/contact`}>
                  Contact Business
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/business/${business.slug}`}>
                  View Details
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}