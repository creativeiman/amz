#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://ckmvevpvykdobtxxclsn.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbXZldnB2eWtkb2J0eHhjbHNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2NzU3NiwiZXhwIjoyMDc1MTQzNTc2fQ.TM_QIR9bKYCfifOODr2ZLv8CoudjNSyDZIYl9tiJjY0'

console.log('🔍 Analyzing your users table structure...\n')

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function analyzeUsersTable() {
  try {
    console.log('📋 Testing different column combinations...\n')
    
    // Test 1: Try to insert a test record with common column names
    console.log('🧪 Test 1: Inserting test record with common columns...')
    
    const testData = {
      id: 'test-id-' + Date.now(),
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed-password',
      plan: 'free',
      created_at: new Date().toISOString(),
      is_email_verified: false
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testData)
      .select()
    
    if (insertError) {
      console.log('❌ Insert error:', insertError.message)
      console.log('This tells us about the table structure!')
      
      // Try to extract column information from the error
      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('\n🔍 Column analysis from error:')
        console.log('The error suggests some columns don\'t exist')
      }
    } else {
      console.log('✅ Test record inserted successfully!')
      console.log('📊 Inserted record:', insertData)
      
      // Clean up test record
      await supabase.from('users').delete().eq('id', testData.id)
      console.log('✅ Test record cleaned up')
    }
    
    // Test 2: Try different column name variations
    console.log('\n🧪 Test 2: Testing different column name variations...')
    
    const columnVariations = [
      { id: 'id', email: 'email', name: 'name', password: 'password' },
      { id: 'user_id', email: 'email_address', name: 'full_name', password: 'password_hash' },
      { id: 'uuid', email: 'email', name: 'username', password: 'hashed_password' },
      { id: 'id', email: 'email', name: 'display_name', password: 'pwd' }
    ]
    
    for (let i = 0; i < columnVariations.length; i++) {
      const variation = columnVariations[i]
      console.log(`\n  Testing variation ${i + 1}:`, variation)
      
      const testRecord = {
        [variation.id]: 'test-' + Date.now(),
        [variation.email]: 'test' + i + '@example.com',
        [variation.name]: 'Test User ' + i,
        [variation.password]: 'hashed-password'
      }
      
      const { error: testError } = await supabase
        .from('users')
        .insert(testRecord)
      
      if (!testError) {
        console.log(`  ✅ Variation ${i + 1} worked! Columns:`, Object.keys(testRecord))
        
        // Clean up
        await supabase.from('users').delete().eq(variation.id, testRecord[variation.id])
        break
      } else {
        console.log(`  ❌ Variation ${i + 1} failed:`, testError.message.substring(0, 100) + '...')
      }
    }
    
    // Test 3: Try to get table schema using a different approach
    console.log('\n🧪 Test 3: Trying to get table schema...')
    
    try {
      // Try to select with a wildcard to see what columns exist
      const { data: schemaData, error: schemaError } = await supabase
        .from('users')
        .select('*')
        .limit(0)
      
      if (schemaError) {
        console.log('❌ Schema query error:', schemaError.message)
      } else {
        console.log('✅ Schema query successful')
        console.log('📊 Available columns:', Object.keys(schemaData[0] || {}))
      }
    } catch (err) {
      console.log('❌ Schema query failed:', err.message)
    }
    
    // Test 4: Try to insert with minimal required fields
    console.log('\n🧪 Test 4: Testing minimal required fields...')
    
    const minimalTests = [
      { email: 'minimal1@example.com' },
      { id: 'minimal-id-1', email: 'minimal2@example.com' },
      { email: 'minimal3@example.com', name: 'Minimal User' },
      { email: 'minimal4@example.com', created_at: new Date().toISOString() }
    ]
    
    for (let i = 0; i < minimalTests.length; i++) {
      const test = minimalTests[i]
      console.log(`  Testing minimal ${i + 1}:`, test)
      
      const { error: minError } = await supabase
        .from('users')
        .insert(test)
      
      if (!minError) {
        console.log(`  ✅ Minimal test ${i + 1} worked!`)
        
        // Clean up
        if (test.id) {
          await supabase.from('users').delete().eq('id', test.id)
        } else {
          await supabase.from('users').delete().eq('email', test.email)
        }
        break
      } else {
        console.log(`  ❌ Minimal test ${i + 1} failed:`, minError.message.substring(0, 100) + '...')
      }
    }

  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

analyzeUsersTable().then(() => {
  console.log('\n✅ Analysis complete!')
  console.log('\n📝 Based on the tests above, we can determine:')
  console.log('1. Which columns exist in your users table')
  console.log('2. Which columns are required vs optional')
  console.log('3. The correct column names to use in our configuration')
})



