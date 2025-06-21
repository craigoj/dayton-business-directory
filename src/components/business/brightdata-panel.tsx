'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEnrichBusiness, useCompetitorAnalysis } from '@/hooks/use-brightdata'
import { Loader2, RefreshCw, TrendingUp, Users, Clock, Star } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface BrightDataPanelProps {
  businessId: string
  lastDataSync?: Date | null
}

export function BrightDataPanel({ businessId, lastDataSync }: BrightDataPanelProps) {
  const [activeTab, setActiveTab] = useState<'enrich' | 'competitors'>('enrich')
  const [competitorData, setCompetitorData] = useState<any>(null)
  
  const enrichBusiness = useEnrichBusiness()
  const competitorAnalysis = useCompetitorAnalysis()

  const handleEnrich = async () => {
    try {
      await enrichBusiness.mutateAsync(businessId)
    } catch (error) {
      console.error('Enrichment failed:', error)
    }
  }

  const handleCompetitorAnalysis = async () => {
    try {
      const result = await competitorAnalysis.mutateAsync(businessId)
      setCompetitorData(result.analysis)
    } catch (error) {
      console.error('Competitor analysis failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                BrightData Intelligence
              </CardTitle>
              <CardDescription>
                Enhance your business data with automated market research
              </CardDescription>
            </div>
            {lastDataSync && (
              <Badge variant="outline">
                Last sync: {formatDateTime(lastDataSync)}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        <Button
          variant={activeTab === 'enrich' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('enrich')}
          className="rounded-b-none"
        >
          Data Enrichment
        </Button>
        <Button
          variant={activeTab === 'competitors' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('competitors')}
          className="rounded-b-none"
        >
          Competitor Analysis
        </Button>
      </div>

      {/* Data Enrichment Tab */}
      {activeTab === 'enrich' && (
        <Card>
          <CardHeader>
            <CardTitle>Business Data Enrichment</CardTitle>
            <CardDescription>
              Automatically update and enhance your business information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">Hours</div>
                <div className="text-sm text-muted-foreground">
                  Auto-update business hours
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">Social Links</div>
                <div className="text-sm text-muted-foreground">
                  Find social media profiles
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">Live Data</div>
                <div className="text-sm text-muted-foreground">
                  Real-time information updates
                </div>
              </div>
            </div>

            <Button 
              onClick={handleEnrich} 
              disabled={enrichBusiness.isPending}
              className="w-full"
            >
              {enrichBusiness.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enriching Data...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Enrich Business Data
                </>
              )}
            </Button>

            {enrichBusiness.isSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-semibold text-green-800">Enrichment Complete!</div>
                <div className="text-green-700">
                  Your business data has been successfully updated with the latest information.
                </div>
              </div>
            )}

            {enrichBusiness.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-red-800">Enrichment Failed</div>
                <div className="text-red-700">
                  {enrichBusiness.error instanceof Error 
                    ? enrichBusiness.error.message 
                    : 'Failed to enrich business data'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Competitor Analysis Tab */}
      {activeTab === 'competitors' && (
        <Card>
          <CardHeader>
            <CardTitle>Competitor Analysis</CardTitle>
            <CardDescription>
              Analyze your competition and market positioning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleCompetitorAnalysis} 
              disabled={competitorAnalysis.isPending}
              className="w-full"
            >
              {competitorAnalysis.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Competitors...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyze Competitors
                </>
              )}
            </Button>

            {competitorData && (
              <div className="space-y-4">
                {/* Market Insights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-primary">
                      {competitorData.marketInsights.avgRating}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-primary">
                      {competitorData.marketInsights.avgReviewCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Reviews</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-primary">
                      {competitorData.marketInsights.popularPriceRange}
                    </div>
                    <div className="text-sm text-muted-foreground">Price Range</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold text-primary">
                      {competitorData.competitors.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Competitors</div>
                  </div>
                </div>

                {/* Competitor List */}
                <div>
                  <h4 className="font-semibold mb-3">Nearby Competitors</h4>
                  <div className="space-y-2">
                    {competitorData.competitors.map((competitor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{competitor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {competitor.distance} • {competitor.priceRange}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm">{competitor.rating}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ({competitor.reviewCount})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {competitorAnalysis.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-red-800">Analysis Failed</div>
                <div className="text-red-700">
                  {competitorAnalysis.error instanceof Error 
                    ? competitorAnalysis.error.message 
                    : 'Failed to analyze competitors'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}