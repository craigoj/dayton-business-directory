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

    // Verify business exists and user has access
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
    const enrichmentData = await brightData.enrichBusinessData(businessId)

    // Update business with enriched data
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        hours: enrichmentData.hours ? enrichmentData.hours : business.hours,
        lastDataSync: new Date(),
        brightDataId: `enriched_${businessId}`,
      }
    })

    // Log the enrichment in analytics
    await prisma.analytics.create({
      data: {
        date: new Date(),
        metric: 'PROFILE_VIEWS',
        value: 1,
        businessId,
        metadata: {
          action: 'data_enrichment',
          source: 'brightdata',
          enrichedFields: Object.keys(enrichmentData)
        }
      }
    })

    return NextResponse.json({
      business: updatedBusiness,
      enrichmentData,
      enrichedAt: new Date()
    })
  } catch (error) {
    console.error('BrightData enrichment error:', error)
    return NextResponse.json(
      { error: 'Failed to enrich business data' },
      { status: 500 }
    )
  }
}