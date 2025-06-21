#!/usr/bin/env node

/**
 * BrightData Business Directory Demo Script
 * 
 * This script demonstrates how to use BrightData API for business directory
 * enhancement use cases like competitor research and data enrichment.
 */

const https = require('https');

const API_TOKEN = 'b93a34f9-0a3b-4b97-8e51-d6c90a427d33';
const WEB_UNLOCKER_ZONE = 'web_unlocker1';

console.log('🚀 BrightData Business Directory Demo\n');

// Helper function to make BrightData API requests
async function brightDataRequest(url, options = {}) {
  const data = JSON.stringify({
    zone: WEB_UNLOCKER_ZONE,
    url: url,
    format: 'raw',
    ...options
  });

  const requestOptions = {
    hostname: 'api.brightdata.com',
    path: '/request',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve(responseData);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Demo 1: Basic Website Content Extraction
async function demoWebsiteExtraction() {
  console.log('📄 Demo 1: Website Content Extraction');
  console.log('Extracting content from a sample business website...\n');
  
  try {
    const response = await brightDataRequest('https://example.com');
    const contentLength = response.length;
    const hasTitle = response.toLowerCase().includes('<title>');
    
    console.log(`✅ Successfully extracted ${contentLength} characters`);
    console.log(`📝 Contains HTML title: ${hasTitle ? 'Yes' : 'No'}`);
    
    if (hasTitle) {
      const titleMatch = response.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        console.log(`🏷️  Page title: "${titleMatch[1]}"`);
      }
    }
    
    console.log('💡 Use case: Extract business name, description, and contact info from websites\n');
    
  } catch (error) {
    console.log('❌ Website extraction failed:', error.message);
  }
}

// Demo 2: Geolocation and Proxy Information
async function demoGeolocation() {
  console.log('🌍 Demo 2: Geolocation and Proxy Testing');
  console.log('Testing different geographic locations for local business research...\n');
  
  try {
    // Test US location (default)
    const usResponse = await brightDataRequest('https://geo.brdtest.com/mygeo.json');
    const usData = JSON.parse(usResponse);
    
    console.log('📍 US Proxy Location:');
    console.log(`   Country: ${usData.country}`);
    console.log(`   Region: ${usData.geo.region_name || usData.geo.region}`);
    console.log(`   City: ${usData.geo.city || 'Unknown'}`);
    console.log(`   Timezone: ${usData.geo.tz}`);
    
    // Test with specific country targeting
    const ukResponse = await brightDataRequest('https://geo.brdtest.com/mygeo.json', {
      country: 'gb'
    });
    const ukData = JSON.parse(ukResponse);
    
    console.log('\n📍 UK Proxy Location:');
    console.log(`   Country: ${ukData.country}`);
    console.log(`   Region: ${ukData.geo.region_name || ukData.geo.region}`);
    console.log(`   City: ${ukData.geo.city || 'Unknown'}`);
    
    console.log('\n💡 Use case: Research competitors in different geographic markets\n');
    
  } catch (error) {
    console.log('❌ Geolocation test failed:', error.message);
  }
}

// Demo 3: HTTP Headers and User Agent Testing
async function demoUserAgents() {
  console.log('🕵️  Demo 3: User Agent and Device Simulation');
  console.log('Testing different user agents for comprehensive data collection...\n');
  
  try {
    // Test mobile user agent
    const mobileResponse = await brightDataRequest('https://httpbin.org/headers', {
      ua: 'mobile'
    });
    
    console.log('📱 Mobile User Agent Response:');
    const mobileData = JSON.parse(mobileResponse);
    const userAgent = mobileData.headers['User-Agent'];
    console.log(`   User-Agent: ${userAgent}`);
    console.log(`   Is Mobile: ${userAgent.toLowerCase().includes('mobile') ? 'Yes' : 'No'}`);
    
    // Test desktop user agent (default)
    const desktopResponse = await brightDataRequest('https://httpbin.org/headers');
    const desktopData = JSON.parse(desktopResponse);
    const desktopUA = desktopData.headers['User-Agent'];
    
    console.log('\n🖥️  Desktop User Agent Response:');
    console.log(`   User-Agent: ${desktopUA}`);
    
    console.log('\n💡 Use case: Collect mobile vs desktop business listing data\n');
    
  } catch (error) {
    console.log('❌ User agent test failed:', error.message);
  }
}

// Demo 4: Business Directory Research Simulation
async function demoBusinessResearch() {
  console.log('🏢 Demo 4: Business Directory Research Simulation');
  console.log('Simulating competitor research and data collection...\n');
  
  try {
    // Simulate searching for a business directory
    console.log('🔍 Simulating business directory homepage analysis...');
    
    const response = await brightDataRequest('https://httpbin.org/json');
    
    console.log('✅ Successfully retrieved structured data');
    console.log('📊 Data format: JSON');
    
    // Parse the response to show data structure
    try {
      const jsonData = JSON.parse(response);
      console.log('🏗️  Response structure:');
      Object.keys(jsonData).forEach(key => {
        console.log(`   - ${key}: ${typeof jsonData[key]}`);
      });
    } catch (e) {
      console.log('📝 Raw response received (not JSON)');
    }
    
    console.log('\n💡 Real-world applications:');
    console.log('   • Extract competitor business listings');
    console.log('   • Monitor pricing and features');
    console.log('   • Analyze market positioning');
    console.log('   • Collect contact information');
    console.log('   • Track review scores and ratings\n');
    
  } catch (error) {
    console.log('❌ Business research simulation failed:', error.message);
  }
}

// Demo 5: Rate Limiting and Best Practices
function demoBestPractices() {
  console.log('⚡ Demo 5: Rate Limiting and Best Practices');
  console.log('Configuration and usage recommendations...\n');
  
  console.log('🎛️  Current Configuration:');
  console.log(`   API Token: ${API_TOKEN.substring(0, 8)}...${API_TOKEN.substring(-8)}`);
  console.log(`   Web Unlocker Zone: ${WEB_UNLOCKER_ZONE}`);
  console.log('   Rate Limit: 100 requests/hour (configured in MCP)');
  
  console.log('\n📏 Rate Limiting Best Practices:');
  console.log('   • Start with conservative limits (100/hour)');
  console.log('   • Monitor usage through BrightData dashboard');
  console.log('   • Cache results to reduce API calls');
  console.log('   • Use specific zones for different use cases');
  console.log('   • Implement exponential backoff for retries');
  
  console.log('\n🔒 Security Best Practices:');
  console.log('   • Never expose API tokens in client-side code');
  console.log('   • Use environment variables for configuration');
  console.log('   • Rotate API tokens regularly');
  console.log('   • Monitor for unauthorized usage');
  console.log('   • Validate and sanitize scraped content');
  
  console.log('\n📈 Performance Optimization:');
  console.log('   • Target specific data rather than full pages');
  console.log('   • Use structured data endpoints when available');
  console.log('   • Implement request queuing for bulk operations');
  console.log('   • Consider using Browser API for dynamic content');
  
  console.log('\n');
}

// Main demo runner
async function runDemo() {
  console.log('Starting comprehensive BrightData demonstration...\n');
  
  try {
    await demoWebsiteExtraction();
    await demoGeolocation();
    await demoUserAgents();
    await demoBusinessResearch();
    demoBestPractices();
    
    console.log('🎉 BrightData Demo Complete!');
    console.log('\n🚀 Ready to integrate with Claude Desktop MCP!');
    console.log('\nNext steps:');
    console.log('1. Set up environment variables in your system');
    console.log('2. Copy MCP configuration to Claude Desktop');
    console.log('3. Restart Claude Desktop');
    console.log('4. Start using BrightData tools for business directory enhancement');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Run the demo
runDemo();