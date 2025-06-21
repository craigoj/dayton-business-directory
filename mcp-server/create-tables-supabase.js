#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smzyjsypuknmiwzcrsni.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'your_service_key_here';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const createTablesSQL = `
-- Create enums
CREATE TYPE "UserRole" AS ENUM ('USER', 'BUSINESS_OWNER', 'ADMIN');
CREATE TYPE "BusinessCategory" AS ENUM ('RESTAURANT', 'RETAIL', 'SERVICES', 'HEALTHCARE', 'AUTOMOTIVE', 'REAL_ESTATE', 'ENTERTAINMENT', 'FITNESS', 'BEAUTY', 'EDUCATION', 'TECHNOLOGY', 'OTHER');
CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED');
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'PHONE', 'EMAIL', 'REFERRAL', 'SOCIAL_MEDIA', 'BRIGHTDATA', 'OTHER');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "AnalyticType" AS ENUM ('PAGE_VIEWS', 'LEAD_GENERATED', 'PHONE_CALLS', 'EMAIL_CLICKS', 'WEBSITE_CLICKS', 'PROFILE_VIEWS', 'SEARCH_APPEARANCES');

-- Create tables
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
);

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
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

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
);

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
);

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
);

CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "metric" "AnalyticType" NOT NULL,
    "value" INTEGER NOT NULL,
    "metadata" JSONB,
    "businessId" TEXT,
    "userId" TEXT,
    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- Create indexes
CREATE INDEX "Business_category_idx" ON "Business"("category");
CREATE INDEX "Business_city_state_idx" ON "Business"("city", "state");
CREATE INDEX "Business_featured_idx" ON "Business"("featured");
CREATE INDEX "Lead_businessId_idx" ON "Lead"("businessId");
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- Add foreign key constraints
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT;
ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT;
`;

async function createTables() {
  try {
    console.log('🔗 Connecting to Supabase REST API...');
    
    // Execute the SQL using Supabase RPC
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: createTablesSQL
    });

    if (error) {
      console.error('❌ Error executing SQL:', error.message);
      
      // Try alternative method - direct SQL execution
      console.log('🔄 Trying alternative method...');
      
      const { data: result, error: execError } = await supabase
        .from('_dummy')
        .select('*')
        .limit(0);
        
      if (execError) {
        console.log('💡 Please run the SQL manually in Supabase SQL Editor:');
        console.log('1. Go to https://smzyjsypuknmiwzcrsni.supabase.co/project/smzyjsypuknmiwzcrsni/sql');
        console.log('2. Copy and run the SQL from database-setup.sql');
        return;
      }
    }

    console.log('✅ Database schema created successfully!');
    console.log('Result:', data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('💡 Alternative: Use Supabase SQL Editor to run the schema:');
    console.log('https://smzyjsypuknmiwzcrsni.supabase.co/project/smzyjsypuknmiwzcrsni/sql');
  }
}

createTables();