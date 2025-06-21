import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getPrisma } from '@/lib/db'
import { leadSchema } from '@/lib/validations'
import { SocketService } from '@/lib/socket'
import { LeadStatus, Priority } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Skip during build time
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ leads: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } })
    }
    
    const prisma = getPrisma()
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const status = searchParams.get('status') as LeadStatus | null
    const priority = searchParams.get('priority') as Priority | null
    const assignedTo = searchParams.get('assignedTo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

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
    if (status) where.status = status
    if (priority) where.priority = priority
    if (assignedTo) where.userId = assignedTo

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          business: {
            select: { id: true, name: true, slug: true }
          },
          assignedTo: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.lead.count({ where })
    ])

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
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
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Verify business exists and is active
    const business = await prisma.business.findUnique({
      where: { 
        id: validatedData.businessId,
        status: 'ACTIVE'
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found or inactive' },
        { status: 404 }
      )
    }

    const lead = await prisma.lead.create({
      data: validatedData,
      include: {
        business: {
          select: { id: true, name: true, slug: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Emit real-time notification
    SocketService.emitNewLead(lead)

    // Log analytics
    await prisma.analytics.create({
      data: {
        date: new Date(),
        metric: 'LEAD_GENERATED',
        value: 1,
        businessId: validatedData.businessId,
        metadata: {
          source: validatedData.source || 'WEBSITE',
          priority: 'MEDIUM'
        }
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}