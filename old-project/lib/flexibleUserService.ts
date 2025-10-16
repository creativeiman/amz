import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { getUserTableConfig, UserTableConfig } from './userServiceConfig'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey)
}

// Create Supabase clients
const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

const supabaseAdmin = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

export interface User {
  id: string
  name: string
  email: string
  password?: string
  plan: string
  created_at: string
  updated_at?: string
  is_email_verified: boolean
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  plan?: string
}

export class FlexibleUserService {
  private static getConfig(): UserTableConfig {
    return getUserTableConfig()
  }

  private static getTableName(): string {
    return this.getConfig().tableName
  }

  private static getColumns() {
    return this.getConfig().columns
  }

  static async createUser(userData: CreateUserData): Promise<{ success: boolean; user?: Omit<User, 'password'>; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        // Return mock user for demo purposes
        console.log('Supabase not configured, using mock user creation')
        return {
          success: true,
          user: {
            id: 'mock-user-id',
            name: userData.name,
            email: userData.email,
            created_at: new Date().toISOString(),
            plan: userData.plan || 'free',
            is_email_verified: false
          }
        }
      }

      const config = this.getConfig()
      const columns = this.getColumns()

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email)
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Create user in Supabase using your table structure
      const { data: newUser, error } = await supabaseAdmin!
        .from(config.tableName)
        .insert({
          [columns.name]: userData.name,
          [columns.email]: userData.email,
          [columns.password]: hashedPassword,
          [columns.plan]: userData.plan || 'free',
          [columns.isEmailVerified]: false
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        if (error.code === '23505') { // Unique constraint violation
          return { success: false, error: 'User with this email already exists' }
        }
        return { success: false, error: 'Failed to create user' }
      }

      // Return user without password, mapping to our User interface
      const { [columns.password]: _, ...userWithoutPassword } = newUser
      return { 
        success: true, 
        user: {
          id: newUser[columns.id],
          name: newUser[columns.name],
          email: newUser[columns.email],
          plan: newUser[columns.plan],
          created_at: newUser[columns.createdAt],
          updated_at: newUser[columns.updatedAt],
          is_email_verified: newUser[columns.isEmailVerified]
        }
      }
    } catch (error) {
      console.error('Error creating user:', error)
      return { success: false, error: 'Failed to create user' }
    }
  }

  static async authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: Omit<User, 'password'>; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        // Return mock authentication for demo purposes
        console.log('Supabase not configured, using mock authentication')
        return { 
          success: true, 
          user: {
            id: 'mock-user-id',
            name: 'Demo User',
            email: email,
            created_at: new Date().toISOString(),
            plan: 'free',
            is_email_verified: false
          }
        }
      }

      const config = this.getConfig()
      const columns = this.getColumns()

      // Get user from your Supabase table
      const { data: user, error } = await supabaseAdmin!
        .from(config.tableName)
        .select('*')
        .eq(columns.email, email)
        .single()

      if (error || !user) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user[columns.password])
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Return user without password, mapping to our User interface
      return { 
        success: true, 
        user: {
          id: user[columns.id],
          name: user[columns.name],
          email: user[columns.email],
          plan: user[columns.plan],
          created_at: user[columns.createdAt],
          updated_at: user[columns.updatedAt],
          is_email_verified: user[columns.isEmailVerified]
        }
      }
    } catch (error) {
      console.error('Error authenticating user:', error)
      return { success: false, error: 'Authentication failed' }
    }
  }

  static async getUserByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    try {
      if (!isSupabaseConfigured()) {
        // Return mock user for demo purposes
        console.log('Supabase not configured, using mock user lookup')
        return {
          id: 'mock-user-id',
          name: 'Demo User',
          email: email,
          created_at: new Date().toISOString(),
          plan: 'free',
          is_email_verified: false
        }
      }

      const config = this.getConfig()
      const columns = this.getColumns()

      const { data: user, error } = await supabaseAdmin!
        .from(config.tableName)
        .select('*')
        .eq(columns.email, email)
        .single()

      if (error || !user) {
        return null
      }

      // Return user without password, mapping to our User interface
      return {
        id: user[columns.id],
        name: user[columns.name],
        email: user[columns.email],
        plan: user[columns.plan],
        created_at: user[columns.createdAt],
        updated_at: user[columns.updatedAt],
        is_email_verified: user[columns.isEmailVerified]
      }
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  static async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    try {
      if (!isSupabaseConfigured()) {
        return null
      }

      const config = this.getConfig()
      const columns = this.getColumns()

      const { data: user, error } = await supabaseAdmin!
        .from(config.tableName)
        .select('*')
        .eq(columns.id, id)
        .single()

      if (error || !user) {
        return null
      }

      // Return user without password, mapping to our User interface
      return {
        id: user[columns.id],
        name: user[columns.name],
        email: user[columns.email],
        plan: user[columns.plan],
        created_at: user[columns.createdAt],
        updated_at: user[columns.updatedAt],
        is_email_verified: user[columns.isEmailVerified]
      }
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  static async updateUserPlan(userId: string, plan: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: true }
      }

      const config = this.getConfig()
      const columns = this.getColumns()

      const { error } = await supabaseAdmin!
        .from(config.tableName)
        .update({ [columns.plan]: plan })
        .eq(columns.id, userId)

      if (error) {
        console.error('Error updating user plan:', error)
        return { success: false, error: 'Failed to update user plan' }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating user plan:', error)
      return { success: false, error: 'Failed to update user plan' }
    }
  }
}



