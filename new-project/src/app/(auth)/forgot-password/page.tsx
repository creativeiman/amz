"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Loader2, ArrowLeft, Mail, CheckCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOAuthAccount, setIsOAuthAccount] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true)
    setError(null)
    setIsOAuthAccount(false)
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      if (!response.ok) {
        // Check if this is an OAuth account
        if (result.error === 'OAUTH_ACCOUNT') {
          setIsOAuthAccount(true)
          setError(result.message)
        } else {
          setError(result.error || "Failed to send reset email")
        }
        setIsLoading(false)
        return
      }

      // Show success message
      setSuccess(true)
      form.reset()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-4 sm:py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            {/* OAuth Account Info Message */}
            {isOAuthAccount && error && (
              <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-400 mb-1">
                      Google Sign-In Account
                    </p>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mb-3">
                      {error}
                    </p>
                    <Link href="/login">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      >
                        Go to Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && !isOAuthAccount && (
              <div className="p-2.5 sm:p-3 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-green-900 dark:text-green-400 mb-1">
                      Check your email
                    </p>
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                      If an account exists with this email, you will receive a password reset link shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor={field.name} className="text-sm sm:text-base">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      disabled={isLoading || success}
                      aria-invalid={fieldState.invalid}
                      className={`pl-10 text-sm sm:text-base h-10 sm:h-11 ${fieldState.invalid ? "border-red-500 dark:border-red-700" : ""}`}
                    />
                  </div>
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
              disabled={isLoading || success}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <Link
              href="/login"
              className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Back to Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
