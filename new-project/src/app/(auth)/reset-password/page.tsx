"use client"

import { useState, useEffect, Suspense } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { api, ApiError } from "@/lib/api-client"

// Form validation schema
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.")
    }
  }, [token])

  // Redirect to login after successful reset
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/login?message=Password reset successful! Please log in with your new password.")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  async function onSubmit(data: ResetPasswordFormData) {
    if (!token) {
      setError("Invalid reset link")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await api.post("/api/auth/reset-password", {
        token,
        password: data.password,
      })

      setSuccess(true)
    } catch (error) {
      console.error("Error resetting password:", error)
      const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again."
      setError(message)
      setIsLoading(false)
    }
  }

  // Invalid token state
  if (!token) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-4 sm:py-8 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
            <Link href="/forgot-password" className="w-full">
              <Button className="w-full h-10 sm:h-11 text-sm sm:text-base">
                Request New Reset Link
              </Button>
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-4 sm:py-8 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">
              Password Reset Successful!
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Your password has been successfully updated.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs sm:text-sm text-center text-blue-700 dark:text-blue-300">
                Redirecting you to login in 3 seconds...
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center px-4 sm:px-6 pb-4 sm:pb-6">
            <Link href="/login" className="w-full">
              <Button className="w-full h-10 sm:h-11 text-sm sm:text-base">
                Go to Login Now
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-4 sm:py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            {/* Error Message */}
            {error && (
              <div className="p-2.5 sm:p-3 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor={field.name} className="text-sm sm:text-base">New Password</Label>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="Enter your new password"
                    autoComplete="new-password"
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

            {/* Confirm Password Field */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor={field.name} className="text-sm sm:text-base">Confirm New Password</Label>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
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
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 sm:space-y-4 pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <Button
              type="submit"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            <Link
              href="/login"
              className="text-xs sm:text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  )
}

