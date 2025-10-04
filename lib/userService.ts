import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

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
      // Check if user already exists
      const { data: existingUser } = await supabase
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
      const { data: newUser, error } = await supabase
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
      // Get user from Supabase
      const { data: user, error } = await supabase
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
      const { data: user, error } = await supabase
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
      const { data: users, error } = await supabase
        .from('users')
        .select('*')

      if (error) {
        console.error('Supabase error:', error)
        return []
      }

      return users.map(user => {
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
      const { data: user, error } = await supabase
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
      const { error } = await supabase
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
