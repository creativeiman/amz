import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'
import { getUserTableConfig } from './userServiceConfig'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  created_at: string
  plan: 'free' | 'deluxe' | 'one-time'
  is_email_verified: boolean
}

export class UserService {
  static async createUser(userData: {
    name: string
    email: string
    password: string
    plan?: 'free' | 'deluxe' | 'one-time'
  }): Promise<{ success: boolean; user?: Omit<User, 'password'>; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        // Return mock success if Supabase is not configured
        console.log('Supabase not configured, returning mock user')
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

      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        return { success: false, error: 'User with this email already exists' }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Create user in Supabase
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          plan: userData.plan || 'free',
          is_email_verified: false
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        return { success: false, error: 'Failed to create user' }
      }

      // Return user without password
      const { password, ...userWithoutPassword } = newUser
      return { success: true, user: userWithoutPassword }
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

      // Get user from Supabase
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user
      return { success: true, user: userWithoutPassword }
    } catch (error) {
      console.error('Error authenticating user:', error)
      return { success: false, error: 'Authentication failed' }
    }
  }

  static async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !user) {
        return null
      }

      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  static async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    try {
      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('*')

      if (error) {
        console.error('Supabase error:', error)
        return []
      }

      return users.map((user: User) => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
      })
    } catch (error) {
      console.error('Error getting users:', error)
      return []
    }
  }

  static async getUserByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    try {
      if (!isSupabaseConfigured()) {
        // Return mock user if Supabase is not configured
        return {
          id: 'mock-user-id',
          name: 'Mock User',
          email: email,
          created_at: new Date().toISOString(),
          plan: 'free',
          is_email_verified: false
        }
      }

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        return null
      }

      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  static async updateUserPlan(email: string, plan: 'free' | 'deluxe' | 'one-time'): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        // Return mock success if Supabase is not configured
        console.log(`Mock: Updated user ${email} to plan ${plan}`)
        return { success: true }
      }

      const { error } = await supabaseAdmin
        .from('users')
        .update({ plan })
        .eq('email', email)

      if (error) {
        console.error('Supabase error updating plan:', error)
        return { success: false, error: 'Failed to update plan' }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating user plan:', error)
      return { success: false, error: 'Failed to update plan' }
    }
  }
}
