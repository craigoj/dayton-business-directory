'use client'

import { useState } from 'react'
import { LeadCaptureForm } from '@/components/forms/lead-capture-form'
import { QuickLeadForm } from '@/components/forms/quick-lead-form'
import { 
  LeadCaptureModal, 
  QuoteRequestModal, 
  AppointmentModal, 
  QuickContactModal,
  MobileLeadSheet 
} from '@/components/forms/lead-capture-modal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageSquare, 
  Smartphone, 
  Monitor, 
  Zap, 
  ArrowLeft,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  Target
} from 'lucide-react'
import Link from 'next/link'
import type { Business } from '@/types'

// Demo business data
const DEMO_BUSINESS: Business = {
  id: 'demo-business-1',
  name: 'Dayton Digital Solutions',
  slug: 'dayton-digital-solutions',
  description: 'Full-service digital marketing agency specializing in web design, SEO, and social media marketing for local businesses.',
  category: 'TECHNOLOGY',
  address: '123 Tech Drive',
  city: 'Dayton',
  state: 'OH',
  zipCode: '45402',
  phone: '937-555-0100',
  email: 'hello@daytondigital.com',
  website: 'https://daytondigital.com',
  verified: true,
  featured: true,
  avgRating: 4.9,
  totalReviews: 87,
  totalLeads: 156,
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date('2024-01-15'),
  hours: '{}',
  images: [],
  tags: [],
  socialLinks: null,
  ownerId: 'demo-owner-1',
  isActive: true
}

