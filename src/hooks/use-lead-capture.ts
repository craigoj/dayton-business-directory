'use client'

import { useState, useCallback } from 'react'

export interface LeadData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  inquiryType: 'quote' | 'appointment' | 'information' | 'other'
  preferredContact: 'email' | 'phone' | 'either'
  message: string
  urgency: 'asap' | 'within_week' | 'within_month' | 'flexible'
  budget?: string
  marketingConsent: boolean
  termsAccepted: boolean
  businessId: string
  source: string
}

export interface LeadSubmissionResult {
  success: boolean
  leadId?: string
  error?: string
  message: string
}

interface UseLeadCaptureOptions {
  onSuccess?: (result: LeadSubmissionResult) => void
  onError?: (error: string) => void
  autoReset?: boolean
  resetDelay?: number
}

export function useLeadCapture({
  onSuccess,
  onError,
  autoReset = true,
  resetDelay = 3000
}: UseLeadCaptureOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [lastSubmittedLead, setLastSubmittedLead] = useState<string | null>(null)

  // Submit lead to API
  const submitLead = useCallback(async (leadData: LeadData): Promise<LeadSubmissionResult> => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      // Transform data to match API schema
      const apiData = {
        name: `${leadData.firstName} ${leadData.lastName}`.trim(),
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone || undefined,
        message: leadData.message,
        businessId: leadData.businessId,
        source: leadData.source.toUpperCase() as any, // Convert to enum format
        inquiryType: leadData.inquiryType,
        preferredContact: leadData.preferredContact,
        urgency: leadData.urgency,
        budget: leadData.budget,
        marketingConsent: leadData.marketingConsent,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        referrer: typeof window !== 'undefined' ? document.referrer : '',
        sessionId: generateSessionId()
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      const successResult: LeadSubmissionResult = {
        success: true,
        leadId: result.id,
        message: 'Thank you! Your inquiry has been sent successfully. The business will contact you soon.'
      }

      setSubmitStatus('success')
      setSubmitMessage(successResult.message)
      setLastSubmittedLead(result.id)
      
      onSuccess?.(successResult)

      // Auto-reset after delay
      if (autoReset) {
        setTimeout(() => {
          resetSubmitState()
        }, resetDelay)
      }

      return successResult

    } catch (error) {
      console.error('Lead submission error:', error)
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Sorry, there was an error submitting your inquiry. Please try again or contact the business directly.'

      const errorResult: LeadSubmissionResult = {
        success: false,
        error: errorMessage,
        message: errorMessage
      }

      setSubmitStatus('error')
      setSubmitMessage(errorMessage)
      
      onError?.(errorMessage)

      return errorResult

    } finally {
      setIsSubmitting(false)
    }
  }, [onSuccess, onError, autoReset, resetDelay])

  // Reset submission state
  const resetSubmitState = useCallback(() => {
    setSubmitStatus('idle')
    setSubmitMessage('')
    setLastSubmittedLead(null)
  }, [])

  // Generate a simple session ID for tracking
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Validate lead data before submission
  const validateLeadData = useCallback((data: Partial<LeadData>): string[] => {
    const errors: string[] = []

    if (!data.firstName?.trim()) errors.push('First name is required')
    if (!data.lastName?.trim()) errors.push('Last name is required')
    if (!data.email?.trim()) errors.push('Email is required')
    if (!data.message?.trim()) errors.push('Message is required')
    if (!data.inquiryType) errors.push('Inquiry type is required')
    if (!data.preferredContact) errors.push('Preferred contact method is required')
    if (!data.urgency) errors.push('Timeline is required')
    if (!data.termsAccepted) errors.push('You must accept the terms and conditions')
    if (!data.businessId?.trim()) errors.push('Business ID is required')

    // Validate email format
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address')
    }

    // Validate phone if provided or required
    if (data.phone && !/^(\+1|1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(data.phone)) {
      errors.push('Please enter a valid US phone number')
    }

    // Require phone if preferred contact method needs it
    if ((data.preferredContact === 'phone' || data.preferredContact === 'either') && !data.phone?.trim()) {
      errors.push('Phone number is required for your preferred contact method')
    }

    // Validate message length
    if (data.message && (data.message.length < 10 || data.message.length > 500)) {
      errors.push('Message must be between 10 and 500 characters')
    }

    return errors
  }, [])

  // Get submission analytics
  const getSubmissionStats = useCallback(() => {
    return {
      isSubmitting,
      submitStatus,
      submitMessage,
      lastSubmittedLead,
      hasError: submitStatus === 'error',
      hasSuccess: submitStatus === 'success',
      canSubmit: !isSubmitting && submitStatus !== 'success'
    }
  }, [isSubmitting, submitStatus, submitMessage, lastSubmittedLead])

  return {
    // State
    isSubmitting,
    submitStatus,
    submitMessage,
    lastSubmittedLead,

    // Actions
    submitLead,
    resetSubmitState,
    validateLeadData,

    // Computed values
    ...getSubmissionStats(),

    // Utilities
    generateSessionId
  }
}

// Type guard to check if data is complete lead data
export function isCompleteLeadData(data: Partial<LeadData>): data is LeadData {
  return !!(
    data.firstName &&
    data.lastName &&
    data.email &&
    data.inquiryType &&
    data.preferredContact &&
    data.message &&
    data.urgency &&
    data.businessId &&
    data.termsAccepted
  )
}

// Helper function to format lead data for display
export function formatLeadForDisplay(lead: LeadData) {
  return {
    name: `${lead.firstName} ${lead.lastName}`,
    contact: lead.preferredContact === 'email' ? lead.email : lead.phone || lead.email,
    inquiryType: lead.inquiryType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    urgency: lead.urgency.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    budget: lead.budget ? lead.budget.replace('_', ' - ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not specified',
    hasMarketingConsent: lead.marketingConsent
  }
}

// Helper function to estimate lead quality score
export function calculateLeadScore(lead: LeadData): number {
  let score = 0

  // Base score for complete required fields
  score += 30

  // Phone number provided
  if (lead.phone) score += 15

  // Detailed message
  if (lead.message.length > 50) score += 10
  if (lead.message.length > 100) score += 10

  // Budget provided
  if (lead.budget && lead.budget !== 'discuss') score += 15

  // Urgent timeline
  if (lead.urgency === 'asap') score += 10
  if (lead.urgency === 'within_week') score += 5

  // High-value inquiry types
  if (lead.inquiryType === 'quote') score += 15
  if (lead.inquiryType === 'appointment') score += 10

  // Marketing consent (shows engagement)
  if (lead.marketingConsent) score += 5

  return Math.min(score, 100) // Cap at 100
}