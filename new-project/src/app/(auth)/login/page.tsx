"use client"

import { useState, useEffect, Suspense } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Check for error in URL parameters (from NextAuth)
  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      // Decode the error message
      const decodedError = decodeURIComponent(urlError)
      setError(decodedError)
    }
  }, [searchParams])

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)
    setError(null)

    try {
      // First, verify credentials and check user/account status via our API
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      const verifyData = await verifyResponse.json()

      // If verification failed, show the specific error message
      if (!verifyResponse.ok) {
        setError(verifyData.message || 'Authentication failed')
        setIsLoading(false)
        return
      }

      // Verification passed, now sign in with NextAuth
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Authentication failed. Please try again.")
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // Successful login - redirect based on user role from verify response
        if (verifyData.user.role === 'ADMIN') {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-4 sm:py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            {/* Google Sign-In */}
            <GoogleSignInButton />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2.5 sm:p-3 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor={field.name} className="text-sm sm:text-base">Email</Label>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                    className={`text-sm sm:text-base h-10 sm:h-11 ${fieldState.invalid ? "border-red-500 dark:border-red-700" : ""}`}
                  />
                  {fieldState.error && (
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.name} className="text-sm sm:text-base">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs sm:text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                    className={`text-sm sm:text-base h-10 sm:h-11 ${fieldState.invalid ? "border-red-500 dark:border-red-700" : ""}`}
                  />
                  {fieldState.error && (
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Test Credentials Helper */}
            <div className="p-2.5 sm:p-3 text-xs sm:text-sm bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="font-semibold text-blue-900 dark:text-blue-400 mb-1">Test Credentials:</p>
              <p className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm">Admin: admin@productlabelchecker.com / admin123</p>
              <p className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm">User: deluxe@test.com / test123</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 sm:space-y-4 pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <Button
              type="submit"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-xs sm:text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center min-h-screen py-4 sm:py-8 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">
              Loading...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
