import bcrypt from 'bcryptjs'

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
  plan: 'free' | 'deluxe' | 'one-time'
  isEmailVerified: boolean
}

export class UserManager {
  private static users: User[] = []

  // In production, this would be replaced with a real database
  // For now, we'll use in-memory storage that persists during the session

  static async createUser(userData: {
    name: string
    email: string
    password: string
  }): Promise<{ success: boolean; user?: Omit<User, 'password'>; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = this.users.find(u => u.email === userData.email)
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Create new user
      const newUser: User = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        plan: 'free',
        isEmailVerified: false
      }

      this.users.push(newUser)
      console.log(`User created: ${newUser.name} (${newUser.email})`)

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
      console.log('UserManager: Looking for user with email:', email)
      console.log('UserManager: Total users in memory:', this.users.length)
      console.log('UserManager: Users:', this.users.map(u => ({ email: u.email, name: u.name })))
      
      const user = this.users.find(u => u.email === email)
      if (!user) {
        console.log('UserManager: User not found')
        return { success: false, error: 'Invalid email or password' }
      }

      console.log('UserManager: User found, checking password')
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        console.log('UserManager: Password invalid')
        return { success: false, error: 'Invalid email or password' }
      }

      console.log('UserManager: Authentication successful')
      // Return user without password
      const { password: _, ...userWithoutPassword } = user
      return { success: true, user: userWithoutPassword }
    } catch (error) {
      console.error('UserManager: Error authenticating user:', error)
      return { success: false, error: 'Authentication failed' }
    }
  }

  static getUserById(id: string): Omit<User, 'password'> | null {
    const user = this.users.find(u => u.id === id)
    if (!user) return null

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  static getUserByEmail(email: string): Omit<User, 'password'> | null {
    const user = this.users.find(u => u.email === email)
    if (!user) return null

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  static getAllUsers(): Omit<User, 'password'>[] {
    return this.users.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  }

  static async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'password'>>): Promise<{ success: boolean; user?: Omit<User, 'password'>; error?: string }> {
    try {
      const userIndex = this.users.findIndex(u => u.id === id)
      if (userIndex === -1) {
        return { success: false, error: 'User not found' }
      }

      this.users[userIndex] = { ...this.users[userIndex], ...updates }

      const { password, ...userWithoutPassword } = this.users[userIndex]
      return { success: true, user: userWithoutPassword }
    } catch (error) {
      console.error('Error updating user:', error)
      return { success: false, error: 'Failed to update user' }
    }
  }
}
