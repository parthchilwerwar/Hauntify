#!/usr/bin/env node
/**
 * Quick verification script to check if the app is properly configured
 */

const fs = require('fs')
const path = require('path')

console.log('🎃 Hauntify - Setup Verification\n')

let hasErrors = false

// Check .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found')
  console.log('   Run: cp .env.example .env.local')
  hasErrors = true
} else {
  console.log('✅ .env.local exists')
  
  // Check for GROQ_API_KEY
  const envContent = fs.readFileSync(envPath, 'utf-8')
  if (!envContent.includes('GROQ_API_KEY=') || envContent.match(/GROQ_API_KEY=\s*$/m)) {
    console.error('❌ GROQ_API_KEY not set in .env.local')
    console.log('   Get your key at: https://console.groq.com')
    hasErrors = true
  } else {
    console.log('✅ GROQ_API_KEY is configured')
  }
}

// Check required directories
const requiredDirs = [
  'app/api/chat',
  'app/api/geocode',
  'components/chat',
  'components/map',
  'src/server',
  'src/store',
  'src/hooks',
  'src/types',
  'src/schemas',
]

requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir)
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}/ exists`)
  } else {
    console.error(`❌ ${dir}/ not found`)
    hasErrors = true
  }
})

// Check key files
const requiredFiles = [
  'app/api/chat/route.ts',
  'app/api/geocode/route.ts',
  'src/server/groqChat.ts',
  'src/server/timeline.ts',
  'src/server/geocode.ts',
  'src/store/session.ts',
  'src/hooks/useChatStream.ts',
  'src/hooks/useMapSync.ts',
]

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`)
  } else {
    console.error(`❌ ${file} not found`)
    hasErrors = true
  }
})

console.log('\n' + '='.repeat(50))

if (hasErrors) {
  console.error('\n❌ Setup incomplete. Please fix the errors above.\n')
  process.exit(1)
} else {
  console.log('\n✅ All checks passed! Run "npm run dev" to start.\n')
  process.exit(0)
}
