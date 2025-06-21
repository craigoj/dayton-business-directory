import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { BrightDataService } from '@/lib/brightdata'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'BUSINESS_OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { businessId } = body

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      )
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check ownership unless admin
    if (session.user.role !== 'ADMIN' && business.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const brightData = new BrightDataService()
    const competitorAnalysis = await brightData.getCompetitorAnalysis(
      businessId,
      `${business.city}, ${business.state}`,
      business.category
    )

    // Store competitor analysis in analytics
    await prisma.analytics.create({
      data: {
        date: new Date(),
        metric: 'SEARCH_APPEARANCES',
        value: competitorAnalysis.competitors.length,
        businessId,
        metadata: {
          action: 'competitor_analysis',
          source: 'brightdata',
          marketInsights: competitorAnalysis.marketInsights,
          competitorCount: competitorAnalysis.competitors.length
        }
      }
    })

    return NextResponse.json({
      businessId,
      analysis: competitorAnalysis,
      analyzedAt: new Date()
    })
  } catch (error) {
    console.error('BrightData competitor analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze competitors' },
      { status: 500 }
    )
  }
}