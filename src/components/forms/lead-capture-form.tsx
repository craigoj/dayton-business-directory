'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin, Clock, Star, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Business } from '@/types'

// Form validation schema
const leadCaptureSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  
  phone: z.string()
    .regex(/^(\+1|1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, 
           'Please enter a valid US phone number')
    .optional()
    .or(z.literal('')),
  
  inquiryType: z.enum(['quote', 'appointment', 'information', 'other'], {
    required_error: 'Please select an inquiry type'
  }),
  
  preferredContact: z.enum(['email', 'phone', 'either'], {
    required_error: 'Please select your preferred contact method'
  }),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters'),
  
  urgency: z.enum(['asap', 'within_week', 'within_month', 'flexible'], {
    required_error: 'Please select your timeline'
  }),
  
  budget: z.string().optional(),
  
  marketingConsent: z.boolean().default(false),
  
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
})

type LeadCaptureForm = z.infer<typeof leadCaptureSchema>

interface LeadCaptureFormProps {
  business: Business
  variant?: 'compact' | 'full' | 'modal'
  className?: string
  onSuccess?: (leadId: string) => void
  onError?: (error: string) => void
}

export function LeadCaptureForm({ 
  business, 
  variant = 'full',
  className,
  onSuccess,
  onError 
}: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    setValue,
    watch,
    reset
  } = useForm<LeadCaptureForm>({
    resolver: zodResolver(leadCaptureSchema),
    mode: 'onBlur',
    defaultValues: {
      marketingConsent: false,
      termsAccepted: false,
      preferredContact: 'email',
      inquiryType: 'information',
      urgency: 'flexible'
    }
  })

  const watchedPhone = watch('phone')
  const watchedEmail = watch('email')
  const watchedPreferredContact = watch('preferredContact')

  // Form submission handler
  const onSubmit = async (data: LeadCaptureForm) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call - replace with actual API integration
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          businessId: business.id,
          timestamp: new Date().toISOString(),
          source: 'web_form'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit lead')
      }

      const result = await response.json()
      
      setSubmitStatus('success')
      setSubmitMessage('Thank you! Your inquiry has been sent successfully. The business will contact you soon.')
      onSuccess?.(result.id)
      
      // Reset form after successful submission
      setTimeout(() => {
        reset()
        setSubmitStatus('idle')
      }, 3000)

    } catch (error) {
      console.error('Lead submission error:', error)
      setSubmitStatus('error')
      setSubmitMessage('Sorry, there was an error submitting your inquiry. Please try again or contact the business directly.')
      onError?.(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validate phone requirement based on preferred contact
  const isPhoneRequired = watchedPreferredContact === 'phone' || watchedPreferredContact === 'either'

  const isCompact = variant === 'compact'
  const isModal = variant === 'modal'

  return (
    <Card className={cn(
      'w-full max-w-2xl mx-auto',
      isModal && 'border-0 shadow-none',
      className
    )}>
      <CardHeader className={cn(
        'space-y-3',
        isCompact && 'pb-4'
      )}>
        <div className="flex items-start gap-4">
          {/* Business Info */}
          <div className="flex-1 min-w-0">
            <CardTitle className={cn(
              'text-xl font-bold line-clamp-2',
              isCompact && 'text-lg'
            )}>
              Contact {business.name}
            </CardTitle>
            <CardDescription className="mt-2">
              Send your inquiry directly to this business. They'll get back to you soon!
            </CardDescription>
            
            {!isCompact && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {business.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified Business
                  </Badge>
                )}
                {business.avgRating && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{business.avgRating}</span>
                    {business.totalReviews && (
                      <span>({business.totalReviews} reviews)</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Business Quick Info */}
        {!isCompact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground border-t pt-3">
            {business.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{business.city}, {business.state}</span>
              </div>
            )}
            {business.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{business.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Usually responds within 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>Free consultation available</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name *
              </Label>
              <Input
                {...register('firstName')}
                id="firstName"
                placeholder="John"
                className={cn(
                  'h-12',
                  errors.firstName && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name *
              </Label>
              <Input
                {...register('lastName')}
                id="lastName"
                placeholder="Smith"
                className={cn(
                  'h-12',
                  errors.lastName && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="john.smith@example.com"
                className={cn(
                  'h-12',
                  errors.email && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number {isPhoneRequired && '*'}
              </Label>
              <Input
                {...register('phone')}
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className={cn(
                  'h-12',
                  errors.phone && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
              )}
              {isPhoneRequired && !watchedPhone && (
                <p className="text-xs text-amber-600 mt-1">
                  Phone number required for your preferred contact method
                </p>
              )}
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Type of Inquiry *</Label>
              <Select 
                value={watch('inquiryType')} 
                onValueChange={(value) => setValue('inquiryType', value as any)}
              >
                <SelectTrigger className={cn(
                  'h-12',
                  errors.inquiryType && 'border-red-500'
                )}>
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quote">Request Quote</SelectItem>
                  <SelectItem value="appointment">Schedule Appointment</SelectItem>
                  <SelectItem value="information">General Information</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.inquiryType && (
                <p className="text-xs text-red-600 mt-1">{errors.inquiryType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Preferred Contact Method *</Label>
              <Select 
                value={watch('preferredContact')} 
                onValueChange={(value) => setValue('preferredContact', value as any)}
              >
                <SelectTrigger className={cn(
                  'h-12',
                  errors.preferredContact && 'border-red-500'
                )}>
                  <SelectValue placeholder="How should we contact you?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="either">Either Email or Phone</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredContact && (
                <p className="text-xs text-red-600 mt-1">{errors.preferredContact.message}</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              {...register('message')}
              id="message"
              placeholder="Please describe what you're looking for or any specific questions you have..."
              rows={4}
              className={cn(
                'resize-none',
                errors.message && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            <div className="flex justify-between items-center">
              {errors.message && (
                <p className="text-xs text-red-600">{errors.message.message}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {watch('message')?.length || 0}/500 characters
              </p>
            </div>
          </div>

          {/* Timeline and Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Timeline *</Label>
              <Select 
                value={watch('urgency')} 
                onValueChange={(value) => setValue('urgency', value as any)}
              >
                <SelectTrigger className={cn(
                  'h-12',
                  errors.urgency && 'border-red-500'
                )}>
                  <SelectValue placeholder="When do you need this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">As Soon As Possible</SelectItem>
                  <SelectItem value="within_week">Within a Week</SelectItem>
                  <SelectItem value="within_month">Within a Month</SelectItem>
                  <SelectItem value="flexible">I'm Flexible</SelectItem>
                </SelectContent>
              </Select>
              {errors.urgency && (
                <p className="text-xs text-red-600 mt-1">{errors.urgency.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium">
                Budget Range (Optional)
              </Label>
              <Select onValueChange={(value) => setValue('budget', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_500">Under $500</SelectItem>
                  <SelectItem value="500_1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000_5000">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5000_10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="over_10000">Over $10,000</SelectItem>
                  <SelectItem value="discuss">Prefer to Discuss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Consent and Terms */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketingConsent"
                checked={watch('marketingConsent')}
                onCheckedChange={(checked) => setValue('marketingConsent', !!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="marketingConsent"
                  className="text-sm font-normal cursor-pointer"
                >
                  I'd like to receive updates about services, promotions, and helpful tips
                </Label>
                <p className="text-xs text-muted-foreground">
                  Optional - you can unsubscribe at any time
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="termsAccepted"
                checked={watch('termsAccepted')}
                onCheckedChange={(checked) => setValue('termsAccepted', !!checked)}
                className={cn(
                  errors.termsAccepted && 'border-red-500'
                )}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="termsAccepted"
                  className="text-sm font-normal cursor-pointer"
                >
                  I agree to the terms of service and privacy policy *
                </Label>
                {errors.termsAccepted && (
                  <p className="text-xs text-red-600">{errors.termsAccepted.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending Your Inquiry...
              </>
            ) : (
              'Send Inquiry'
            )}
          </Button>

          {/* Form Footer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Your information is secure and will only be shared with {business.name}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>✓ SSL Encrypted</span>
              <span>✓ GDPR Compliant</span>
              <span>✓ No Spam</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}