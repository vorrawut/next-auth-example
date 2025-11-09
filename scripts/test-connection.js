#!/usr/bin/env node

/**
 * Test script to verify Keycloak connection
 * Run with: node scripts/test-connection.js
 */

const https = require('https');
const http = require('http');
const { readFileSync } = require('fs');
const { join } = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          env[key.trim()] = value;
        }
      }
    });
    
    return env;
  } catch (error) {
    log('✗ Could not read .env.local file', 'red');
    return null;
  }
}

async function testConnection(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          success: res.statusCode === 200,
          statusCode: res.statusCode,
          data: data,
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message,
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Connection timeout',
      });
    });
  });
}

async function main() {
  log('\n🔍 Testing Keycloak Connection...\n', 'blue');
  
  const env = loadEnv();
  if (!env) {
    process.exit(1);
  }
  
  const issuer = env.KEYCLOAK_ISSUER;
  if (!issuer) {
    log('✗ KEYCLOAK_ISSUER not found in .env.local', 'red');
    process.exit(1);
  }
  
  log(`Testing Keycloak at: ${issuer}\n`, 'blue');
  
  // Test 1: OpenID Configuration (most reliable test)
  log('1. Testing OpenID Connect configuration...', 'yellow');
  const configUrl = `${issuer}/.well-known/openid-configuration`;
  const configResult = await testConnection(configUrl);
  let realmExists = false;
  if (configResult.success) {
    try {
      const config = JSON.parse(configResult.data);
      log('   ✓ OpenID Connect configuration is accessible', 'green');
      log(`   ✓ Authorization endpoint: ${config.authorization_endpoint}`, 'green');
      log(`   ✓ Token endpoint: ${config.token_endpoint}`, 'green');
      realmExists = true;
    } catch (e) {
      log('   ✗ Invalid JSON response', 'red');
    }
  } else {
    log(`   ✗ Failed to fetch OpenID config: ${configResult.error || configResult.statusCode}`, 'red');
    log('   → The realm "next" does not exist yet', 'yellow');
    log('   → Follow these steps:', 'yellow');
    log('     1. Open http://localhost:8080 (admin/admin)', 'yellow');
    log('     2. Create a new realm named "next"', 'yellow');
    log('     3. See keycloak-setup.md for detailed instructions', 'yellow');
  }
  
  // Test 2: Check if Keycloak base is accessible (302 redirect is OK)
  log('\n2. Testing Keycloak base URL...', 'yellow');
  const baseUrl = issuer.replace('/realms/next', '');
  const baseResult = await testConnection(baseUrl);
  // 302 redirect is normal for Keycloak (redirects to login)
  if (baseResult.success || baseResult.statusCode === 302) {
    log('   ✓ Keycloak is accessible', 'green');
  } else {
    log(`   ⚠ Keycloak base URL returned: ${baseResult.error || baseResult.statusCode}`, 'yellow');
    log('   → This is usually OK if OpenID config works', 'yellow');
  }
  
  // Test 3: Health endpoint (optional, may not be available in all Keycloak versions)
  log('\n3. Testing Keycloak health endpoint...', 'yellow');
  const healthUrl = `${baseUrl}/health/ready`;
  const healthResult = await testConnection(healthUrl);
  if (healthResult.success) {
    log('   ✓ Keycloak health endpoint is accessible', 'green');
  } else {
    // Health endpoint might not be available, but if OpenID works, Keycloak is fine
    if (realmExists) {
      log('   ⚠ Health endpoint not available (this is OK)', 'yellow');
    } else {
      log(`   ✗ Health check failed: ${healthResult.error || healthResult.statusCode}`, 'red');
    }
  }
  
  // Test 4: Verify environment variables
  log('\n4. Verifying environment variables...', 'yellow');
  const required = ['KEYCLOAK_CLIENT_ID', 'KEYCLOAK_CLIENT_SECRET', 'NEXTAUTH_SECRET'];
  let allPresent = true;
  
  required.forEach(key => {
    if (env[key] && env[key] !== 'your-secret') {
      log(`   ✓ ${key} is set`, 'green');
    } else {
      log(`   ✗ ${key} is missing or has placeholder value`, 'red');
      allPresent = false;
    }
  });
  
  // Summary
  log('\n' + '='.repeat(50), 'blue');
  // Keycloak is running if OpenID config is accessible (most reliable indicator)
  const keycloakRunning = realmExists || configResult.success;
  
  if (keycloakRunning && allPresent) {
    log('\n✅ All tests passed! Your setup looks good.', 'green');
    log('\n🎉 Everything is configured correctly!', 'green');
    log('\nNext steps:', 'blue');
    log('1. Start your Next.js app: npm run dev', 'yellow');
    log('2. Open http://localhost:3000', 'yellow');
    log('3. Click "Login with Keycloak" to test authentication', 'yellow');
  } else {
    log('\n📋 Setup Status:', 'blue');
    
    // Keycloak status - if OpenID config works, Keycloak is definitely running
    if (realmExists) {
      log('   ✓ Keycloak is running', 'green');
      log('   ✓ Realm "next" exists', 'green');
    } else {
      log('   ✗ Realm "next" does not exist', 'red');
      log('   → Create it in Keycloak admin console', 'yellow');
      log('   → See keycloak-setup.md for instructions', 'yellow');
    }
    
    if (!allPresent) {
      log('   ✗ Some environment variables need to be updated', 'red');
    } else {
      log('   ✓ Environment variables are set', 'green');
    }
    
    if (!realmExists || !allPresent) {
      log('\n⚠️  Please fix the issues above and run the test again.', 'yellow');
      process.exit(1);
    }
  }
  log('='.repeat(50) + '\n', 'blue');
}

main().catch(error => {
  log(`\n✗ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});

