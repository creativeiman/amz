#!/usr/bin/env node

/**
 * Configuration Tool for Existing Supabase Tables
 * 
 * This script helps you configure the UserService to work with your existing
 * Supabase table structure.
 * 
 * Run with: node scripts/configure-existing-table.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 ProductLabelChecker - Existing Table Configuration Tool\n')

// Check environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing Supabase environment variables!')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function discoverTableStructure() {
  try {
    console.log('🔍 Discovering your Supabase table structure...\n')
    
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

    console.log('📋 Available tables:')
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table.table_name}`)
    })

    // Look for user-related tables
    const userTables = tables.filter(table => 
      table.table_name.toLowerCase().includes('user') ||
      table.table_name.toLowerCase().includes('profile') ||
      table.table_name.toLowerCase().includes('account')
    )

    if (userTables.length > 0) {
      console.log('\n👤 Potential user tables found:')
      userTables.forEach((table, index) => {
        console.log(`  ${index + 1}. ${table.table_name}`)
      })
    }

    // If we found user tables, examine their structure
    if (userTables.length > 0) {
      const tableName = userTables[0].table_name
      console.log(`\n🔍 Examining table structure for: ${tableName}`)
      
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', tableName)
        .eq('table_schema', 'public')

      if (columnsError) {
        console.log('❌ Error fetching columns:', columnsError.message)
        return
      }

      console.log('\n📊 Table columns:')
      columns.forEach(column => {
        console.log(`  - ${column.column_name} (${column.data_type}) ${column.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`)
      })

      // Try to detect column mappings
      console.log('\n🎯 Suggested column mappings:')
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
    
    if (colName.includes('id') && !colName.includes('email')) {
      mappings.id = column.column_name
    } else if (colName.includes('email')) {
      mappings.email = column.column_name
    } else if (colName.includes('name') || colName.includes('username')) {
      mappings.name = column.column_name
    } else if (colName.includes('password') || colName.includes('hash')) {
      mappings.password = column.column_name
    } else if (colName.includes('plan') || colName.includes('subscription') || colName.includes('tier')) {
      mappings.plan = column.column_name
    } else if (colName.includes('created') || colName.includes('date_created')) {
      mappings.createdAt = column.column_name
    } else if (colName.includes('updated') || colName.includes('date_updated')) {
      mappings.updatedAt = column.column_name
    } else if (colName.includes('verified') || colName.includes('email_verified')) {
      mappings.isEmailVerified = column.column_name
    }
  })

  return mappings
}

// Run the discovery
discoverTableStructure().then(() => {
  console.log('\n✅ Table structure analysis complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Review the suggested column mappings above')
  console.log('2. Update lib/userServiceConfig.ts with your table configuration')
  console.log('3. Update lib/userService.ts to use FlexibleUserService')
  console.log('4. Test your configuration with: npm run test:supabase')
})



