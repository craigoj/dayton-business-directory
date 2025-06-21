import { NextRequest } from 'next/server'
import { Server as NetServer } from 'http'
import { Server as ServerIO } from 'socket.io'
import { initializeSocket, SocketService } from '@/lib/socket'

let io: ServerIO | undefined

export async function GET(req: NextRequest) {
  if (!io) {
    console.log('Initializing Socket.io server...')
    
    // This is a workaround for Next.js 13+ App Router
    // In production, you might want to use a separate server
    const httpServer = new NetServer()
    io = initializeSocket(httpServer)
    SocketService.setIO(io)
    
    console.log('Socket.io server initialized')
  }

  return new Response('Socket.io server running', { status: 200 })
}