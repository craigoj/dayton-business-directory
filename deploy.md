# Deployment Guide

## Quick Deploy to Vercel

### 1. Prerequisites
- Vercel account (sign up at vercel.com)
- PostgreSQL database (use Supabase, PlanetScale, or Neon for free options)

### 2. Database Setup Options

#### Option A: Supabase (Recommended)
1. Go to https://supabase.com
2. Create a new project
3. Get your database URL from Settings > Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

#### Option B: PlanetScale
1. Go to https://planetscale.com
2. Create a new database
3. Get connection string from dashboard

#### Option C: Neon
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string

### 3. Deploy to Vercel

#### Method 1: Command Line
```bash
# Login to Vercel (will open browser)
vercel login

# Deploy from project directory
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: dayton-business-directory
# - Directory: ./
# - Override settings? No
```

#### Method 2: GitHub Integration
1. Push code to GitHub repository
2. Go to vercel.com dashboard
3. Click "Import Project"
4. Select your GitHub repository
5. Configure environment variables (see below)

### 4. Environment Variables

Add these in Vercel dashboard (Settings > Environment Variables):

```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_32_character_secret_key
NEXTAUTH_URL=https://your-app.vercel.app
```

Optional variables:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BRIGHTDATA_API_KEY=your_brightdata_key
BRIGHTDATA_ZONE=your_brightdata_zone
REDIS_URL=your_redis_url
```

### 5. Database Migration

After deployment, run database migrations:

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run database migration
vercel env pull .env.local
npm run db:push
```

### 6. Post-Deployment

1. Visit your deployed URL
2. Test the homepage
3. Try creating a business listing
4. Test the lead form functionality
5. Check real-time features

### 7. Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Update NEXTAUTH_URL environment variable

### 8. Monitoring

- View deployment logs in Vercel dashboard
- Monitor API usage in Functions tab
- Check performance in Analytics

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Ensure database allows external connections
   - Check if database is in same region as Vercel deployment

2. **NextAuth Error**
   - Verify NEXTAUTH_SECRET is set
   - Ensure NEXTAUTH_URL matches your domain
   - Check OAuth provider configuration

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Ensure TypeScript errors are resolved

4. **API Timeouts**
   - API functions have 10s timeout on Hobby plan
   - Consider upgrading to Pro for longer timeouts
   - Optimize database queries

### Support

- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs