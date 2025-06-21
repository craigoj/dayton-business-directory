'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LeadCaptureForm } from './lead-capture-form'
import { QuickLeadForm } from './quick-lead-form'
import { Mail, Phone, MessageSquare, Star, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Business } from '@/types'

interface LeadCaptureModalProps {
  business: Business
  trigger?: React.ReactNode
  variant?: 'full' | 'quick'
  inquiryType?: 'quote' | 'appointment' | 'information' | 'other'
  className?: string
  onSuccess?: (leadId: string) => void
  onError?: (error: string) => void
}

export function LeadCaptureModal({
  business,
  trigger,
  variant = 'quick',
  inquiryType = 'information',
  className,
  onSuccess,
  onError
}: LeadCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const handleSuccess = (leadId: string) => {
    setShowThankYou(true)
    onSuccess?.(leadId)
    
    // Auto-close modal after showing thank you message
    setTimeout(() => {
      setIsOpen(false)
      setShowThankYou(false)
    }, 3000)
  }

  const handleError = (error: string) => {
    onError?.(error)
  }

  const defaultTrigger = (
    <Button className="w-full sm:w-auto">
      <Mail className="w-4 h-4 mr-2" />
      Contact Business
    </Button>
  )

  const FormComponent = variant === 'full' ? LeadCaptureForm : QuickLeadForm

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className={cn(
        'w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0',
        variant === 'quick' && 'max-w-md',
        className
      )}>
        {/* Custom Header */}
        <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg font-semibold line-clamp-1">
                Contact {business.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {business.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {business.avgRating && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{business.avgRating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Thank You State */}
        {showThankYou ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-4">
              Your inquiry has been sent to {business.name}. They'll get back to you soon!
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Your message has been delivered</p>
              <p>✓ You'll receive a confirmation email</p>
              <p>✓ Expect a response within 24 hours</p>
            </div>
          </div>
        ) : (
          /* Form Content */
          <div className="p-6">
            <FormComponent
              business={business}
              variant="modal"
              inquiryType={inquiryType}
              onSuccess={handleSuccess}
              onError={handleError}
              className="border-0 shadow-none max-w-none"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Specialized modal variants
export function QuoteRequestModal({ 
  business, 
  trigger, 
  ...props 
}: Omit<LeadCaptureModalProps, 'inquiryType'>) {
  return (
    <LeadCaptureModal
      business={business}
      trigger={trigger || (
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Request Quote
        </Button>
      )}
      inquiryType="quote"
      variant="full"
      {...props}
    />
  )
}

export function AppointmentModal({ 
  business, 
  trigger, 
  ...props 
}: Omit<LeadCaptureModalProps, 'inquiryType'>) {
  return (
    <LeadCaptureModal
      business={business}
      trigger={trigger || (
        <Button variant="outline">
          <Phone className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      )}
      inquiryType="appointment"
      variant="full"
      {...props}
    />
  )
}

export function QuickContactModal({ 
  business, 
  trigger, 
  ...props 
}: Omit<LeadCaptureModalProps, 'inquiryType'>) {
  return (
    <LeadCaptureModal
      business={business}
      trigger={trigger || (
        <Button size="sm">
          <MessageSquare className="w-4 h-4 mr-2" />
          Quick Contact
        </Button>
      )}
      inquiryType="information"
      variant="quick"
      {...props}
    />
  )
}

// Mobile-optimized bottom sheet version
export function MobileLeadSheet({
  business,
  isOpen,
  onOpenChange,
  variant = 'quick',
  ...props
}: LeadCaptureModalProps & {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [showThankYou, setShowThankYou] = useState(false)

  const handleSuccess = (leadId: string) => {
    setShowThankYou(true)
    props.onSuccess?.(leadId)
    
    setTimeout(() => {
      onOpenChange(false)
      setShowThankYou(false)
    }, 3000)
  }

  const FormComponent = variant === 'full' ? LeadCaptureForm : QuickLeadForm

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-[85vh] max-w-none m-0 p-0 rounded-t-xl rounded-b-none translate-y-[15vh] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="font-semibold line-clamp-1">
                {business.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Get in touch quickly
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {showThankYou ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Message Sent!</h3>
              <p className="text-muted-foreground text-lg mb-6">
                {business.name} will contact you soon.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>✓ Delivered successfully</p>
                <p>✓ Response within 24 hours</p>
                <p>✓ No spam, ever</p>
              </div>
            </div>
          ) : (
            <FormComponent
              business={business}
              onSuccess={handleSuccess}
              onError={props.onError}
              className="border-0 shadow-none max-w-none"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}