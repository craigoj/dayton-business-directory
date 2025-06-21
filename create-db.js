#!/usr/bin/env node

const postgres = require('postgres');

const sql = postgres('postgresql://postgres:r3K%262KW6Getmoney1@db.smzyjsypuknmiwzcrsni.supabase.co:5432/postgres', {
  ssl: 'require'
});

async function createDatabase() {
  try {
    console.log('🔗 Connecting to Supabase...');
    
    // Test connection
    const result = await sql`SELECT version()`;
    console.log('✅ Connected to PostgreSQL:', result[0].version);
    
    console.log('🏗️ Creating enums...');
    
    // Create enums
    await sql`CREATE TYPE "UserRole" AS ENUM ('USER', 'BUSINESS_OWNER', 'ADMIN')`;
    await sql`CREATE TYPE "BusinessCategory" AS ENUM ('RESTAURANT', 'RETAIL', 'SERVICES', 'HEALTHCARE', 'AUTOMOTIVE', 'REAL_ESTATE', 'ENTERTAINMENT', 'FITNESS', 'BEAUTY', 'EDUCATION', 'TECHNOLOGY', 'OTHER')`;
    await sql`CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED')`;
    await sql`CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'PHONE', 'EMAIL', 'REFERRAL', 'SOCIAL_MEDIA', 'BRIGHTDATA', 'OTHER')`;
    await sql`CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST')`;
    await sql`CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT')`;
    await sql`CREATE TYPE "AnalyticType" AS ENUM ('PAGE_VIEWS', 'LEAD_GENERATED', 'PHONE_CALLS', 'EMAIL_CLICKS', 'WEBSITE_CLICKS', 'PROFILE_VIEWS', 'SEARCH_APPEARANCES')`;

    console.log('📊 Creating tables...');

    // Create User table
    await sql`
      CREATE TABLE "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create Account table
    await sql`
      CREATE TABLE "Account" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create Session table
    await sql`
      CREATE TABLE "Session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create Business table
    await sql`
      CREATE TABLE "Business" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "category" "BusinessCategory" NOT NULL,
        "phone" TEXT,
        "email" TEXT,
        "website" TEXT,
        "address" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "zipCode" TEXT NOT NULL,
        "latitude" DOUBLE PRECISION,
        "longitude" DOUBLE PRECISION,
        "hours" JSONB,
        "images" TEXT[],
        "verified" BOOLEAN NOT NULL DEFAULT false,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "status" "BusinessStatus" NOT NULL DEFAULT 'ACTIVE',
        "brightDataId" TEXT,
        "lastDataSync" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "ownerId" TEXT NOT NULL,
        CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create Lead table
    await sql`
      CREATE TABLE "Lead" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "message" TEXT,
        "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE',
        "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
        "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
        "assignedAt" TIMESTAMP(3),
        "respondedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "businessId" TEXT NOT NULL,
        "userId" TEXT,
        CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create Review table
    await sql`
      CREATE TABLE "Review" (
        "id" TEXT NOT NULL,
        "rating" SMALLINT NOT NULL,
        "title" TEXT,
        "content" TEXT,
        "authorName" TEXT NOT NULL,
        "authorEmail" TEXT,
        "verified" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "businessId" TEXT NOT NULL,
        CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create Analytics table
    await sql`
      CREATE TABLE "Analytics" (
        "id" TEXT NOT NULL,
        "date" DATE NOT NULL,
        "metric" "AnalyticType" NOT NULL,
        "value" INTEGER NOT NULL,
        "metadata" JSONB,
        "businessId" TEXT,
        "userId" TEXT,
        CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
      )
    `;

    console.log('🔗 Creating indexes...');
    
    // Create unique constraints and indexes
    await sql`CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`;
    await sql`CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`;
    await sql`CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken")`;
    await sql`CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug")`;
    
    // Create indexes
    await sql`CREATE INDEX "Business_category_idx" ON "Business"("category")`;
    await sql`CREATE INDEX "Business_city_state_idx" ON "Business"("city", "state")`;
    await sql`CREATE INDEX "Business_featured_idx" ON "Business"("featured")`;
    await sql`CREATE INDEX "Lead_businessId_idx" ON "Lead"("businessId")`;
    await sql`CREATE INDEX "Lead_status_idx" ON "Lead"("status")`;

    console.log('🔗 Adding foreign key constraints...');
    
    // Add foreign key constraints
    await sql`ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`;
    await sql`ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`;
    await sql`ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT`;
    await sql`ALTER TABLE "Lead" ADD CONSTRAINT "Lead_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT`;
    await sql`ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT`;

    console.log('✅ Database schema created successfully!');
    
    // List tables to confirm
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    console.log('📋 Created tables:', tables.map(t => t.table_name).join(', '));
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
  } finally {
    await sql.end();
  }
}

createDatabase();