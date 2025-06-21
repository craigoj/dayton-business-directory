import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { SocketService } from '@/lib/socket'
import { Priority } from '@prisma/client'

interface LeadRoutingRequest {
  leadId: string
  assignmentType: 'auto' | 'manual'
  assignedTo?: string
  priority?: Priority
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as LeadRoutingRequest
    const { leadId, assignmentType, assignedTo, priority } = body

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        business: {
          include: {
            owner: true
          }
        }
      }
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Check permissions
    const canRoute = 
      session.user.role === 'ADMIN' ||
      lead.business.ownerId === session.user.id

    if (!canRoute) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let finalAssignedTo = assignedTo

    // Auto-assignment logic
    if (assignmentType === 'auto' && !assignedTo) {
      // Find available users who can handle leads for this business
      const availableUsers = await prisma.user.findMany({
        where: {
          OR: [
            { id: lead.business.ownerId }, // Business owner
            { role: 'ADMIN' }, // Admins can handle any lead
          ]
        }
      })

      // Simple round-robin assignment (in production, you might use more sophisticated logic)
      if (availableUsers.length > 0) {
        // Get user with least assigned leads
        const userLeadCounts = await Promise.all(
          availableUsers.map(async (user) => ({
            user,
            count: await prisma.lead.count({
              where: {
                userId: user.id,
                status: { in: ['NEW', 'CONTACTED', 'QUALIFIED'] }
              }
            })
          }))
        )

        const userWithLeastLeads = userLeadCounts.reduce((min, current) =>
          current.count < min.count ? current : min
        )

        finalAssignedTo = userWithLeastLeads.user.id
      }
    }

    // Calculate priority if not provided
    let finalPriority = priority || lead.priority

    if (!priority) {
      // Auto-calculate priority based on lead source and business data
      const businessMetrics = await prisma.analytics.findMany({
        where: {
          businessId: lead.businessId,
          metric: 'LEAD_GENERATED',
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })

      const monthlyLeads = businessMetrics.reduce((sum, metric) => sum + metric.value, 0)
      
      // High priority if business gets few leads or lead is from premium source
      if (monthlyLeads < 10 || lead.source === 'REFERRAL') {
        finalPriority = 'HIGH'
      } else if (lead.source === 'BRIGHTDATA' || lead.source === 'SOCIAL_MEDIA') {
        finalPriority = 'MEDIUM'
      }
    }

    // Update the lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        userId: finalAssignedTo,
        priority: finalPriority,
        assignedAt: finalAssignedTo ? new Date() : null,
      },
      include: {
        business: {
          select: { id: true, name: true, slug: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Emit real-time notifications
    SocketService.emitLeadUpdate(updatedLead)

    if (finalAssignedTo) {
      SocketService.emitNewLead(updatedLead)
    }

    // Log the routing action
    await prisma.analytics.create({
      data: {
        date: new Date(),
        metric: 'LEAD_GENERATED',
        value: 1,
        businessId: lead.businessId,
        userId: finalAssignedTo,
        metadata: {
          action: 'lead_routed',
          assignmentType,
          priority: finalPriority,
          routedBy: session.user.id
        }
      }
    })

    return NextResponse.json({
      lead: updatedLead,
      routing: {
        assignedTo: finalAssignedTo,
        priority: finalPriority,
        assignmentType,
        routedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Error routing lead:', error)
    return NextResponse.json(
      { error: 'Failed to route lead' },
      { status: 500 }
    )
  }
}