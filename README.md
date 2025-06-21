# Dayton Business Directory

A modern, full-stack local business directory platform with real-time lead routing, analytics, and BrightData integration built for the Dayton area.

## 🚀 Features

### Core Features
- **Mobile-first Design**: Responsive UI optimized for all devices
- **Real-time Lead Routing**: Intelligent lead distribution with Socket.io
- **Business Dashboards**: Comprehensive analytics and insights
- **BrightData Integration**: Automated data collection and competitor analysis
- **Advanced Search & Filtering**: Find businesses by category, location, and more
- **User Authentication**: Secure login with NextAuth.js
- **Role-based Access Control**: Different permissions for users, business owners, and admins

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **Socket.io** for real-time communication
- **Zustand** for state management
- **React Query** for data fetching
- **Tailwind CSS** for styling
- **Shadcn/ui** components

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Redis (for caching and sessions)
- BrightData account (optional)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dayton_business_directory"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-minimum-32-characters"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Redis (optional - for production)
REDIS_URL="redis://localhost:6379"

# BrightData (optional)
BRIGHTDATA_API_KEY="your-brightdata-api-key"
BRIGHTDATA_ZONE="your-brightdata-zone"

# Socket.io
SOCKET_PORT=3001
```

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Key Components Built

### API Endpoints
- **Authentication**: NextAuth.js with Google OAuth
- **Business CRUD**: Complete business management
- **Lead Management**: Lead creation, routing, and tracking
- **Real-time Updates**: Socket.io for live notifications
- **BrightData Integration**: Data enrichment and competitor analysis
- **Analytics**: Performance tracking and insights

### Frontend Components
- **Business Cards**: Mobile-first business display
- **Search & Filters**: Advanced filtering system
- **Lead Forms**: Contact forms with validation
- **BrightData Panel**: Data enrichment interface
- **Responsive Design**: Tailwind CSS with Shadcn/ui

### Database Schema
- **Users**: Authentication and roles
- **Businesses**: Complete business profiles
- **Leads**: Customer inquiries with routing
- **Reviews**: Business ratings and feedback
- **Analytics**: Performance metrics

## 🔄 Real-time Features

- Live lead notifications
- Real-time lead routing
- Instant business updates
- Socket.io powered communication

## 📈 BrightData Integration

- Automated business data collection
- Competitor analysis
- Market research capabilities
- Data enrichment workflows

## 🚀 Production Ready

- TypeScript for type safety
- Prisma ORM with PostgreSQL
- Redis caching support
- Performance optimizations
- Mobile-first responsive design
- Comprehensive error handling

## Next Steps

1. Set up your database and environment variables
2. Run the development server
3. Configure BrightData API keys (optional)
4. Add your business data
5. Test the lead routing system

This application provides a solid foundation for a local business directory with modern features like real-time lead routing, business analytics, and automated data enrichment through BrightData integration.