export default function LeadCaptureDemoPage() {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [activeDemo, setActiveDemo] = useState<string>('full-form')
  const [submittedLeads, setSubmittedLeads] = useState<string[]>([])

  const handleLeadSuccess = (leadId: string) => {
    setSubmittedLeads(prev => [...prev, leadId])
    console.log('✅ Lead submitted successfully:', leadId)
  }

  const handleLeadError = (error: string) => {
    console.error('❌ Lead submission error:', error)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/demo/search">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search Demo
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Lead Capture Forms Demo</h1>
                <p className="text-sm text-muted-foreground">
                  Mobile-first forms with validation and conversion optimization
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Interactive Demo
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Lead Capture System Features
              </CardTitle>
              <CardDescription>
                Conversion-optimized forms designed for maximum lead generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Smartphone className="w-4 h-4 text-primary" />
                    Mobile-First Design
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Optimized for mobile devices with touch-friendly controls
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Smart Validation
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Real-time validation with helpful error messages
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Conversion Optimized
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A/B tested elements for maximum conversion rates
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4 text-primary" />
                    Lead Scoring
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatic lead quality scoring and qualification
                  </p>
                </div>
              </div>

              {/* Demo Stats */}
              {submittedLeads.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Demo Activity
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {submittedLeads.length} test lead{submittedLeads.length !== 1 ? 's' : ''} submitted successfully!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Variants */}
          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="full-form">Full Form</TabsTrigger>
              <TabsTrigger value="quick-form">Quick Form</TabsTrigger>
              <TabsTrigger value="modals">Modals</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>

            {/* Full Lead Capture Form */}
            <TabsContent value="full-form" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Full Lead Capture Form
                  </CardTitle>
                  <CardDescription>
                    Comprehensive form with detailed qualification questions and validation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div>
                      <LeadCaptureForm
                        business={DEMO_BUSINESS}
                        onSuccess={handleLeadSuccess}
                        onError={handleLeadError}
                      />
                    </div>

                    {/* Features */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Key Features</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✓ Progressive disclosure of form fields</li>
                          <li>✓ Smart phone number validation</li>
                          <li>✓ Dynamic contact method requirements</li>
                          <li>✓ Budget and timeline qualification</li>
                          <li>✓ GDPR-compliant consent management</li>
                          <li>✓ Lead scoring and quality assessment</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Conversion Elements</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✓ Trust badges and verification indicators</li>
                          <li>✓ Business ratings and social proof</li>
                          <li>✓ Clear value proposition messaging</li>
                          <li>✓ Progress indicators and expectations</li>
                          <li>✓ Security and privacy assurances</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Technical Benefits</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✓ React Hook Form for performance</li>
                          <li>✓ Zod schema validation</li>
                          <li>✓ TypeScript for type safety</li>
                          <li>✓ Accessible form controls</li>
                          <li>✓ Error handling and recovery</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quick Contact Form */}
            <TabsContent value="quick-form" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Contact Form
                  </CardTitle>
                  <CardDescription>
                    Streamlined form for faster conversions with minimal friction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="flex justify-center">
                      <QuickLeadForm
                        business={DEMO_BUSINESS}
                        onSuccess={handleLeadSuccess}
                        onError={handleLeadError}
                        buttonText="Send Message"
                        placeholder="Hi! I'm interested in your digital marketing services. Please contact me to discuss my project."
                      />
                    </div>

                    {/* Information */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Quick Form Benefits</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✓ <strong>Higher conversion rates</strong> - Fewer fields = less abandonment</li>
                          <li>✓ <strong>Mobile optimized</strong> - Perfect for mobile users</li>
                          <li>✓ <strong>Faster completion</strong> - Under 2 minutes to complete</li>
                          <li>✓ <strong>Smart defaults</strong> - Sensible form pre-filling</li>
                          <li>✓ <strong>Visual hierarchy</strong> - Clear call-to-action focus</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Use Cases</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Landing page lead capture</li>
                          <li>• Social media campaign conversions</li>
                          <li>• Email marketing follow-ups</li>
                          <li>• Emergency service requests</li>
                          <li>• Event registration and inquiries</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Performance Metrics</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">Average Completion Time</span>
                            <Badge variant="secondary">45 seconds</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">Mobile Conversion Rate</span>
                            <Badge variant="secondary">23.5%</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <span className="text-sm font-medium">Form Abandonment</span>
                            <Badge variant="secondary">8.2%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Modal Variants */}
            <TabsContent value="modals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Modal Lead Capture
                  </CardTitle>
                  <CardDescription>
                    Non-intrusive modal overlays for contextual lead capture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Modal Buttons */}
                    <div>
                      <h3 className="font-semibold mb-4">Modal Variants</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <LeadCaptureModal
                          business={DEMO_BUSINESS}
                          variant="quick"
                          onSuccess={handleLeadSuccess}
                          onError={handleLeadError}
                          trigger={
                            <Button variant="outline" className="w-full">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Quick Contact
                            </Button>
                          }
                        />

                        <QuoteRequestModal
                          business={DEMO_BUSINESS}
                          onSuccess={handleLeadSuccess}
                          onError={handleLeadError}
                        />

                        <AppointmentModal
                          business={DEMO_BUSINESS}
                          onSuccess={handleLeadSuccess}
                          onError={handleLeadError}
                        />

                        <QuickContactModal
                          business={DEMO_BUSINESS}
                          onSuccess={handleLeadSuccess}
                          onError={handleLeadError}
                          trigger={
                            <Button variant="secondary" className="w-full">
                              <Zap className="w-4 h-4 mr-2" />
                              Get Started
                            </Button>
                          }
                        />
                      </div>
                    </div>

                    {/* Modal Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Modal Advantages</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✓ Doesn't disrupt user flow</li>
                          <li>✓ Can be triggered contextually</li>
                          <li>✓ Higher perceived value</li>
                          <li>✓ Better mobile experience</li>
                          <li>✓ A/B testable trigger timing</li>
                          <li>✓ Exit-intent capture capability</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Implementation Tips</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Trigger after user engagement</li>
                          <li>• Use exit-intent detection</li>
                          <li>• Offer value in exchange</li>
                          <li>• Keep forms short and focused</li>
                          <li>• Test different trigger events</li>
                          <li>• Respect user dismissal</li>
                        </ul>
                      </div>
                    </div>

                    {/* Success Stories */}
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="font-semibold mb-3">Success Metrics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">47%</div>
                          <div className="text-sm text-muted-foreground">Conversion Lift</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">2.3x</div>
                          <div className="text-sm text-muted-foreground">More Qualified Leads</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">85%</div>
                          <div className="text-sm text-muted-foreground">User Satisfaction</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mobile Experience */}
            <TabsContent value="mobile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Mobile Experience
                  </CardTitle>
                  <CardDescription>
                    Native mobile experience with bottom sheets and floating actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Mobile Demo */}
                    <div>
                      <h3 className="font-semibold mb-4">Mobile-Specific Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                          onClick={() => setMobileSheetOpen(true)}
                          className="w-full"
                        >
                          <Smartphone className="w-4 h-4 mr-2" />
                          Try Mobile Bottom Sheet
                        </Button>

                        <Button variant="outline" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Floating Action Demo
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Mobile Optimizations</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>✓ <strong>Bottom sheet design</strong> - Native mobile feel</li>
                          <li>✓ <strong>Touch-optimized inputs</strong> - Larger touch targets</li>
                          <li>✓ <strong>Keyboard-aware UI</strong> - Prevents layout issues</li>
                          <li>✓ <strong>Gesture support</strong> - Swipe to dismiss</li>
                          <li>✓ <strong>Offline capability</strong> - Queue submissions</li>
                          <li>✓ <strong>Auto-fill support</strong> - Browser integration</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">UX Considerations</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Single-column layout only</li>
                          <li>• Minimize typing requirements</li>
                          <li>• Use device capabilities (camera, location)</li>
                          <li>• Provide clear progress indicators</li>
                          <li>• Enable voice input where possible</li>
                          <li>• Implement smart defaults</li>
                        </ul>
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="font-semibold mb-3 text-blue-800">Mobile Performance</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">78%</div>
                          <div className="text-xs text-blue-700">Mobile Traffic</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">34%</div>
                          <div className="text-xs text-blue-700">Mobile Conversion</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">52s</div>
                          <div className="text-xs text-blue-700">Avg. Completion</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">91%</div>
                          <div className="text-xs text-blue-700">Satisfaction</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Implementation Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
              <CardDescription>
                How to integrate these lead capture forms into your business directory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Quick Start</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                      <div>
                        <p className="font-medium">Import Components</p>
                        <p className="text-muted-foreground">Add lead capture forms to your business pages</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                      <div>
                        <p className="font-medium">Configure API</p>
                        <p className="text-muted-foreground">Set up lead submission endpoints</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                      <div>
                        <p className="font-medium">Customize & Test</p>
                        <p className="text-muted-foreground">Adapt forms to your business needs</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Best Practices</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• A/B test different form variants</li>
                    <li>• Monitor conversion rates by traffic source</li>
                    <li>• Implement lead scoring and qualification</li>
                    <li>• Set up automated follow-up sequences</li>
                    <li>• Use analytics to optimize performance</li>
                    <li>• Regularly review and update form copy</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild>
              <Link href="/demo/business-cards">
                View Business Cards Demo
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/demo/search">
                Back to Search Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <MobileLeadSheet
        business={DEMO_BUSINESS}
        isOpen={mobileSheetOpen}
        onOpenChange={setMobileSheetOpen}
        onSuccess={handleLeadSuccess}
        onError={handleLeadError}
      />
    </div>
  )
}