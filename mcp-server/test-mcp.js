#!/usr/bin/env node

import { spawn } from 'child_process';

// Test MCP server tools
async function testMCPTools() {
  console.log('🧪 Testing Supabase MCP Server Tools...\n');

  const tests = [
    {
      name: 'List Tools',
      request: {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list'
      }
    },
    {
      name: 'Get Schema',
      request: {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'get_schema',
          arguments: {}
        }
      }
    },
    {
      name: 'List Tables',
      request: {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'list_tables',
          arguments: {}
        }
      }
    }
  ];

  for (const test of tests) {
    console.log(`\n🔧 Running test: ${test.name}`);
    console.log('-'.repeat(40));
    
    try {
      const result = await runMCPTest(test.request);
      console.log('✅ Success:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
}

function runMCPTest(request) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['src/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        SUPABASE_URL: 'https://smzyjsypuknmiwzcrsni.supabase.co',
        SUPABASE_SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtenlqc3lwdWtubWl3emNyc25pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNDQ5NzE4MSwiZXhwIjoyMDIwMDczMTgxfQ.placeholder',
        DATABASE_URL: 'postgresql://postgres:r3K%262KW6Getmoney1@db.smzyjsypuknmiwzcrsni.supabase.co:5432/postgres'
      }
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0 || output) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          resolve({ output, errorOutput });
        }
      } else {
        reject(new Error(`Process exited with code ${code}: ${errorOutput}`));
      }
    });

    // Send the request
    child.stdin.write(JSON.stringify(request) + '\n');
    child.stdin.end();

    // Timeout after 10 seconds
    setTimeout(() => {
      child.kill();
      reject(new Error('Test timeout'));
    }, 10000);
  });
}

testMCPTools().catch(console.error);