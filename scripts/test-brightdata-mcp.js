#!/usr/bin/env node

/**
 * BrightData MCP Server Test Script
 * 
 * This script tests the BrightData API connection and MCP server functionality
 * to ensure everything is configured correctly.
 */

const https = require('https');

const API_TOKEN = 'b93a34f9-0a3b-4b97-8e51-d6c90a427d33';
const WEB_UNLOCKER_ZONE = 'web_unlocker1';
const BROWSER_ZONE = 'scraping_browser1';

console.log('🧪 Testing BrightData MCP Configuration...\n');

// Test 1: Basic API Connection
async function testAPIConnection() {
  console.log('1. Testing BrightData API Connection...');
  
  const data = JSON.stringify({
    zone: WEB_UNLOCKER_ZONE,
    url: 'https://geo.brdtest.com/mygeo.json',
    format: 'raw'
  });

  const options = {
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
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          console.log('   ✅ API Connection: SUCCESS');
          console.log(`   📍 Location: ${result.country}, ${result.geo.city || 'Unknown City'}`);
          console.log(`   🌐 IP Version: IPv${result.ip_version}`);
          resolve(result);
        } catch (error) {
          console.log('   ❌ API Connection: FAILED - Invalid JSON response');
          console.log(`   📝 Response: ${responseData}`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ API Connection: FAILED');
      console.log(`   📝 Error: ${error.message}`);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Test 2: Web Scraping Test
async function testWebScraping() {
  console.log('\n2. Testing Web Scraping Functionality...');
  
  const data = JSON.stringify({
    zone: WEB_UNLOCKER_ZONE,
    url: 'https://httpbin.org/json',
    format: 'raw'
  });

  const options = {
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
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          if (result.slideshow) {
            console.log('   ✅ Web Scraping: SUCCESS');
            console.log('   📄 Successfully retrieved JSON data from httpbin.org');
          } else {
            console.log('   ⚠️  Web Scraping: Partial Success - Different response format');
          }
          resolve(result);
        } catch (error) {
          console.log('   ❌ Web Scraping: FAILED');
          console.log(`   📝 Response: ${responseData.substring(0, 200)}...`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Web Scraping: FAILED');
      console.log(`   📝 Error: ${error.message}`);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Test 3: MCP Package Check
async function testMCPPackage() {
  console.log('\n3. Testing BrightData MCP Package...');
  
  const { spawn } = require('child_process');
  
  return new Promise((resolve) => {
    const npmView = spawn('npm', ['view', '@brightdata/mcp', 'version'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    npmView.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    npmView.on('close', (code) => {
      if (code === 0 && output.trim()) {
        console.log('   ✅ MCP Package: Available');
        console.log(`   📦 Version: ${output.trim()}`);
        resolve(true);
      } else {
        console.log('   ❌ MCP Package: Not Found');
        resolve(false);
      }
    });
    
    npmView.on('error', () => {
      console.log('   ❌ MCP Package: Error checking package');
      resolve(false);
    });
  });
}

// Test 4: Configuration Validation
function testConfiguration() {
  console.log('\n4. Validating Configuration...');
  
  const checks = [
    { name: 'API Token', value: API_TOKEN, check: (v) => v && v.length > 30 },
    { name: 'Web Unlocker Zone', value: WEB_UNLOCKER_ZONE, check: (v) => v && v.includes('unlocker') },
    { name: 'Browser Zone', value: BROWSER_ZONE, check: (v) => v && v.includes('browser') }
  ];
  
  let allValid = true;
  
  checks.forEach(({ name, value, check }) => {
    if (check(value)) {
      console.log(`   ✅ ${name}: Valid`);
    } else {
      console.log(`   ❌ ${name}: Invalid (${value || 'Not Set'})`);
      allValid = false;
    }
  });
  
  return allValid;
}

// Main test runner
async function runTests() {
  try {
    // Configuration validation
    const configValid = testConfiguration();
    
    if (!configValid) {
      console.log('\n❌ Configuration validation failed. Please check your settings.');
      process.exit(1);
    }
    
    // API tests
    await testAPIConnection();
    await testWebScraping();
    await testMCPPackage();
    
    console.log('\n🎉 BrightData MCP Configuration Test Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Copy mcp-server/claude_desktop_config.json to your Claude Desktop config directory');
    console.log('2. Set environment variables:');
    console.log(`   export API_TOKEN="${API_TOKEN}"`);
    console.log(`   export WEB_UNLOCKER_ZONE="${WEB_UNLOCKER_ZONE}"`);
    console.log(`   export BROWSER_ZONE="${BROWSER_ZONE}"`);
    console.log('3. Restart Claude Desktop');
    console.log('4. Look for BrightData tools in Claude Desktop');
    
    console.log('\n🔧 MCP Server Command:');
    console.log('npx @brightdata/mcp');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();