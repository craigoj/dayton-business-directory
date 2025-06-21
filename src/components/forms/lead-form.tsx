'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema, LeadFormData } from '@/lib/validations'
import { useCreateLead } from '@/hooks/use-leads'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle } from 'lucide-react'
import { BusinessWithRelations } from '@/types'

interface LeadFormProps {
  business: BusinessWithRelations
  onSuccess?: () => void
}

export function LeadForm({ business, onSuccess }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const createLead = useCreateLead()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      businessId: business.id,
    },
  })

  const onSubmit = async (data: LeadFormData) => {
    try {
      await createLead.mutateAsync(data)
      setSubmitted(true)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to submit lead:', error)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Message Sent!</h3>
              <p className="text-muted-foreground">
                We&apos;ve sent your message to {business.name}. They&apos;ll get back to you soon.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSubmitted(false)}
            >
              Send Another Message
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact {business.name}</CardTitle>
        <CardDescription>
          Send a message to get more information or request services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your full name"
              disabled={createLead.isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email address"
              disabled={createLead.isPending}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="(555) 123-4567"
              disabled={createLead.isPending}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Tell us about your needs or ask a question..."
              rows={4}
              disabled={createLead.isPending}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={createLead.isPending}
          >
            {createLead.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Message...
              </>
            ) : (
              'Send Message'
            )}
          </Button>

          {/* Error Message */}
          {createLead.error && (
            <p className="text-sm text-destructive text-center">
              {createLead.error instanceof Error ? createLead.error.message : 'Failed to send message'}
            </p>
          )}

          {/* Privacy Notice */}
          <p className="text-xs text-muted-foreground text-center">
            Your information will only be shared with {business.name} to respond to your inquiry.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}