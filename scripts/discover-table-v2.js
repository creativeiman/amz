#!/usr/bin/env node

/**
 * Table Discovery Script v2 for Your Supabase Project
 * 
 * This script uses Supabase's built-in functions to discover your table structure
 */

const { createClient } = require('@supabase/supabase-js')

// Your Supabase project URL and service role key
const SUPABASE_URL = 'https://ckmvevpvykdobtxxclsn.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbXZldnB2eWtkb2J0eHhjbHNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2NzU3NiwiZXhwIjoyMDc1MTQzNTc2fQ.TM_QIR9bKYCfifOODr2ZLv8CoudjNSyDZIYl9tiJjY0'

console.log('🔍 Discovering your Supabase table structure (v2)...\n')
console.log('Project URL:', SUPABASE_URL)

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function discoverTables() {
  try {
    console.log('📋 Trying different approaches to discover tables...\n')
    
    // Approach 1: Try to get tables using Supabase's built-in functions
    console.log('🔍 Approach 1: Using Supabase built-in functions...')
    
    try {
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_tables')
      
      if (tablesError) {
        console.log('❌ get_tables function not available:', tablesError.message)
      } else {
        console.log('✅ Found tables:', tables)
      }
    } catch (err) {
      console.log('❌ get_tables function error:', err.message)
    }

    // Approach 2: Try common table names
    console.log('\n🔍 Approach 2: Testing common table names...')
    
    const commonTableNames = [
      'users', 'user', 'profiles', 'profile', 'accounts', 'account',
      'auth_users', 'public_users', 'user_profiles', 'user_accounts'
    ]
    
    const foundTables = []
    
    for (const tableName of commonTableNames) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (!error) {
          foundTables.push(tableName)
          console.log(`✅ Found table: ${tableName}`)
          
          // Try to get column information by examining the data structure
          if (data && data.length > 0) {
            console.log(`   📊 Sample record structure:`)
            const sampleRecord = data[0]
            Object.keys(sampleRecord).forEach(key => {
              const value = sampleRecord[key]
              const type = typeof value
              console.log(`     - ${key}: ${type} ${value !== null ? `(${value})` : '(null)'}`)
            })
          }
        } else {
          console.log(`❌ Table ${tableName} not found or not accessible`)
        }
      } catch (err) {
        console.log(`❌ Error testing table ${tableName}:`, err.message)
      }
    }

    if (foundTables.length > 0) {
      console.log(`\n🎉 Found ${foundTables.length} accessible table(s):`)
      foundTables.forEach(table => console.log(`  - ${table}`))
      
      // Focus on the first found table
      const mainTable = foundTables[0]
      console.log(`\n🔍 Analyzing main table: ${mainTable}`)
      
      // Try to get more detailed information
      try {
        const { data: sampleData, error: sampleError } = await supabase
          .from(mainTable)
          .select('*')
          .limit(5)
        
        if (sampleError) {
          console.log('❌ Error getting sample data:', sampleError.message)
        } else {
          console.log(`✅ Retrieved ${sampleData.length} sample records`)
          
          if (sampleData.length > 0) {
            console.log('\n📊 Detailed column analysis:')
            const sampleRecord = sampleData[0]
            const columnMappings = {}
            
            Object.keys(sampleRecord).forEach(key => {
              const value = sampleRecord[key]
              const type = typeof value
              const isNull = value === null
              
              console.log(`  - ${key}: ${type} ${isNull ? '(null)' : `(${JSON.stringify(value).substring(0, 50)}${JSON.stringify(value).length > 50 ? '...' : ''})`}`)
              
              // Try to map to our expected columns
              const keyLower = key.toLowerCase()
              if (keyLower.includes('id') && !keyLower.includes('email')) {
                columnMappings.id = key
              } else if (keyLower.includes('email')) {
                columnMappings.email = key
              } else if (keyLower.includes('name') || keyLower.includes('username')) {
                columnMappings.name = key
              } else if (keyLower.includes('password') || keyLower.includes('hash') || keyLower.includes('pwd')) {
                columnMappings.password = key
              } else if (keyLower.includes('plan') || keyLower.includes('subscription') || keyLower.includes('tier') || keyLower.includes('type')) {
                columnMappings.plan = key
              } else if (keyLower.includes('created') || keyLower.includes('date_created')) {
                columnMappings.createdAt = key
              } else if (keyLower.includes('updated') || keyLower.includes('date_updated')) {
                columnMappings.updatedAt = key
              } else if (keyLower.includes('verified') || keyLower.includes('email_verified') || keyLower.includes('is_verified')) {
                columnMappings.isEmailVerified = key
              }
            })
            
            console.log('\n🎯 Detected column mappings:')
            console.log(JSON.stringify(columnMappings, null, 2))
            
            // Generate configuration code
            console.log('\n💻 Generated configuration code:')
            console.log('```typescript')
            console.log('// Add this to lib/userServiceConfig.ts')
            console.log('export const yourTableConfig: UserTableConfig = {')
            console.log(`  tableName: '${mainTable}',`)
            console.log('  columns: {')
            console.log(`    id: '${columnMappings.id || 'id'}',`)
            console.log(`    email: '${columnMappings.email || 'email'}',`)
            console.log(`    name: '${columnMappings.name || 'name'}',`)
            console.log(`    password: '${columnMappings.password || 'password'}',`)
            console.log(`    plan: '${columnMappings.plan || 'plan'}',`)
            console.log(`    createdAt: '${columnMappings.createdAt || 'created_at'}',`)
            console.log(`    updatedAt: '${columnMappings.updatedAt || 'updated_at'}',`)
            console.log(`    isEmailVerified: '${columnMappings.isEmailVerified || 'is_email_verified}'`)
            console.log('  }')
            console.log('}')
            console.log('```')
          }
        }
      } catch (err) {
        console.log('❌ Error analyzing table:', err.message)
      }
    } else {
      console.log('\n❌ No accessible tables found')
      console.log('This might mean:')
      console.log('1. Your tables have different names than expected')
      console.log('2. Row Level Security (RLS) is blocking access')
      console.log('3. The service role key doesn\'t have the right permissions')
    }

  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

// Run the discovery
discoverTables().then(() => {
  console.log('\n✅ Table structure analysis complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Review the detected column mappings above')
  console.log('2. Update lib/userServiceConfig.ts with your table configuration')
  console.log('3. Update the UserService to use your configuration')
  console.log('4. Test your configuration')
})