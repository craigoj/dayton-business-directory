import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { businessUpdateSchema } from '@/lib/validations'
import { SocketService } from '@/lib/socket'

interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        leads: {
          include: {
            assignedTo: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        },
        analytics: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Calculate average rating
    const avgRating = business.reviews.length > 0
      ? business.reviews.reduce((acc, review) => acc + review.rating, 0) / business.reviews.length
      : 0

    return NextResponse.json({
      ...business,
      avgRating,
      totalLeads: business.leads.length,
      totalReviews: business.reviews.length,
    })
  } catch (error) {
    console.error('Error fetching business:', error)
    return NextResponse.json(
      { error: 'Failed to fetch business' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const business = await prisma.business.findUnique({
      where: { id: params.id }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check ownership or admin role
    if (business.ownerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = businessUpdateSchema.parse(body)

    // Check slug uniqueness if updating
    if (validatedData.slug && validatedData.slug !== business.slug) {
      const existingBusiness = await prisma.business.findUnique({
        where: { slug: validatedData.slug }
      })

      if (existingBusiness) {
        return NextResponse.json(
          { error: 'Business slug already exists' },
          { status: 400 }
        )
      }
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Emit real-time update
    SocketService.emitBusinessUpdate(params.id, updatedBusiness)

    return NextResponse.json(updatedBusiness)
  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const business = await prisma.business.findUnique({
      where: { id: params.id }
    })

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Check ownership or admin role
    if (business.ownerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.business.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Business deleted successfully' })
  } catch (error) {
    console.error('Error deleting business:', error)
    return NextResponse.json(
      { error: 'Failed to delete business' },
      { status: 500 }
    )
  }
}