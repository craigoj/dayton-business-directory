#!/bin/bash

echo "🚀 Dayton Business Directory - Production Setup"
echo "=============================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.example .env.local
    echo "✅ Created .env.local - please edit with your actual values"
fi

# Generate NextAuth secret if needed
echo ""
echo "🔑 Generating NEXTAUTH_SECRET..."
SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
echo "Your NEXTAUTH_SECRET: $SECRET"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if Prisma client is generated
echo "🗄️  Generating Prisma client..."
npm run db:generate

echo ""
echo "🎯 Next Steps:"
echo "1. Edit .env.local with your database URL"
echo "2. Run 'vercel login' to authenticate"
echo "3. Run 'vercel' to deploy"
echo "4. Set environment variables in Vercel dashboard"
echo "5. Run 'npm run db:push' to create database tables"
echo ""
echo "📖 Read DEPLOY_NOW.md for detailed instructions"