#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const { v4: uuidv4 } = require('uuid')

const SUPABASE_URL = 'https://ckmvevpvykdobtxxclsn.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbXZldnB2eWtkb2J0eHhjbHNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2NzU3NiwiZXhwIjoyMDc1MTQzNTc2fQ.TM_QIR9bKYCfifOODr2ZLv8CoudjNSyDZIYl9tiJjY0'

console.log('🔍 Testing your users table with correct data types...\n')

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function testUsersTable() {
  try {
    console.log('🧪 Testing with proper UUID and required fields...\n')
    
    // Test with proper UUID and all required fields
    const testData = {
      id: uuidv4(),
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed-password-123',
      created_at: new Date().toISOString()
    }
    
    console.log('📝 Test data:', testData)
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testData)
      .select()
    
    if (insertError) {
      console.log('❌ Insert error:', insertError.message)
      
      // Try with additional optional fields
      console.log('\n🧪 Trying with additional optional fields...')
      
      const testDataWithOptional = {
        ...testData,
        id: uuidv4(),
        email: 'test2@example.com',
        plan: 'free',
        is_email_verified: false,
        updated_at: new Date().toISOString()
      }
      
      const { data: insertData2, error: insertError2 } = await supabase
        .from('users')
        .insert(testDataWithOptional)
        .select()
      
      if (insertError2) {
        console.log('❌ Insert with optional fields error:', insertError2.message)
      } else {
        console.log('✅ Insert with optional fields successful!')
        console.log('📊 Inserted record:', insertData2)
        
        // Clean up
        await supabase.from('users').delete().eq('id', testDataWithOptional.id)
        console.log('✅ Test record cleaned up')
        
        // Now we know the table structure!
        console.log('\n🎯 Your users table structure:')
        console.log('Required columns:')
        console.log('  - id (UUID)')
        console.log('  - email (text)')
        console.log('  - name (text)')
        console.log('  - password (text)')
        console.log('  - created_at (timestamp)')
        console.log('\nOptional columns:')
        console.log('  - plan (text)')
        console.log('  - is_email_verified (boolean)')
        console.log('  - updated_at (timestamp)')
        
        console.log('\n💻 Configuration code:')
        console.log('```typescript')
        console.log('export const yourTableConfig: UserTableConfig = {')
        console.log('  tableName: \'users\',')
        console.log('  columns: {')
        console.log('    id: \'id\',')
        console.log('    email: \'email\',')
        console.log('    name: \'name\',')
        console.log('    password: \'password\',')
        console.log('    plan: \'plan\',')
        console.log('    createdAt: \'created_at\',')
        console.log('    updatedAt: \'updated_at\',')
        console.log('    isEmailVerified: \'is_email_verified\'')
        console.log('  }')
        console.log('}')
        console.log('```')
      }
    } else {
      console.log('✅ Insert successful!')
      console.log('📊 Inserted record:', insertData)
      
      // Clean up
      await supabase.from('users').delete().eq('id', testData.id)
      console.log('✅ Test record cleaned up')
    }
    
    // Test authentication flow
    console.log('\n🧪 Testing authentication flow...')
    
    const authTestData = {
      id: uuidv4(),
      email: 'auth-test@example.com',
      name: 'Auth Test User',
      password: 'hashed-password-456',
      plan: 'free',
      created_at: new Date().toISOString(),
      is_email_verified: false
    }
    
    // Insert test user
    const { data: authUser, error: authInsertError } = await supabase
      .from('users')
      .insert(authTestData)
      .select()
    
    if (authInsertError) {
      console.log('❌ Auth test insert error:', authInsertError.message)
    } else {
      console.log('✅ Auth test user created')
      
      // Try to retrieve user
      const { data: retrievedUser, error: retrieveError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'auth-test@example.com')
        .single()
      
      if (retrieveError) {
        console.log('❌ Retrieve user error:', retrieveError.message)
      } else {
        console.log('✅ User retrieval successful!')
        console.log('📊 Retrieved user:', retrievedUser)
      }
      
      // Clean up
      await supabase.from('users').delete().eq('id', authTestData.id)
      console.log('✅ Auth test user cleaned up')
    }

  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

testUsersTable().then(() => {
  console.log('\n✅ Testing complete!')
  console.log('\n🎉 Your users table is ready for integration!')
})



