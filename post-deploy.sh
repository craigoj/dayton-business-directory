#!/bin/bash

echo "🗄️  Setting up database after Vercel deployment"
echo "=============================================="

# Pull environment variables from Vercel
echo "📥 Pulling environment variables from Vercel..."
vercel env pull .env.local

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "📤 Pushing database schema..."
npm run db:push

echo ""
echo "✅ Database setup complete!"
echo "🌐 Your app should now be fully functional"
echo ""
echo "🔗 Visit your Vercel URL to test the application"