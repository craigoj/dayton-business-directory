import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getPrisma } from '@/lib/db'
import { businessSchema } from '@/lib/validations'
import { BusinessCategory, BusinessStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Skip during build time
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ businesses: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } })
    }
    
    const prisma = getPrisma()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as BusinessCategory | null
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const featured = searchParams.get('featured') === 'true'
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {
      status: BusinessStatus.ACTIVE,
    }

    if (category) where.category = category
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (state) where.state = state
    if (featured) where.featured = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        include: {
          owner: {
            select: { id: true, name: true, email: true }
          },
          reviews: {
            select: { rating: true }
          },
          _count: {
            select: { leads: true, reviews: true }
          }
        },
        skip,
        take: limit,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.business.count({ where })
    ])

    const businessesWithStats = businesses.map(business => ({
      ...business,
      avgRating: business.reviews.length > 0 
        ? business.reviews.reduce((acc, review) => acc + review.rating, 0) / business.reviews.length
        : 0,
      totalLeads: business._count.leads,
      totalReviews: business._count.reviews,
    }))

    return NextResponse.json({
      businesses: businessesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }
    
    const prisma = getPrisma()
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = businessSchema.parse(body)

    // Check if slug is unique
    const existingBusiness = await prisma.business.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingBusiness) {
      return NextResponse.json(
        { error: 'Business slug already exists' },
        { status: 400 }
      )
    }

    const business = await prisma.business.create({
      data: {
        ...validatedData,
        ownerId: session.user.id,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(business, { status: 201 })
  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: 'Failed to create business' },
      { status: 500 }
    )
  }
}