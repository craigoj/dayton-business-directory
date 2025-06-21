#!/usr/bin/env node

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:r3K%262KW6Getmoney1@db.smzyjsypuknmiwzcrsni.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTables() {
  try {
    console.log('🔗 Connecting to Supabase...');
    await client.connect();
    
    // Test connection
    const version = await client.query('SELECT version()');
    console.log('✅ Connected to PostgreSQL:', version.rows[0].version.substring(0, 50) + '...');

    console.log('🏗️ Creating enums...');
    
    // Create enums
    await client.query(`CREATE TYPE "UserRole" AS ENUM ('USER', 'BUSINESS_OWNER', 'ADMIN')`);
    await client.query(`CREATE TYPE "BusinessCategory" AS ENUM ('RESTAURANT', 'RETAIL', 'SERVICES', 'HEALTHCARE', 'AUTOMOTIVE', 'REAL_ESTATE', 'ENTERTAINMENT', 'FITNESS', 'BEAUTY', 'EDUCATION', 'TECHNOLOGY', 'OTHER')`);
    await client.query(`CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED')`);
    await client.query(`CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'PHONE', 'EMAIL', 'REFERRAL', 'SOCIAL_MEDIA', 'BRIGHTDATA', 'OTHER')`);
    await client.query(`CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST')`);
    await client.query(`CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
    await client.query(`CREATE TYPE "AnalyticType" AS ENUM ('PAGE_VIEWS', 'LEAD_GENERATED', 'PHONE_CALLS', 'EMAIL_CLICKS', 'WEBSITE_CLICKS', 'PROFILE_VIEWS', 'SEARCH_APPEARANCES')`);

    console.log('📊 Creating User table...');
    await client.query(`
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
    `);

    console.log('📊 Creating Account table...');
    await client.query(`
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
    `);

    console.log('📊 Creating Session table...');
    await client.query(`
      CREATE TABLE "Session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
      )
    `);

    console.log('📊 Creating Business table...');
    await client.query(`
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
    `);

    console.log('📊 Creating Lead table...');
    await client.query(`
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
    `);

    console.log('📊 Creating Review table...');
    await client.query(`
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
    `);

    console.log('📊 Creating Analytics table...');
    await client.query(`
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
    `);

    console.log('🔗 Creating indexes...');
    await client.query(`CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`);
    await client.query(`CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`);
    await client.query(`CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken")`);
    await client.query(`CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug")`);
    await client.query(`CREATE INDEX "Business_category_idx" ON "Business"("category")`);
    await client.query(`CREATE INDEX "Business_city_state_idx" ON "Business"("city", "state")`);
    await client.query(`CREATE INDEX "Business_featured_idx" ON "Business"("featured")`);
    await client.query(`CREATE INDEX "Lead_businessId_idx" ON "Lead"("businessId")`);
    await client.query(`CREATE INDEX "Lead_status_idx" ON "Lead"("status")`);

    console.log('🔗 Adding foreign key constraints...');
    await client.query(`ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`);
    await client.query(`ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`);
    await client.query(`ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT`);
    await client.query(`ALTER TABLE "Lead" ADD CONSTRAINT "Lead_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT`);
    await client.query(`ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT`);

    console.log('✅ Database schema created successfully!');
    
    // List tables to confirm
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('📋 Created tables:', tables.rows.map(t => t.table_name).join(', '));
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await client.end();
  }
}

createTables();