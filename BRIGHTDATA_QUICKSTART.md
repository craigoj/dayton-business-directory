# BrightData MCP Quick Start Guide

Your BrightData MCP server is now configured and ready to use! 🎉

## ✅ What's Configured

- **API Token**: `b93a34f9-0a3b-4b97-8e51-d6c90a427d33` ✓
- **Web Unlocker Zone**: `web_unlocker1` ✓  
- **Browser Zone**: `scraping_browser1` ✓
- **Rate Limit**: 100 requests per hour ✓

## 🚀 Activate in Claude Desktop

### Step 1: Set Environment Variables
```bash
export API_TOKEN="b93a34f9-0a3b-4b97-8e51-d6c90a427d33"
export WEB_UNLOCKER_ZONE="web_unlocker1"
export BROWSER_ZONE="scraping_browser1"
```

### Step 2: Copy MCP Configuration
```bash
# macOS
cp mcp-server/claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Windows  
copy mcp-server/claude_desktop_config.json %APPDATA%\Claude\claude_desktop_config.json

# Linux
cp mcp-server/claude_desktop_config.json ~/.config/claude/claude_desktop_config.json
```

### Step 3: Restart Claude Desktop
Close and reopen Claude Desktop to load the new configuration.

## 🧪 Test the Integration

### In Claude Desktop, try these commands:

**Basic Web Scraping:**
```
Use BrightData to scrape the title and description from https://brightdata.com
```

**Business Research:**
```
Search Google for "business directory software" and extract the top 5 results with titles and descriptions
```

**Local Business Discovery:**
```
Use BrightData to visit a local business website and extract their contact information and services
```

## 🛠️ Available Tools

Once configured, you'll have access to 50+ BrightData tools including:

- **Web Scraping**: Extract content from any website
- **Search Engines**: Google, Bing, Yandex search results
- **E-commerce**: Amazon, eBay, Walmart product data  
- **Social Media**: LinkedIn, Instagram, Facebook data
- **Browser Automation**: Navigate, click, type, screenshot
- **Business Data**: Company profiles, reviews, contact info

## 🎯 Business Directory Use Cases

**Competitor Analysis:**
```
Use BrightData to research competing business directories and extract their pricing models and featured categories
```

**Data Enrichment:**
```
For the business "Downtown Dayton Diner", use BrightData to find their website, extract their menu, hours, and recent reviews
```

**Market Research:**
```
Search for "restaurants Dayton Ohio" on Google and extract the top 10 business listings with ratings and contact information
```

## 🔍 Verify Setup

Run the test script to verify everything is working:
```bash
node scripts/test-brightdata-mcp.js
```

Expected output should show all green checkmarks ✅

## 📚 Documentation

- **Full Setup Guide**: `docs/BRIGHTDATA_MCP_SETUP.md`
- **Integration Examples**: `docs/BRIGHTDATA_INTEGRATION_EXAMPLES.md`  
- **Environment Setup**: `docs/ENVIRONMENT_SETUP.md`
- **MCP Server Info**: `mcp-server/README.md`

## 🆘 Troubleshooting

**MCP tools not appearing in Claude Desktop?**
1. Verify environment variables are set in your system (not just .env files)
2. Check that Claude Desktop config file is in the correct location
3. Restart Claude Desktop completely
4. Check Node.js version (requires 18+)

**API errors?**
1. Verify API token is correct
2. Check rate limits in BrightData dashboard
3. Ensure zones `web_unlocker1` and `scraping_browser1` exist

**Need help?** Check the detailed documentation in the `docs/` folder or run the test script for diagnostics.

---

🎉 **You're all set!** Start using BrightData with Claude Desktop to enhance your business directory with real-time web data!