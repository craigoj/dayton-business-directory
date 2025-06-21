import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { BrightDataService } from '@/lib/brightdata'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only allow admins and business owners to use BrightData
    if (session.user.role !== 'ADMIN' && session.user.role !== 'BUSINESS_OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { location, category, radius, limit } = body

    if (!location) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      )
    }

    const brightData = new BrightDataService()
    const results = await brightData.searchBusinesses({
      location,
      category,
      radius: radius || 10,
      limit: limit || 50
    })

    return NextResponse.json({
      results,
      total: results.length,
      query: { location, category, radius, limit }
    })
  } catch (error) {
    console.error('BrightData search error:', error)
    return NextResponse.json(
      { error: 'Failed to search businesses' },
      { status: 500 }
    )
  }
}