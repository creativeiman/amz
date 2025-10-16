#!/usr/bin/env node

/**
 * Table Discovery Script for Your Supabase Project
 * 
 * This script will help us discover your existing table structure
 * so we can configure the UserService to work with it.
 * 
 * Run with: node scripts/discover-table.js
 */

const { createClient } = require('@supabase/supabase-js')

// Your Supabase project URL
const SUPABASE_URL = 'https://ckmvevpvykdobtxxclsn.supabase.co'

console.log('🔍 Discovering your Supabase table structure...\n')
console.log('Project URL:', SUPABASE_URL)

// You'll need to provide your service role key
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.log('❌ Please set your SUPABASE_SERVICE_ROLE_KEY environment variable')
  console.log('You can find this in your Supabase dashboard under Settings > API')
  console.log('Then run: SUPABASE_SERVICE_ROLE_KEY=your-key node scripts/discover-table.js')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function discoverTables() {
  try {
    console.log('📋 Fetching table information...\n')
    
    // Get list of tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .neq('table_name', 'spatial_ref_sys')

    if (tablesError) {
      console.log('❌ Error fetching tables:', tablesError.message)
      return
    }

    console.log('📊 Available tables in your database:')
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table.table_name}`)
    })

    // Look for user-related tables
    const userTables = tables.filter(table => 
      table.table_name.toLowerCase().includes('user') ||
      table.table_name.toLowerCase().includes('profile') ||
      table.table_name.toLowerCase().includes('account') ||
      table.table_name.toLowerCase().includes('auth')
    )

    if (userTables.length > 0) {
      console.log('\n👤 Potential user tables found:')
      userTables.forEach((table, index) => {
        console.log(`  ${index + 1}. ${table.table_name}`)
      })

      // Examine the first user table
      const tableName = userTables[0].table_name
      console.log(`\n🔍 Examining table structure for: ${tableName}`)
      
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_name', tableName)
        .eq('table_schema', 'public')
        .order('ordinal_position')

      if (columnsError) {
        console.log('❌ Error fetching columns:', columnsError.message)
        return
      }

      console.log('\n📊 Table columns:')
      columns.forEach(column => {
        const nullable = column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'
        const defaultVal = column.column_default ? ` DEFAULT ${column.column_default}` : ''
        console.log(`  - ${column.column_name} (${column.data_type}) ${nullable}${defaultVal}`)
      })

      // Try to detect column mappings
      console.log('\n🎯 Suggested column mappings for UserService:')
      const mappings = detectColumnMappings(columns, tableName)
      console.log(JSON.stringify(mappings, null, 2))

      // Generate configuration code
      console.log('\n💻 Generated configuration code:')
      console.log('```typescript')
      console.log('// Add this to lib/userServiceConfig.ts')
      console.log('export const yourTableConfig: UserTableConfig = {')
      console.log(`  tableName: '${tableName}',`)
      console.log('  columns: {')
      console.log(`    id: '${mappings.id}',`)
      console.log(`    email: '${mappings.email}',`)
      console.log(`    name: '${mappings.name}',`)
      console.log(`    password: '${mappings.password}',`)
      console.log(`    plan: '${mappings.plan}',`)
      console.log(`    createdAt: '${mappings.createdAt}',`)
      console.log(`    updatedAt: '${mappings.updatedAt}',`)
      console.log(`    isEmailVerified: '${mappings.isEmailVerified}'`)
      console.log('  }')
      console.log('}')
      console.log('```')

      // Test a sample query
      console.log('\n🧪 Testing sample query...')
      try {
        const { data: sampleData, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)

        if (sampleError) {
          console.log('❌ Sample query error:', sampleError.message)
        } else {
          console.log('✅ Sample query successful!')
          if (sampleData && sampleData.length > 0) {
            console.log('📄 Sample record:')
            console.log(JSON.stringify(sampleData[0], null, 2))
          } else {
            console.log('📄 Table is empty (no sample data)')
          }
        }
      } catch (err) {
        console.log('❌ Sample query failed:', err.message)
      }

    } else {
      console.log('\n❌ No user-related tables found')
      console.log('You may need to create a users table or check your table names')
    }

  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

function detectColumnMappings(columns, tableName) {
  const mappings = {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    plan: 'plan',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    isEmailVerified: 'is_email_verified'
  }

  // Try to detect actual column names
  columns.forEach(column => {
    const colName = column.column_name.toLowerCase()
    
    if (colName.includes('id') && !colName.includes('email') && !colName.includes('user')) {
      mappings.id = column.column_name
    } else if (colName.includes('email')) {
      mappings.email = column.column_name
    } else if (colName.includes('name') || colName.includes('username') || colName.includes('full_name')) {
      mappings.name = column.column_name
    } else if (colName.includes('password') || colName.includes('hash') || colName.includes('pwd')) {
      mappings.password = column.column_name
    } else if (colName.includes('plan') || colName.includes('subscription') || colName.includes('tier') || colName.includes('type')) {
      mappings.plan = column.column_name
    } else if (colName.includes('created') || colName.includes('date_created') || colName.includes('created_at')) {
      mappings.createdAt = column.column_name
    } else if (colName.includes('updated') || colName.includes('date_updated') || colName.includes('updated_at')) {
      mappings.updatedAt = column.column_name
    } else if (colName.includes('verified') || colName.includes('email_verified') || colName.includes('is_verified')) {
      mappings.isEmailVerified = column.column_name
    }
  })

  return mappings
}

// Run the discovery
discoverTables().then(() => {
  console.log('\n✅ Table structure analysis complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Review the suggested column mappings above')
  console.log('2. Update lib/userServiceConfig.ts with your table configuration')
  console.log('3. Update the UserService to use your configuration')
  console.log('4. Test your configuration')
})



