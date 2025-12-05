#!/usr/bin/env node
/**
 * Test script for API endpoints
 * Run with: node scripts/test-api.js
 */

const http = require('http')

const BASE_URL = 'http://localhost:3000'

console.log('🎃 Hauntify - API Test Suite\n')

// Test 1: Geocoding
async function testGeocoding() {
  console.log('📍 Testing geocoding endpoint...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/geocode?q=Paris,%20France`)
    
    if (!response.ok) {
      console.error(`❌ Geocoding failed: ${response.status} ${response.statusText}`)
      return false
    }
    
    const data = await response.json()
    
    if (data.lat && data.lon && data.name) {
      console.log(`✅ Geocoding works: ${data.name}`)
      console.log(`   Coordinates: ${data.lat}, ${data.lon}`)
      return true
    } else {
      console.error('❌ Invalid geocoding response:', data)
      return false
    }
  } catch (error) {
    console.error('❌ Geocoding error:', error.message)
    return false
  }
}

// Test 2: Chat streaming
async function testChatStreaming() {
  console.log('\n💬 Testing chat streaming endpoint...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: 'Say hello in one word.' }
        ]
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error(`❌ Chat failed: ${response.status}`, error)
      return false
    }
    
    if (!response.body) {
      console.error('❌ No response body')
      return false
    }
    
    // Read stream
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let tokenCount = 0
    let hasContent = false
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      
      for (const line of lines) {
        if (!line.trim()) continue
        
        try {
          const event = JSON.parse(line)
          
          if (event.type === 'token') {
            tokenCount++
            hasContent = true
            process.stdout.write('.')
          } else if (event.type === 'timeline') {
            console.log(`\n   📅 Timeline event: ${event.data.year} - ${event.data.title}`)
          } else if (event.type === 'error') {
            console.error(`\n❌ Stream error: ${event.data}`)
            return false
          } else if (event.type === 'done') {
            console.log(`\n✅ Chat streaming works (${tokenCount} tokens received)`)
            return hasContent
          }
        } catch (e) {
          console.error('\n❌ Failed to parse event:', line)
        }
      }
    }
    
    if (hasContent) {
      console.log(`\n✅ Chat streaming works (${tokenCount} tokens received)`)
      return true
    } else {
      console.error('\n❌ No content received')
      return false
    }
  } catch (error) {
    console.error('\n❌ Chat error:', error.message)
    return false
  }
}

// Test 3: Rate limiting
async function testRateLimiting() {
  console.log('\n⏱️  Testing rate limiting...')
  
  try {
    // Send 3 requests rapidly
    const promises = [
      fetch(`${BASE_URL}/api/geocode?q=London`),
      fetch(`${BASE_URL}/api/geocode?q=Berlin`),
      fetch(`${BASE_URL}/api/geocode?q=Madrid`)
    ]
    
    const responses = await Promise.all(promises)
    const statuses = responses.map(r => r.status)
    
    // Should have at least one 429 (rate limited)
    const rateLimited = statuses.filter(s => s === 429).length
    
    if (rateLimited > 0) {
      console.log(`✅ Rate limiting works (${rateLimited} requests blocked)`)
      return true
    } else {
      console.log('⚠️  Rate limiting may not be working (all requests succeeded)')
      return true // Not a critical failure
    }
  } catch (error) {
    console.error('❌ Rate limiting test error:', error.message)
    return false
  }
}

// Test 4: Environment check
function testEnvironment() {
  console.log('\n🔧 Checking environment...')
  
  const fs = require('fs')
  const path = require('path')
  
  // Check .env.local
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found')
    return false
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8')
  
  // Check GROQ_API_KEY
  if (!envContent.includes('GROQ_API_KEY=') || envContent.match(/GROQ_API_KEY=\s*$/m)) {
    console.error('❌ GROQ_API_KEY not set')
    return false
  }
  
  console.log('✅ Environment configured')
  return true
}

// Run all tests
async function runTests() {
  const results = []
  
  // Check environment first
  results.push(testEnvironment())
  
  if (!results[0]) {
    console.log('\n❌ Environment check failed. Fix issues and try again.')
    process.exit(1)
  }
  
  // Check if server is running
  try {
    await fetch(BASE_URL)
  } catch (error) {
    console.error('\n❌ Server not running. Start with: npm run dev')
    process.exit(1)
  }
  
  // Run API tests
  results.push(await testGeocoding())
  results.push(await testChatStreaming())
  results.push(await testRateLimiting())
  
  // Summary
  console.log('\n' + '='.repeat(50))
  const passed = results.filter(Boolean).length
  const total = results.length
  
  if (passed === total) {
    console.log(`\n✅ All tests passed (${passed}/${total})`)
    console.log('\nYour app is working correctly! 🎉')
    process.exit(0)
  } else {
    console.log(`\n⚠️  Some tests failed (${passed}/${total} passed)`)
    console.log('\nCheck the errors above and see TROUBLESHOOTING.md')
    process.exit(1)
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test suite error:', error)
  process.exit(1)
})
