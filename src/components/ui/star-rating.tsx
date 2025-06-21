'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  reviewCount?: number
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  reviewCount,
  className
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const renderStars = () => {
    const stars = []
    const roundedRating = Math.round(rating * 2) / 2 // Round to nearest 0.5

    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= Math.floor(roundedRating)
      const isHalfFilled = i === Math.ceil(roundedRating) && roundedRating % 1 !== 0

      stars.push(
        <div key={i} className="relative">
          {/* Background star */}
          <Star className={cn(sizeClasses[size], 'text-gray-200')} />
          
          {/* Filled star */}
          {isFilled && (
            <Star 
              className={cn(
                sizeClasses[size], 
                'absolute top-0 left-0 text-yellow-400 fill-current'
              )} 
            />
          )}
          
          {/* Half-filled star */}
          {isHalfFilled && (
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
              <Star 
                className={cn(
                  sizeClasses[size], 
                  'text-yellow-400 fill-current'
                )} 
              />
            </div>
          )}
        </div>
      )
    }

    return stars
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Stars */}
      <div className="flex items-center">
        {renderStars()}
      </div>
      
      {/* Rating value and count */}
      {showValue && (
        <div className={cn('flex items-center gap-1', textSizeClasses[size])}>
          <span className="font-medium text-gray-900">
            {rating.toFixed(1)}
          </span>
          {reviewCount !== undefined && (
            <span className="text-gray-500">
              ({reviewCount})
            </span>
          )}
        </div>
      )}
    </div>
  )
}