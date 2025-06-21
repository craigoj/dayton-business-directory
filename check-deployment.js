#!/usr/bin/env node

const https = require('https');

const URL = 'https://dayton-business-directory.vercel.app';

function checkDeployment() {
  return new Promise((resolve, reject) => {
    const req = https.get(URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          hasContent: data.length > 0,
          contentLength: data.length
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function main() {
  console.log('🔍 Checking deployment status...');
  console.log(`URL: ${URL}`);
  console.log('');
  
  try {
    const result = await checkDeployment();
    
    console.log('✅ Deployment Status:');
    console.log(`  Status Code: ${result.statusCode}`);
    console.log(`  Content Length: ${result.contentLength} bytes`);
    console.log(`  Has Content: ${result.hasContent}`);
    
    if (result.statusCode === 200) {
      console.log('');
      console.log('🎉 SUCCESS: Your site is live and working!');
      console.log(`🌐 Visit: ${URL}`);
      console.log(`📱 Demo: ${URL}/demo/business-cards`);
    } else {
      console.log('');
      console.log(`⚠️  WARNING: Status code ${result.statusCode}`);
      console.log('The deployment may still be in progress...');
    }
    
  } catch (error) {
    console.log('❌ ERROR:');
    console.log(`  ${error.message}`);
    console.log('');
    console.log('💡 Possible reasons:');
    console.log('  - Deployment still in progress');
    console.log('  - DNS not yet propagated');
    console.log('  - Build errors in Vercel');
    console.log('');
    console.log('🔧 Next steps:');
    console.log('  1. Check Vercel dashboard for build logs');
    console.log('  2. Wait a few more minutes for deployment');
    console.log('  3. Verify environment variables are set');
  }
}

main();