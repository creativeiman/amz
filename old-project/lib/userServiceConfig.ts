/**
 * UserService Configuration for Existing Supabase Tables
 * 
 * This file allows you to configure the UserService to work with your existing
 * Supabase table structure without modifying the main UserService code.
 */

export interface UserTableConfig {
  // Table name in your Supabase database
  tableName: string
  
  // Column mappings
  columns: {
    id: string
    email: string
    name: string
    password: string
    plan: string
    createdAt: string
    updatedAt: string
    isEmailVerified: string
  }
  
  // Optional: Custom query modifications
  customQueries?: {
    createUser?: string
    getUserByEmail?: string
    getUserById?: string
    updateUser?: string
  }
}

// Default configuration (matches our schema)
export const defaultUserConfig: UserTableConfig = {
  tableName: 'users',
  columns: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    plan: 'plan',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    isEmailVerified: 'is_email_verified'
  }
}

// Example configurations for common table structures
export const commonConfigs = {
  // If your table uses 'profiles' instead of 'users'
  profiles: {
    ...defaultUserConfig,
    tableName: 'profiles'
  },
  
  // If your table uses 'accounts' instead of 'users'
  accounts: {
    ...defaultUserConfig,
    tableName: 'accounts'
  },
  
  // If your columns have different names
  customColumns: {
    tableName: 'users',
    columns: {
      id: 'user_id',           // if your ID column is 'user_id'
      email: 'email_address',  // if your email column is 'email_address'
      name: 'full_name',       // if your name column is 'full_name'
      password: 'hashed_password', // if your password column is 'hashed_password'
      plan: 'subscription_plan',   // if your plan column is 'subscription_plan'
      createdAt: 'date_created',   // if your created column is 'date_created'
      updatedAt: 'date_updated',   // if your updated column is 'date_updated'
      isEmailVerified: 'email_verified' // if your verified column is 'email_verified'
    }
  }
}

// Your existing Supabase table configuration
export const yourTableConfig: UserTableConfig = {
  tableName: 'users',
  columns: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    plan: 'plan',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    isEmailVerified: 'is_email_verified'
  }
}

// Function to get the current configuration
export function getUserTableConfig(): UserTableConfig {
  // Return your specific table configuration
  return yourTableConfig
}
