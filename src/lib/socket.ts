import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { LeadWithRelations, LeadRouting, SocketEvents } from '@/types'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export function initializeSocket(server: NetServer): ServerIO {
  const io = new ServerIO(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    // Join business room for real-time updates
    socket.on('join:business', (businessId: string) => {
      socket.join(`business:${businessId}`)
      console.log(`Socket ${socket.id} joined business room: ${businessId}`)
    })

    // Join user room for notifications
    socket.on('join:user', (userId: string) => {
      socket.join(`user:${userId}`)
      console.log(`Socket ${socket.id} joined user room: ${userId}`)
    })

    // Leave rooms on disconnect
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id)
    })
  })

  return io
}

// Utility functions for emitting events
export class SocketService {
  private static io: ServerIO

  static setIO(io: ServerIO) {
    this.io = io
  }

  static emitNewLead(lead: LeadWithRelations) {
    if (this.io) {
      this.io.to(`business:${lead.businessId}`).emit('lead:new', lead)
      if (lead.assignedTo) {
        this.io.to(`user:${lead.assignedTo.id}`).emit('lead:assigned', {
          leadId: lead.id,
          businessId: lead.businessId,
          assignedTo: lead.assignedTo.id,
          priority: lead.priority,
        } as LeadRouting)
      }
    }
  }

  static emitLeadUpdate(lead: LeadWithRelations) {
    if (this.io) {
      this.io.to(`business:${lead.businessId}`).emit('lead:updated', lead)
      if (lead.assignedTo) {
        this.io.to(`user:${lead.assignedTo.id}`).emit('lead:updated', lead)
      }
    }
  }

  static emitBusinessUpdate(businessId: string, business: any) {
    if (this.io) {
      this.io.to(`business:${businessId}`).emit('business:updated', business)
    }
  }

  static emitAnalyticsUpdate(businessId: string, analytics: any) {
    if (this.io) {
      this.io.to(`business:${businessId}`).emit('analytics:updated', analytics)
    }
  }
}