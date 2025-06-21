#!/usr/bin/env node

import { spawn } from 'child_process';

const ACCESS_TOKEN = 'sbp_9d59fa5c0e9a5aa220e4dbef592ea8f095654395';
const PROJECT_REF = 'smzyjsypuknmiwzcrsni';

async function executeSql(query, description) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 ${description}...`);
    
    const child = spawn('npx', [
      '-y', '@supabase/mcp-server-supabase@latest',
      '--project-ref=' + PROJECT_REF,
      '--access-token=' + ACCESS_TOKEN
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} completed`);
        resolve(output);
      } else {
        console.log(`❌ ${description} failed: ${error}`);
        reject(new Error(error || `Process exited with code ${code}`));
      }
    });

    // Send the SQL request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'execute_sql',
        arguments: { query }
      }
    };

    child.stdin.write(JSON.stringify(request) + '\n');
    child.stdin.end();
  });
}

async function createDatabase() {
  try {
    console.log('🏗️ Creating Dayton Business Directory Database Schema\n');

    // Create enums
    await executeSql(`CREATE TYPE "UserRole" AS ENUM ('USER', 'BUSINESS_OWNER', 'ADMIN')`, 'Creating UserRole enum');
    await executeSql(`CREATE TYPE "BusinessCategory" AS ENUM ('RESTAURANT', 'RETAIL', 'SERVICES', 'HEALTHCARE', 'AUTOMOTIVE', 'REAL_ESTATE', 'ENTERTAINMENT', 'FITNESS', 'BEAUTY', 'EDUCATION', 'TECHNOLOGY', 'OTHER')`, 'Creating BusinessCategory enum');
    await executeSql(`CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED')`, 'Creating BusinessStatus enum');
    await executeSql(`CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'PHONE', 'EMAIL', 'REFERRAL', 'SOCIAL_MEDIA', 'BRIGHTDATA', 'OTHER')`, 'Creating LeadSource enum');
    await executeSql(`CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST')`, 'Creating LeadStatus enum');
    await executeSql(`CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT')`, 'Creating Priority enum');
    await executeSql(`CREATE TYPE "AnalyticType" AS ENUM ('PAGE_VIEWS', 'LEAD_GENERATED', 'PHONE_CALLS', 'EMAIL_CLICKS', 'WEBSITE_CLICKS', 'PROFILE_VIEWS', 'SEARCH_APPEARANCES')`, 'Creating AnalyticType enum');

    // Create tables
    await executeSql(`
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
    `, 'Creating User table');

    await executeSql(`
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
    `, 'Creating Account table');

    await executeSql(`
      CREATE TABLE "Session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
      )
    `, 'Creating Session table');

    await executeSql(`
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
    `, 'Creating Business table');

    await executeSql(`
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
    `, 'Creating Lead table');

    await executeSql(`
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
    `, 'Creating Review table');

    await executeSql(`
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
    `, 'Creating Analytics table');

    // Create indexes
    console.log('\n📊 Creating indexes...');
    await executeSql(`CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`, 'Creating User email index');
    await executeSql(`CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`, 'Creating Account provider index');
    await executeSql(`CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken")`, 'Creating Session token index');
    await executeSql(`CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug")`, 'Creating Business slug index');
    await executeSql(`CREATE INDEX "Business_category_idx" ON "Business"("category")`, 'Creating Business category index');
    await executeSql(`CREATE INDEX "Business_city_state_idx" ON "Business"("city", "state")`, 'Creating Business location index');
    await executeSql(`CREATE INDEX "Business_featured_idx" ON "Business"("featured")`, 'Creating Business featured index');
    await executeSql(`CREATE INDEX "Lead_businessId_idx" ON "Lead"("businessId")`, 'Creating Lead business index');
    await executeSql(`CREATE INDEX "Lead_status_idx" ON "Lead"("status")`, 'Creating Lead status index');

    // Create foreign key constraints
    console.log('\n🔗 Creating foreign key constraints...');
    await executeSql(`ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`, 'Creating Account-User constraint');
    await executeSql(`ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`, 'Creating Session-User constraint');
    await executeSql(`ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT`, 'Creating Business-User constraint');
    await executeSql(`ALTER TABLE "Lead" ADD CONSTRAINT "Lead_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT`, 'Creating Lead-Business constraint');
    await executeSql(`ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT`, 'Creating Review-Business constraint');

    console.log('\n✅ Database schema created successfully!');
    console.log('🎉 Your Dayton Business Directory database is ready!');

  } catch (error) {
    console.error('\n❌ Error creating database:', error.message);
  }
}

createDatabase();