"use client"

import { useState, Suspense } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Form validation schema
const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get("plan") // Get plan from URL query
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Register the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Registration failed. Please try again.")
        setIsLoading(false)
        return
      }

      // Step 2: Automatically log the user in
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // If auto-login fails, redirect to login page
        router.push("/login?message=Account created! Please login with your credentials.")
      } else if (signInResult?.ok) {
        // Successfully logged in
        if (selectedPlan && selectedPlan !== 'free') {
          // If user selected a paid plan, redirect to billing with plan parameter
          router.push(`/dashboard/billing?plan=${selectedPlan}`)
        } else {
          // Otherwise, redirect to dashboard
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
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Enter your information to get started
          </CardDescription>
          
          {/* Plan Selection Indicator */}
          {selectedPlan && (
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/30 dark:to-blue-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-xs sm:text-sm text-center text-gray-700 dark:text-gray-300">
                Selected Plan: <span className="font-semibold capitalize">{selectedPlan === 'one-time' ? 'One-Time Use' : selectedPlan}</span>
                {selectedPlan !== 'free' && (
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    You&apos;ll be redirected to complete your subscription after registration
                  </span>
                )}
              </p>
            </div>
          )}
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            {/* Error Message */}
            {error && (
              <div className="p-2.5 sm:p-3 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            {/* Name Field */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor={field.name} className="text-sm sm:text-base">Full Name</Label>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
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
                  <Label htmlFor={field.name} className="text-sm sm:text-base">Password</Label>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="Create a strong password"
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
                  <Label htmlFor={field.name} className="text-sm sm:text-base">Confirm Password</Label>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="Confirm your password"
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
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-xs sm:text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
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
      <RegisterForm />
    </Suspense>
  )
}
