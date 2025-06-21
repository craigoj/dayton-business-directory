#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

// Environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://smzyjsypuknmiwzcrsni.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

class SupabaseMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'supabase-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Supabase client
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      console.error('Supabase REST client initialized');
    }

    // Try to initialize direct PostgreSQL connection as fallback
    if (DATABASE_URL) {
      try {
        this.sql = postgres(DATABASE_URL, { 
          ssl: 'require',
          connect_timeout: 5,
          idle_timeout: 20
        });
        console.error('Direct PostgreSQL connection initialized');
      } catch (error) {
        console.error('Direct PostgreSQL connection failed:', error.message);
        this.sql = null;
      }
    }

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_tables',
          description: 'Create all database tables for Dayton Business Directory',
          inputSchema: {
            type: 'object',
            properties: {
              force: {
                type: 'boolean',
                description: 'Force recreation of tables (drops existing)',
                default: false,
              },
            },
          },
        },
        {
          name: 'get_schema',
          description: 'Get the SQL schema for creating tables',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'list_tables',
          description: 'List all tables in the database',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'execute_sql',
          description: 'Execute SQL queries on the database',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'SQL query to execute',
              },
            },
            required: ['query'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_tables':
            return await this.createTables(args.force);

          case 'list_tables':
            return await this.listTables();

          case 'execute_sql':
            return await this.executeSql(args.query);

          case 'get_schema':
            return await this.getSchema();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async createTables(force = false) {
    // Try Supabase client first, then direct SQL
    if (this.supabase) {
      return await this.createTablesWithSupabase(force);
    } else if (this.sql) {
      return await this.createTablesWithPostgres(force);
    } else {
      return await this.getSchema();
    }
  }

  async createTablesWithSupabase(force = false) {
    try {
      // Test connection
      const { data: testData, error: testError } = await this.supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);
      
      if (testError) {
        throw new Error(`Supabase connection failed: ${testError.message}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: '✅ Supabase connection successful! Please use the SQL Editor to create tables manually with the schema from get_schema tool.',
          },
        ],
      };
    } catch (error) {
      throw new Error(`Supabase table creation failed: ${error.message}`);
    }
  }

  async createTablesWithPostgres(force = false) {
    if (!this.sql) {
      throw new Error('PostgreSQL connection not available');
    }

    try {
      // Test connection first
      await this.sql`SELECT 1`;
      
      if (force) {
        console.error('Dropping existing tables...');
        // Drop tables in reverse order due to foreign keys
        await this.sql`DROP TABLE IF EXISTS "Analytics" CASCADE`;
        await this.sql`DROP TABLE IF EXISTS "Review" CASCADE`;
        await this.sql`DROP TABLE IF EXISTS "Lead" CASCADE`;
        await this.sql`DROP TABLE IF EXISTS "Business" CASCADE`;
        await this.sql`DROP TABLE IF EXISTS "VerificationToken" CASCADE`;
        await this.sql`DROP TABLE IF EXISTS "User" CASCADE`;
        await this.sql`DROP TABLE IF EXISTS "Session" CASCADE`;
        await this.sql`DROP TABLE IF EXISTS "Account" CASCADE`;
        
        // Drop enums
        await this.sql`DROP TYPE IF EXISTS "AnalyticType" CASCADE`;
        await this.sql`DROP TYPE IF EXISTS "Priority" CASCADE`;
        await this.sql`DROP TYPE IF EXISTS "LeadStatus" CASCADE`;
        await this.sql`DROP TYPE IF EXISTS "LeadSource" CASCADE`;
        await this.sql`DROP TYPE IF EXISTS "BusinessStatus" CASCADE`;
        await this.sql`DROP TYPE IF EXISTS "BusinessCategory" CASCADE`;
        await this.sql`DROP TYPE IF EXISTS "UserRole" CASCADE`;
      }

      console.error('Creating enums...');
      // Create enums
      await this.sql`CREATE TYPE "UserRole" AS ENUM ('USER', 'BUSINESS_OWNER', 'ADMIN')`;
      await this.sql`CREATE TYPE "BusinessCategory" AS ENUM ('RESTAURANT', 'RETAIL', 'SERVICES', 'HEALTHCARE', 'AUTOMOTIVE', 'REAL_ESTATE', 'ENTERTAINMENT', 'FITNESS', 'BEAUTY', 'EDUCATION', 'TECHNOLOGY', 'OTHER')`;
      await this.sql`CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED')`;
      await this.sql`CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'PHONE', 'EMAIL', 'REFERRAL', 'SOCIAL_MEDIA', 'BRIGHTDATA', 'OTHER')`;
      await this.sql`CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST')`;
      await this.sql`CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT')`;
      await this.sql`CREATE TYPE "AnalyticType" AS ENUM ('PAGE_VIEWS', 'LEAD_GENERATED', 'PHONE_CALLS', 'EMAIL_CLICKS', 'WEBSITE_CLICKS', 'PROFILE_VIEWS', 'SEARCH_APPEARANCES')`;

      console.error('Creating tables...');
      // Create tables
      await this.sql`
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

      await this.sql`
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

      await this.sql`
        CREATE TABLE "Session" (
          "id" TEXT NOT NULL,
          "sessionToken" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "expires" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
        )
      `;

      await this.sql`
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

      await this.sql`
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

      await this.sql`
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

      await this.sql`
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

      console.error('Creating indexes and constraints...');
      // Create unique constraints and indexes
      await this.sql`CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`;
      await this.sql`CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`;
      await this.sql`CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken")`;
      await this.sql`CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug")`;
      
      // Create indexes
      await this.sql`CREATE INDEX "Business_category_idx" ON "Business"("category")`;
      await this.sql`CREATE INDEX "Business_city_state_idx" ON "Business"("city", "state")`;
      await this.sql`CREATE INDEX "Business_featured_idx" ON "Business"("featured")`;
      await this.sql`CREATE INDEX "Lead_businessId_idx" ON "Lead"("businessId")`;
      await this.sql`CREATE INDEX "Lead_status_idx" ON "Lead"("status")`;

      // Add foreign key constraints
      await this.sql`ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`;
      await this.sql`ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE`;
      await this.sql`ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT`;
      await this.sql`ALTER TABLE "Lead" ADD CONSTRAINT "Lead_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT`;
      await this.sql`ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT`;

      return {
        content: [
          {
            type: 'text',
            text: '✅ Database tables created successfully! All tables, indexes, and constraints have been set up for your Dayton Business Directory.',
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create tables: ${error.message}`);
    }
  }

  async listTables() {
    // Try Supabase client first, then direct SQL
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase.rpc('list_tables');
        if (error) {
          // Fallback to manual query if RPC not available
          return {
            content: [
              {
                type: 'text',
                text: 'Supabase connected but cannot list tables directly. Use Supabase dashboard to view tables.',
              },
            ],
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: `Database tables:\n${data.map(t => `- ${t.table_name}`).join('\n')}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Supabase table listing error: ${error.message}`,
            },
          ],
        };
      }
    }

    if (!this.sql) {
      throw new Error('No database connection available');
    }

    try {
      const tables = await this.sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `;

      return {
        content: [
          {
            type: 'text',
            text: `Database tables:\n${tables.map(t => `- ${t.table_name}`).join('\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list tables: ${error.message}`);
    }
  }

  async executeSql(query) {
    // Try direct SQL first
    if (this.sql) {
      try {
        const result = await this.sql.unsafe(query);
        return {
          content: [
            {
              type: 'text',
              text: `SQL executed successfully. Rows affected: ${result.length}\n\nResult: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Direct SQL execution failed: ${error.message}\nTry using Supabase SQL Editor instead.`,
            },
          ],
        };
      }
    }

    if (!this.supabase) {
      throw new Error('No database connection available');
    }

    return {
      content: [
        {
          type: 'text',
          text: `SQL execution not available via REST API. Use Supabase SQL Editor:\n${SUPABASE_URL}/project/sql`,
        },
      ],
    };
  }

  async getSchema() {
    const schema = `-- Dayton Business Directory Database Schema
-- Run this SQL in your Supabase SQL Editor

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

-- Create indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");
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
ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT;`;

    return {
      content: [
        {
          type: 'text',
          text: `Database Schema for Dayton Business Directory:\n\n${schema}\n\n💡 Copy this SQL to your Supabase SQL Editor:\n${SUPABASE_URL}/project/sql`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('✅ Supabase MCP server running on stdio');
  }
}

// Run the server
const server = new SupabaseMCPServer();
server.run().catch(console.error);