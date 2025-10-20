import { NextRequest, NextResponse } from 'next/server'
import { Session } from 'next-auth'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'
import { UserRole, AccountRole, AccountPermission } from '@prisma/client'

/**
 * Standard API Response format
 */
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  details?: string
}

/**
 * User context with account and permissions
 */
export interface UserContext {
  session: Session
  userId: string
  accountId: string | null
  isOwner: boolean
  permissions: AccountPermission[]
  role: UserRole
  accountRole?: AccountRole
}

/**
 * API Handler options
 */
export interface ApiHandlerOptions {
  requireAuth?: boolean
  requireAdmin?: boolean
  requireAccount?: boolean
  requireOwner?: boolean
  requirePermissions?: AccountPermission[]
}

/**
 * Base API Handler Class
 * Provides consistent error handling, authentication, and response formatting
 */
export class ApiHandler {
  /**
   * Authenticate the request and get user context
   */
  static async getUserContext(options: ApiHandlerOptions = {}): Promise<UserContext | NextResponse> {
    const {
      requireAuth = true,
      requireAdmin = false,
      requireAccount = false,
      requireOwner = false,
      requirePermissions = [],
    } = options

    // Get session
    const session = await auth()

    if (requireAuth && (!session || !session.user)) {
      return this.unauthorized('Authentication required')
    }

    if (!session || !session.user) {
      // Return empty context if auth not required
      return {
        session: session as Session,
        userId: '',
        accountId: null,
        isOwner: false,
        permissions: [],
        role: 'USER' as UserRole,
      }
    }

    // Check admin role
    if (requireAdmin && session.user.role !== 'ADMIN') {
      return this.forbidden('Admin access required')
    }

    const userId = session.user.id

    // Get user's account and permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        ownedAccounts: {
          where: { isActive: true },
          select: { id: true },
          take: 1,
        },
        accountMemberships: {
          where: { isActive: true },
          include: {
            account: {
              select: { id: true },
            },
          },
          take: 1,
        },
      },
    })

    if (!user) {
      return this.notFound('User not found')
    }

    // Determine account and permissions
    let accountId: string | null = null
    let isOwner = false
    let permissions: AccountPermission[] = []
    let accountRole: AccountRole | undefined

    if (user.ownedAccounts.length > 0) {
      accountId = user.ownedAccounts[0].id
      isOwner = true
      // Owners have all permissions
      permissions = [
        'SCAN_CREATE',
        'SCAN_VIEW',
        'SCAN_EDIT',
        'SCAN_DELETE',
        'TEAM_VIEW',
        'TEAM_INVITE',
        'TEAM_REMOVE',
        'BILLING_VIEW',
        'BILLING_MANAGE',
        'SETTINGS_VIEW',
        'SETTINGS_EDIT',
      ] as AccountPermission[]
    } else if (user.accountMemberships.length > 0) {
      accountId = user.accountMemberships[0].accountId
      isOwner = false
      permissions = user.accountMemberships[0].permissions || []
      accountRole = user.accountMemberships[0].role
    }

    // Check if account is required
    if (requireAccount && !accountId) {
      return this.notFound('No account found')
    }

    // Check if owner is required
    if (requireOwner && !isOwner) {
      return this.forbidden('Account owner access required')
    }

    // Check if specific permissions are required
    if (requirePermissions.length > 0) {
      const hasAllPermissions = requirePermissions.every(p => permissions.includes(p))
      if (!hasAllPermissions && !isOwner) {
        return this.forbidden('Insufficient permissions')
      }
    }

    return {
      session,
      userId,
      accountId,
      isOwner,
      permissions,
      role: session.user.role as UserRole,
      accountRole,
    }
  }

  /**
   * Success response
   */
  static success<T>(data: T, message?: string, status: number = 200): NextResponse {
    return NextResponse.json(
      {
        data,
        ...(message && { message }),
      } as ApiResponse<T>,
      { status }
    )
  }

  /**
   * Error response
   */
  static error(error: string, details?: string, status: number = 500): NextResponse {
    console.error(`API Error (${status}):`, error, details || '')
    return NextResponse.json(
      {
        error,
        ...(details && { details }),
      } as ApiResponse,
      { status }
    )
  }

  /**
   * 400 Bad Request
   */
  static badRequest(error: string, details?: string): NextResponse {
    return this.error(error, details, 400)
  }

  /**
   * 401 Unauthorized
   */
  static unauthorized(error: string = 'Unauthorized'): NextResponse {
    return this.error(error, undefined, 401)
  }

  /**
   * 403 Forbidden
   */
  static forbidden(error: string = 'Forbidden'): NextResponse {
    return this.error(error, undefined, 403)
  }

  /**
   * 404 Not Found
   */
  static notFound(error: string = 'Not found'): NextResponse {
    return this.error(error, undefined, 404)
  }

  /**
   * 409 Conflict
   */
  static conflict(error: string, details?: string): NextResponse {
    return this.error(error, details, 409)
  }

  /**
   * 500 Internal Server Error
   */
  static internalError(error: Error | unknown): NextResponse {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return this.error('Internal server error', message, 500)
  }

  /**
   * Validate request body
   */
  static async validateBody<T>(
    request: NextRequest,
    requiredFields: string[]
  ): Promise<T | NextResponse> {
    try {
      const body = await request.json()

      for (const field of requiredFields) {
        if (!body[field]) {
          return this.badRequest(`Missing required field: ${field}`)
        }
      }

      return body as T
    } catch {
      return this.badRequest('Invalid JSON body')
    }
  }

  /**
   * Wrap handler with try-catch
   */
  static async handle<T>(
    handler: () => Promise<T | NextResponse>
  ): Promise<NextResponse> {
    try {
      const result = await handler()
      
      // If result is already a NextResponse, return it
      if (result instanceof NextResponse) {
        return result
      }

      // Otherwise, wrap in success response
      return this.success(result)
    } catch (error) {
      console.error('API Handler Error:', error)
      return this.internalError(error)
    }
  }
}

/**
 * Helper to check if a value is a NextResponse (error response)
 */
export function isErrorResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse
}

