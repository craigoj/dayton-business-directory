'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, CheckCircle2, AlertCircle, Loader2, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLeadCapture } from '@/hooks/use-lead-capture'
import type { Business } from '@/types'

// Simplified schema for quick form
const quickLeadSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters'),
  
  phone: z.string()
    .regex(/^(\+1|1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, 
           'Please enter a valid US phone number')
    .optional()
    .or(z.literal('')),
  
  message: z.string()
    .min(10, 'Please provide more details (at least 10 characters)')
    .max(300, 'Message must be less than 300 characters')
})

type QuickLeadForm = z.infer<typeof quickLeadSchema>

interface QuickLeadFormProps {
  business: Business
  className?: string
  onSuccess?: (leadId: string) => void
  onError?: (error: string) => void
  inquiryType?: 'quote' | 'appointment' | 'information' | 'other'
  placeholder?: string
  buttonText?: string
}

export function QuickLeadForm({ 
  business,
  className,
  onSuccess,
  onError,
  inquiryType = 'information',
  placeholder = "Hi! I'm interested in your services. Please contact me with more information.",
  buttonText = "Get in Touch"
}: QuickLeadFormProps) {
  const {
    isSubmitting,
    submitStatus,
    submitMessage,
    submitLead,
    resetSubmitState
  } = useLeadCapture({
    onSuccess: (result) => {
      if (result.success && result.leadId) {
        onSuccess?.(result.leadId)
      }
    },
    onError,
    autoReset: true,
    resetDelay: 5000
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm<QuickLeadForm>({
    resolver: zodResolver(quickLeadSchema),
    mode: 'onBlur'
  })

  const watchedMessage = watch('message')

  const onSubmit = async (data: QuickLeadForm) => {
    // Split name into first and last name
    const nameParts = data.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''

    const leadData = {
      firstName,
      lastName,
      email: data.email,
      phone: data.phone || '',
      inquiryType,
      preferredContact: 'email' as const,
      message: data.message,
      urgency: 'flexible' as const,
      marketingConsent: false,
      termsAccepted: true, // Implied consent for simplified form
      businessId: business.id,
      source: 'quick_form'
    }

    const result = await submitLead(leadData)
    
    if (result.success) {
      reset()
    }
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Quick Contact</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Get a response within 24 hours
            </p>
          </div>
        </div>
        
        {business.verified && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 w-fit">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified Business
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name *
            </Label>
            <Input
              {...register('name')}
              id="name"
              placeholder="John Smith"
              className={cn(
                'h-11',
                errors.name && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={cn(
                    'h-11 pl-10',
                    errors.email && 'border-red-500 focus-visible:ring-red-500'
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number (Optional)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  {...register('phone')}
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className={cn(
                    'h-11 pl-10',
                    errors.phone && 'border-red-500 focus-visible:ring-red-500'
                  )}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Your Message *
            </Label>
            <Textarea
              {...register('message')}
              id="message"
              placeholder={placeholder}
              rows={4}
              className={cn(
                'resize-none text-sm',
                errors.message && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            <div className="flex justify-between items-center">
              {errors.message && (
                <p className="text-xs text-red-600">{errors.message.message}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {watchedMessage?.length || 0}/300
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full h-11 text-sm font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              buttonText
            )}
          </Button>

          {/* Privacy Notice */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By submitting this form, you agree to be contacted by {business.name}
            </p>
            <div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>✓ Secure</span>
              <span>✓ No Spam</span>
              <span>✓ Quick Response</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Floating Action Button version for mobile
export function FloatingLeadButton({ 
  business, 
  onFormOpen 
}: { 
  business: Business
  onFormOpen: () => void 
}) {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <Button
            onClick={onFormOpen}
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
              Contact {business.name}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}