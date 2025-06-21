#!/usr/bin/env node

// Quick script to create database tables using our MCP server
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function createTables() {
  try {
    console.log('🏗️  Creating database tables...');
    
    // Run the MCP server and trigger table creation
    const { stdout, stderr } = await execAsync('echo \'{"method":"tools/call","params":{"name":"create_tables","arguments":{"force":true}}}\' | node /home/craigj/dayton-best/local-business-directory/mcp-server/src/index.js');
    
    console.log('Output:', stdout);
    if (stderr) console.error('Errors:', stderr);
    
  } catch (error) {
    console.error('Failed to create tables:', error.message);
  }
}

createTables();