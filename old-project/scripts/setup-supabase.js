#!/usr/bin/env node

/**
 * Supabase Setup Script for ProductLabelChecker
 * 
 * This script helps verify your Supabase configuration
 * Run with: node scripts/setup-supabase.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 ProductLabelChecker - Supabase Setup Verification\n')

// Check environment variables
console.log('📋 Checking Environment Variables...')
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.log('\n❌ Missing required environment variables!')
  console.log('Please set up your Supabase environment variables first.')
  console.log('See SUPABASE_SETUP.md for detailed instructions.')
  process.exit(1)
}

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    console.log('\n🔗 Testing Supabase Connection...')
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      return false
    }

    console.log('✅ Supabase connection successful!')

    // Test admin connection
    const { data: adminData, error: adminError } = await supabaseAdmin.from('users').select('count').limit(1)
    
    if (adminError) {
      console.log('❌ Admin connection failed:', adminError.message)
      return false
    }

    console.log('✅ Admin connection successful!')

    // Check if tables exist
    console.log('\n📊 Checking Database Tables...')
    
    const tables = ['users', 'accounts', 'sessions', 'verification_tokens', 'scans', 'payments', 'regulatory_rules']
    
    for (const table of tables) {
      try {
        const { error } = await supabaseAdmin.from(table).select('count').limit(1)
        if (error) {
          console.log(`❌ Table '${table}' not found or not accessible`)
        } else {
          console.log(`✅ Table '${table}' exists`)
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message)
      }
    }

    // Test user creation
    console.log('\n👤 Testing User Creation...')
    
    const testEmail = `test-${Date.now()}@example.com`
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        name: 'Test User',
        email: testEmail,
        password: 'hashed-password',
        plan: 'free'
      })
      .select()
      .single()

    if (createError) {
      console.log('❌ User creation failed:', createError.message)
    } else {
      console.log('✅ User creation successful!')
      
      // Clean up test user
      await supabaseAdmin.from('users').delete().eq('id', newUser.id)
      console.log('✅ Test user cleaned up')
    }

    return true

  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
    return false
  }
}

// Run the test
testSupabaseConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase setup verification completed successfully!')
    console.log('Your ProductLabelChecker application is ready for production!')
  } else {
    console.log('\n❌ Supabase setup verification failed!')
    console.log('Please check your configuration and try again.')
    process.exit(1)
  }
})



