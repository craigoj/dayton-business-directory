# Environment Variables Setup

This document explains how to configure the required environment variables for the Dayton Business Directory project.

## Required Environment Files

### 1. `.env.local` (Next.js Application)

Create a `.env.local` file in the project root with the following variables:

```bash
# Database URL from Supabase (properly URL encoded)
DATABASE_URL="postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres"

# NextAuth configuration
NEXTAUTH_SECRET="your-32-character-secret-key-here-change-this-in-production"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# BrightData MCP Configuration (uncomment and add your values)
# BRIGHTDATA_API_TOKEN="your-brightdata-api-token-here"
# BRIGHTDATA_WEB_UNLOCKER_ZONE="mcp_unlocker"
# BRIGHTDATA_BROWSER_ZONE="mcp_browser"
```

### 2. System Environment Variables (for MCP Servers)

Set these in your system environment for Claude Desktop MCP integration:

```bash
# Supabase MCP
export SUPABASE_ACCESS_TOKEN="your-supabase-access-token"

# BrightData MCP
export BRIGHTDATA_API_TOKEN="your-brightdata-api-token"
export BRIGHTDATA_WEB_UNLOCKER_ZONE="mcp_unlocker"
export BRIGHTDATA_BROWSER_ZONE="mcp_browser"
```

## Getting API Keys and Tokens

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your database URL**:
   - Go to Settings → Database
   - Copy the connection string
   - URL encode any special characters in the password
3. **Get your project keys**:
   - Go to Settings → API
   - Copy the project URL and anon/public key
4. **Create an access token**:
   - Go to Account → Access Tokens
   - Create a new token with appropriate permissions

### BrightData Setup

1. **Sign up** at [brightdata.com](https://brightdata.com)
2. **Get your API token**:
   - Navigate to Settings → API tokens
   - Create a new token with Admin permissions
   - Copy the token securely
3. **Optional zones**:
   - Create custom Web Unlocker and Browser zones if needed
   - Use default names "mcp_unlocker" and "mcp_browser" if unsure

### NextAuth Setup

1. **Generate a secret**:
   ```bash
   openssl rand -base64 32
   ```
2. **Set your domain**:
   - For development: `http://localhost:3000`
   - For production: `https://your-domain.vercel.app`

## Environment Variable Security

### Best Practices

1. **Never commit `.env` files** to version control
2. **Use different values** for development and production
3. **Rotate secrets regularly** for security
4. **Use strong, unique passwords** for all services
5. **Limit API token permissions** to minimum required

### File Structure

```
project-root/
├── .env.local          # Next.js environment variables (gitignored)
├── .env.example        # Template file (committed to git)
├── .gitignore          # Excludes all .env* files except .env.example
└── docs/
    └── ENVIRONMENT_SETUP.md  # This file
```

### Vercel Deployment

For production deployment on Vercel:

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Navigate to Settings → Environment Variables**
4. **Add each variable** from your `.env.local` file
5. **Deploy** to apply the new environment variables

Required Vercel environment variables:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Environment Validation

### Development Check

Add this to your `next.config.ts` to validate required environment variables:

```typescript
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

### MCP Server Verification

To verify MCP environment variables are set correctly:

```bash
# Check if variables are set
echo $SUPABASE_ACCESS_TOKEN
echo $BRIGHTDATA_API_TOKEN

# Test MCP server connection
npx @supabase/mcp-server-supabase --project-ref=your-project-ref
npx @brightdata/mcp
```

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Check DATABASE_URL format and encoding
   - Verify Supabase project is active
   - Ensure password is URL encoded

2. **NextAuth errors**:
   - Verify NEXTAUTH_SECRET is set and long enough
   - Check NEXTAUTH_URL matches your deployment URL
   - Ensure no trailing slashes in URLs

3. **MCP server errors**:
   - Confirm system environment variables are set
   - Restart Claude Desktop after setting variables
   - Check API token permissions and expiration

### Getting Help

- **Supabase issues**: Check [Supabase documentation](https://supabase.com/docs)
- **Vercel deployment**: Review [Vercel environment variables guide](https://vercel.com/docs/environment-variables)
- **NextAuth problems**: See [NextAuth.js documentation](https://next-auth.js.org/)
- **BrightData MCP**: Refer to [BrightData MCP documentation](https://docs.brightdata.com/api-reference/MCP-Server)

## Example `.env.local` Template

```bash
# Copy this template and replace with your actual values

# Database (from Supabase)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"

# Authentication
NEXTAUTH_SECRET="your-32-character-secret-generated-with-openssl"
NEXTAUTH_URL="http://localhost:3000"  # or your production URL

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-from-api-settings"

# BrightData (optional, for MCP integration)
# BRIGHTDATA_API_TOKEN="your-brightdata-api-token"
# BRIGHTDATA_WEB_UNLOCKER_ZONE="mcp_unlocker"
# BRIGHTDATA_BROWSER_ZONE="mcp_browser"
```

Save this as `.env.local` in your project root and update the values with your actual credentials.