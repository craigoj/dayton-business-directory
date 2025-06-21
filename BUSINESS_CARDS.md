# Enhanced Business Listing Cards

## Overview

The enhanced BusinessCard component provides a modern, responsive design for displaying business listings in the Dayton Business Directory. It includes 5-star ratings, verification badges, and improved contact buttons with excellent mobile responsiveness.

## Features

### ✨ **Enhanced Visual Design**
- **Modern Card Layout**: Clean design with improved spacing and typography
- **Hover Effects**: Subtle scale and shadow effects for better interactivity
- **Visual Hierarchy**: Clear separation of information with proper spacing

### ⭐ **Advanced Rating System**
- **5-Star Display**: Full star rating system with half-star support
- **Review Count**: Shows total number of reviews
- **Rating Value**: Displays numerical rating (e.g., 4.8)
- **Responsive Sizing**: Adjusts star size based on card size

### ✅ **Verification Badge**
- **Green Verified Badge**: Prominent checkmark for verified businesses
- **Trust Indicator**: Builds user confidence with clear verification status
- **Consistent Styling**: Matches overall design system

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Breakpoint Adjustments**: Different layouts for mobile, tablet, and desktop
- **Flexible Grid**: Works in 1, 2, 3, or 4 column layouts
- **Compact Mode**: Reduced spacing for dense layouts

### 📞 **Enhanced Contact Options**
- **Phone**: Direct calling with formatted phone numbers
- **Email**: Direct mailto links for businesses with email
- **Website**: External links with proper target and security attributes
- **Contact Form**: Primary CTA button for lead generation

### 🎨 **Category Styling**
- **Color-Coded Categories**: Each business category has distinct colors
- **Featured Badges**: Gradient badges for featured businesses
- **Consistent Branding**: Maintains design system consistency

## Usage

### Basic Usage

```tsx
import { BusinessCard } from '@/components/business/business-card'

<BusinessCard business={businessData} />
```

### Props

```typescript
interface BusinessCardProps {
  business: BusinessWithRelations & {
    avgRating?: number
    totalReviews?: number
    totalLeads?: number
  }
  showLeadButton?: boolean  // Default: true
  compact?: boolean         // Default: false
  className?: string        // Additional CSS classes
}
```

### Examples

#### Standard Layout
```tsx
<BusinessCard business={business} />
```

#### Compact Layout
```tsx
<BusinessCard business={business} compact />
```

#### Without Contact Button
```tsx
<BusinessCard business={business} showLeadButton={false} />
```

#### Custom Styling
```tsx
<BusinessCard 
  business={business} 
  className="max-w-sm mx-auto" 
/>
```

## Layout Examples

### Single Column
```tsx
<div className="max-w-md mx-auto">
  <BusinessCard business={business} />
</div>
```

### Two Column Grid
```tsx
<div className="grid md:grid-cols-2 gap-6">
  <BusinessCard business={business1} />
  <BusinessCard business={business2} />
</div>
```

### Three Column Grid
```tsx
<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
  <BusinessCard business={business1} />
  <BusinessCard business={business2} />
  <BusinessCard business={business3} />
</div>
```

### Compact Grid (4 columns)
```tsx
<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
  <BusinessCard business={business1} compact />
  <BusinessCard business={business2} compact />
  <BusinessCard business={business3} compact />
  <BusinessCard business={business4} compact />
</div>
```

## Components Used

### StarRating Component
- **Reusable**: Can be used independently
- **Configurable**: Different sizes (sm, md, lg)
- **Accessible**: Proper ARIA labels and semantics

```tsx
<StarRating
  rating={4.8}
  reviewCount={127}
  size="md"
  showValue={true}
/>
```

## Responsive Breakpoints

- **Mobile (< 640px)**: Single column, stacked buttons
- **Tablet (640px - 1024px)**: 2 column grids, horizontal buttons  
- **Desktop (> 1024px)**: 3-4 column grids, full feature display

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Clear focus indicators

## Performance Optimizations

- **Lazy Loading**: Images load only when needed
- **Optimized Renders**: Minimal re-renders with proper memoization
- **CSS Animations**: Hardware-accelerated transitions
- **Bundle Size**: Minimal impact on bundle size

## Demo

Visit `/demo/business-cards` to see all variants and responsive behaviors.

## Development Notes

- Uses Tailwind CSS for styling
- Built with TypeScript for type safety
- Follows shadcn/ui design patterns
- Maintains backward compatibility with existing BusinessCard usage
- Extensible for future enhancements

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: CSS Grid, Flexbox, CSS Custom Properties