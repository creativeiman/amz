/**
 * API Client for Frontend
 * 
 * Provides a consistent interface for making API calls and automatically
 * handles the ApiHandler response structure ({ data: ... }).
 */

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  details?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * API Client
 * Automatically unwraps ApiHandler responses and handles errors
 */
export class ApiClient {
  /**
   * Make a GET request
   */
  static async get<T = unknown>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  /**
   * Make a POST request
   */
  static async post<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      ...(body instanceof FormData
        ? { body }
        : {
            headers: { 'Content-Type': 'application/json', ...options?.headers },
            body: JSON.stringify(body),
          }),
    })
  }

  /**
   * Make a PUT request
   */
  static async put<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * Make a PATCH request
   */
  static async patch<T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * Make a DELETE request
   */
  static async delete<T = unknown>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }

  /**
   * Core request handler
   * Automatically unwraps ApiHandler responses ({ data: ... })
   */
  private static async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options)

      // Parse JSON response
      const result: ApiResponse<T> = await response.json()

      // Handle error responses
      if (!response.ok) {
        throw new ApiError(
          result.error || 'Request failed',
          response.status,
          result.details
        )
      }

      // ApiHandler wraps successful responses in { data: ... }
      // Return the unwrapped data, or the result itself if not wrapped
      return (result.data ?? result) as T
    } catch (error) {
      // Re-throw ApiError as-is
      if (error instanceof ApiError) {
        throw error
      }

      // Handle network errors or JSON parse errors
      if (error instanceof Error) {
        throw new ApiError(error.message, 0)
      }

      // Unknown error
      throw new ApiError('An unknown error occurred', 0)
    }
  }
}

/**
 * Convenience function for making API calls
 * Usage: api.get('/api/users'), api.post('/api/users', data)
 */
export const api = ApiClient

