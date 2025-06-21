import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AnalyticType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({ analytics: [], raw: [], summary: {} })
    }
    
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const metric = searchParams.get('metric') as AnalyticType | null
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const period = searchParams.get('period') || '30' // days

    const where: Record<string, any> = {}

    // If user is business owner, filter by their businesses
    if (session.user.role === 'BUSINESS_OWNER') {
      const userBusinesses = await prisma.business.findMany({
        where: { ownerId: session.user.id },
        select: { id: true }
      })
      where.businessId = {
        in: userBusinesses.map(b => b.id)
      }
    }

    if (businessId) where.businessId = businessId
    if (metric) where.metric = metric

    // Date filtering
    const dateFilter: Record<string, any> = {}
    if (startDate && endDate) {
      dateFilter.gte = new Date(startDate)
      dateFilter.lte = new Date(endDate)
    } else {
      dateFilter.gte = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000)
    }
    where.date = dateFilter

    const analytics = await prisma.analytics.findMany({
      where,
      include: {
        business: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: 'desc' }
    })

    // Aggregate data by metric
    const aggregated = analytics.reduce((acc, item) => {
      const key = item.metric
      if (!acc[key]) {
        acc[key] = {
          metric: key,
          total: 0,
          data: []
        }
      }
      acc[key].total += item.value
      acc[key].data.push(item)
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      analytics: Object.values(aggregated),
      raw: analytics,
      summary: {
        totalMetrics: analytics.length,
        dateRange: { start: dateFilter.gte, end: dateFilter.lte || new Date() }
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({ message: 'Build time - analytics disabled' })
    }
    
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { metric, value, businessId, metadata } = body

    // Verify business ownership if businessId is provided
    if (businessId && session.user.role !== 'ADMIN') {
      const business = await prisma.business.findUnique({
        where: { id: businessId }
      })

      if (!business || business.ownerId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const analytic = await prisma.analytics.create({
      data: {
        date: new Date(),
        metric,
        value,
        businessId,
        userId: session.user.id,
        metadata
      }
    })

    return NextResponse.json(analytic, { status: 201 })
  } catch (error) {
    console.error('Error creating analytic:', error)
    return NextResponse.json(
      { error: 'Failed to create analytic' },
      { status: 500 }
    )
  }
}