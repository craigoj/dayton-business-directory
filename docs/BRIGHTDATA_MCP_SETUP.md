# BrightData MCP Server Setup Guide

This guide explains how to set up and use the BrightData MCP (Model Context Protocol) server with your local development environment.

## Overview

The BrightData MCP server provides AI agents with real-time, reliable access to public web data. It enables:

- **Real-time web access** - Get up-to-date information directly from the web
- **Bypass geo-restrictions** - Access content regardless of location constraints  
- **Web unlocker** - Navigate websites with bot detection protection
- **Browser automation** - Optional remote browser control capabilities
- **Seamless integration** - Works with all MCP-compatible AI assistants

## Prerequisites

1. **Node.js** (version 18 or higher)
2. **BrightData account** - Sign up at [brightdata.com](https://brightdata.com)
3. **API token** with Admin permissions from BrightData dashboard
4. **Claude Desktop** or other MCP-compatible AI assistant

## Getting Your BrightData API Token

1. Log in to your BrightData account
2. Navigate to **Settings** → **API tokens**
3. Create a new API token with **Admin permissions**
4. Copy the token (keep it secure!)

## Environment Variables Setup

Add the following environment variables to your `.env.local` file:

```bash
# BrightData MCP Configuration
BRIGHTDATA_API_TOKEN="your-brightdata-api-token-here"
BRIGHTDATA_WEB_UNLOCKER_ZONE="mcp_unlocker"  # Optional: defaults to mcp_unlocker
BRIGHTDATA_BROWSER_ZONE="mcp_browser"        # Optional: defaults to mcp_browser
```

## Claude Desktop Configuration

The BrightData MCP server has been added to your Claude Desktop configuration at:
`mcp-server/claude_desktop_config.json`

Configuration details:
```json
{
  "mcpServers": {
    "brightdata": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "${BRIGHTDATA_API_TOKEN}",
        "WEB_UNLOCKER_ZONE": "${BRIGHTDATA_WEB_UNLOCKER_ZONE}",
        "BROWSER_ZONE": "${BRIGHTDATA_BROWSER_ZONE}",
        "RATE_LIMIT": "100/1h"
      }
    }
  }
}
```

## Available Tools

The BrightData MCP server provides numerous tools for web data extraction:

### Search & Scraping Tools
- `search_engine` - Scrape search results from Google, Bing, or Yandex
- `scrape_as_markdown` - Extract webpage content in Markdown format
- `scrape_as_html` - Extract webpage content in HTML format

### E-commerce Data
- **Amazon**: product data, reviews, search results
- **Walmart**: product and seller data
- **eBay**: product listings
- **Home Depot**: product information
- **Best Buy**: product details
- **Etsy**: product data
- **Zara**: product information

### Social Media Data
- **LinkedIn**: profiles, company data, job listings, posts
- **Instagram**: profiles, posts, reels, comments
- **Facebook**: posts, marketplace, reviews, events
- **X (Twitter)**: posts and engagement data
- **TikTok**: profiles, posts, shop data, comments

### Real Estate & Travel
- **Zillow**: property listings and data
- **Booking**: hotel listings and availability

### Tech & Business Data
- **GitHub**: repository files and metadata
- **Crunchbase**: company information
- **Google Play Store**: app data
- **Apple App Store**: app information
- **Yahoo Finance**: business and financial data

### News & Content
- **Reuters**: news articles
- **YouTube**: videos, profiles, comments
- **Reddit**: posts and discussions

### Browser Interaction Tools
- `navigate` - Navigate to URLs
- `click` - Click on page elements
- `type` - Enter text into form fields
- `screenshot` - Capture page screenshots
- `get_links` - Extract all links from a page
- `wait_for` - Wait for page elements to load
- `go_back` / `go_forward` - Browser navigation

## Usage Examples

### Basic Web Scraping
```
Extract the main content from https://example.com as markdown
```

### Business Data Collection
```
Get LinkedIn company profile data for a tech startup
```

### Market Research
```
Search for "electric vehicles" on Google and extract the top 10 results
```

### Competitor Analysis
```
Extract product information from Amazon for keyword "wireless headphones"
```

## Rate Limiting

The configuration includes a rate limit of `100/1h` (100 requests per hour). You can adjust this based on your BrightData plan:

- `100/1h` - 100 requests per hour
- `50/30m` - 50 requests per 30 minutes  
- `10/5s` - 10 requests per 5 seconds

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Treat scraped content as untrusted** - Never use raw scraped content directly in LLM prompts
2. **Filter and validate web data** - Always sanitize extracted information
3. **Use structured extraction** - Prefer structured data formats over raw HTML
4. **Keep API tokens secure** - Never commit tokens to version control

## Troubleshooting

### Common Issues

1. **MCP server not starting**
   - Ensure Node.js 18+ is installed
   - Verify API token is correct and has Admin permissions
   - Check environment variables are properly set

2. **Rate limit exceeded**
   - Reduce request frequency
   - Adjust `RATE_LIMIT` configuration
   - Upgrade BrightData plan if needed

3. **Timeout errors**
   - Set agent timeout to 180 seconds for complex requests
   - Some websites may take longer to respond

### Getting Help

- Check the [BrightData MCP GitHub repository](https://github.com/brightdata/brightdata-mcp)
- Review [BrightData documentation](https://docs.brightdata.com/api-reference/MCP-Server)
- Contact BrightData support for API-related issues

## Testing the Setup

Once configured, you can test the BrightData MCP server by:

1. Restart Claude Desktop
2. Look for BrightData tools in the available functions
3. Try a simple scraping request:
   ```
   Use BrightData to scrape the title and description from https://brightdata.com
   ```

## Integration with Business Directory

The BrightData MCP server can enhance your business directory application by:

- **Competitor analysis** - Scrape competitor business listings
- **Data enrichment** - Enhance business profiles with web data
- **Market research** - Gather industry insights and trends
- **Lead generation** - Extract business contact information
- **Review monitoring** - Track business reviews across platforms

## Cost Considerations

BrightData operates on a usage-based pricing model. Monitor your usage through the BrightData dashboard to optimize costs:

- Use caching when possible
- Target specific data rather than full page scrapes
- Set appropriate rate limits
- Consider using structured data tools over general scraping

---

For more information, visit the [BrightData MCP Server documentation](https://docs.brightdata.com/api-reference/MCP-Server).