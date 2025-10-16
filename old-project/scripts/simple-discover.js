#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://ckmvevpvykdobtxxclsn.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbXZldnB2eWtkb2J0eHhjbHNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2NzU3NiwiZXhwIjoyMDc1MTQzNTc2fQ.TM_QIR9bKYCfifOODr2ZLv8CoudjNSyDZIYl9tiJjY0'

console.log('🔍 Discovering your Supabase table structure...\n')

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function discoverTables() {
  try {
    console.log('📋 Testing common table names...\n')
    
    const commonTableNames = [
      'users', 'user', 'profiles', 'profile', 'accounts', 'account',
      'auth_users', 'public_users', 'user_profiles', 'user_accounts'
    ]
    
    const foundTables = []
    
    for (const tableName of commonTableNames) {
      try {
        console.log(`Testing table: ${tableName}`)
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (!error) {
          foundTables.push(tableName)
          console.log(`✅ Found table: ${tableName}`)
          
          if (data && data.length > 0) {
            console.log(`   📊 Sample record structure:`)
            const sampleRecord = data[0]
            Object.keys(sampleRecord).forEach(key => {
              const value = sampleRecord[key]
              const type = typeof value
              const displayValue = value !== null ? JSON.stringify(value).substring(0, 50) : 'null'
              console.log(`     - ${key}: ${type} (${displayValue})`)
            })
          }
        } else {
          console.log(`❌ Table ${tableName} not found`)
        }
      } catch (err) {
        console.log(`❌ Error testing table ${tableName}: ${err.message}`)
      }
    }

    if (foundTables.length > 0) {
      console.log(`\n🎉 Found ${foundTables.length} accessible table(s):`)
      foundTables.forEach(table => console.log(`  - ${table}`))
      
      const mainTable = foundTables[0]
      console.log(`\n🔍 Analyzing main table: ${mainTable}`)
      
      try {
        const { data: sampleData, error: sampleError } = await supabase
          .from(mainTable)
          .select('*')
          .limit(3)
        
        if (sampleError) {
          console.log('❌ Error getting sample data:', sampleError.message)
        } else {
          console.log(`✅ Retrieved ${sampleData.length} sample records`)
          
          if (sampleData.length > 0) {
            console.log('\n📊 Column analysis:')
            const sampleRecord = sampleData[0]
            const columnMappings = {}
            
            Object.keys(sampleRecord).forEach(key => {
              const value = sampleRecord[key]
              const type = typeof value
              console.log(`  - ${key}: ${type}`)
              
              const keyLower = key.toLowerCase()
              if (keyLower.includes('id') && !keyLower.includes('email')) {
                columnMappings.id = key
              } else if (keyLower.includes('email')) {
                columnMappings.email = key
              } else if (keyLower.includes('name') || keyLower.includes('username')) {
                columnMappings.name = key
              } else if (keyLower.includes('password') || keyLower.includes('hash') || keyLower.includes('pwd')) {
                columnMappings.password = key
              } else if (keyLower.includes('plan') || keyLower.includes('subscription') || keyLower.includes('tier')) {
                columnMappings.plan = key
              } else if (keyLower.includes('created') || keyLower.includes('date_created')) {
                columnMappings.createdAt = key
              } else if (keyLower.includes('updated') || keyLower.includes('date_updated')) {
                columnMappings.updatedAt = key
              } else if (keyLower.includes('verified') || keyLower.includes('email_verified')) {
                columnMappings.isEmailVerified = key
              }
            })
            
            console.log('\n🎯 Detected column mappings:')
            console.log(JSON.stringify(columnMappings, null, 2))
            
            console.log('\n💻 Configuration code:')
            console.log('```typescript')
            console.log('export const yourTableConfig: UserTableConfig = {')
            console.log('  tableName: \'' + mainTable + '\',')
            console.log('  columns: {')
            console.log('    id: \'' + (columnMappings.id || 'id') + '\',')
            console.log('    email: \'' + (columnMappings.email || 'email') + '\',')
            console.log('    name: \'' + (columnMappings.name || 'name') + '\',')
            console.log('    password: \'' + (columnMappings.password || 'password') + '\',')
            console.log('    plan: \'' + (columnMappings.plan || 'plan') + '\',')
            console.log('    createdAt: \'' + (columnMappings.createdAt || 'created_at') + '\',')
            console.log('    updatedAt: \'' + (columnMappings.updatedAt || 'updated_at') + '\',')
            console.log('    isEmailVerified: \'' + (columnMappings.isEmailVerified || 'is_email_verified') + '\'')
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
    }

  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

discoverTables().then(() => {
  console.log('\n✅ Analysis complete!')
})



