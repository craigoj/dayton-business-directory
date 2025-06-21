# MCP Server Configuration

This directory contains the Model Context Protocol (MCP) server configuration for the Dayton Business Directory project.

## Overview

MCP servers enable AI assistants like Claude Desktop to access external tools and data sources. This configuration includes:

- **Supabase MCP Server** - Database access and management
- **BrightData MCP Server** - Web scraping and data collection

## Configuration File

The `claude_desktop_config.json` file contains the MCP server configurations that Claude Desktop uses to connect to external services.

### Current Servers

#### 1. Supabase MCP Server
- **Purpose**: Direct database access for business data management
- **Package**: `@supabase/mcp-server-supabase`
- **Project**: `smzyjsypuknmiwzcrsni`

#### 2. BrightData MCP Server
- **Purpose**: Web scraping and real-time data collection
- **Package**: `@brightdata/mcp`
- **Rate Limit**: 100 requests per hour

## Setup Instructions

### Prerequisites
1. Claude Desktop installed
2. Node.js 18+ installed
3. Required API tokens and credentials

### Environment Variables

The MCP servers use environment variables for authentication. These should be set in your system environment, not in the project's `.env.local` file:

```bash
# Supabase (already configured)
SUPABASE_ACCESS_TOKEN="your-supabase-token"

# BrightData (add these to your system environment)
BRIGHTDATA_API_TOKEN="your-brightdata-api-token"
BRIGHTDATA_WEB_UNLOCKER_ZONE="mcp_unlocker"
BRIGHTDATA_BROWSER_ZONE="mcp_browser"
```

### Installing MCP Servers

1. **Copy the configuration file** to your Claude Desktop config directory:
   ```bash
   # macOS
   cp claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
   
   # Windows
   copy claude_desktop_config.json %APPDATA%\Claude\claude_desktop_config.json
   
   # Linux
   cp claude_desktop_config.json ~/.config/claude/claude_desktop_config.json
   ```

2. **Set environment variables** in your system:
   ```bash
   # Add to your shell profile (.bashrc, .zshrc, etc.)
   export BRIGHTDATA_API_TOKEN="your-actual-token-here"
   export BRIGHTDATA_WEB_UNLOCKER_ZONE="mcp_unlocker"
   export BRIGHTDATA_BROWSER_ZONE="mcp_browser"
   ```

3. **Restart Claude Desktop** to load the new configuration.

## Usage

Once configured, you can use the MCP servers directly in Claude Desktop:

### Supabase Commands
```
Show me all businesses in the database
Create a new business listing for [business details]
Update the contact information for business ID 123
```

### BrightData Commands
```
Search Google for "restaurants Dayton Ohio" and extract the top 10 results
Scrape the website https://example-business.com and extract contact information
Get LinkedIn company profile for "Tech Company Name"
```

## Troubleshooting

### Common Issues

1. **MCP server not found**
   - Ensure Node.js 18+ is installed
   - Check that the package names are correct in the config
   - Verify internet connection for npx downloads

2. **Authentication errors**
   - Double-check API tokens are correct
   - Ensure environment variables are set properly
   - Restart Claude Desktop after setting environment variables

3. **Rate limiting**
   - BrightData has a default limit of 100 requests/hour
   - Adjust the `RATE_LIMIT` setting if needed
   - Monitor usage through the BrightData dashboard

### Verification

To verify MCP servers are working:

1. **Open Claude Desktop**
2. **Look for available tools** - You should see functions from both servers
3. **Test a simple command**:
   ```
   List the available MCP tools
   ```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit API tokens** to version control
2. **Use environment variables** for all sensitive configuration
3. **Regularly rotate API tokens** for security
4. **Monitor usage** to detect unauthorized access
5. **Follow rate limits** to avoid service disruption

## Configuration Reference

### Full Configuration Structure
```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["package-name", "...args"],
      "env": {
        "VARIABLE_NAME": "${ENVIRONMENT_VARIABLE}"
      }
    }
  }
}
```

### Environment Variable Substitution
- Use `${VARIABLE_NAME}` syntax for environment variable substitution
- Claude Desktop will replace these with actual environment variable values
- Variables must be set in the system environment, not project files

## Documentation Links

- [Supabase MCP Server](https://github.com/supabase-community/mcp-server-supabase)
- [BrightData MCP Server](https://github.com/brightdata/brightdata-mcp)
- [Claude Desktop MCP Guide](https://claude.ai/mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)

## Support

For issues with:
- **Supabase MCP**: Check the Supabase community forums
- **BrightData MCP**: Refer to BrightData documentation and support
- **Claude Desktop**: Contact Anthropic support
- **This Configuration**: Create an issue in the project repository