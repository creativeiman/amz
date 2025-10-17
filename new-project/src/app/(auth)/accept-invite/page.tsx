"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/loading"

const acceptInviteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>

type InvitationDetails = {
  email: string
  role: string
  accountName: string
  invitedByName: string
  expiresAt: string
}

export default function AcceptInvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [invitationDetails, setInvitationDetails] = React.useState<InvitationDetails | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
  })

  // Verify token on mount
  React.useEffect(() => {
    if (!token) {
      setError("Invalid invitation link. No token provided.")
      setIsLoading(false)
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/invitations/verify?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Invalid or expired invitation")
          setIsLoading(false)
          return
        }

        setInvitationDetails(data.invitation)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to verify invitation. Please try again.")
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token])

  const onSubmit = async (data: AcceptInviteFormData) => {
    if (!token || !invitationDetails) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Step 1: Accept the invitation
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: data.name,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to accept invitation")
        setIsSubmitting(false)
        return
      }

      setSuccess(true)

      // Step 2: Automatically log the user in
      const signInResult = await signIn("credentials", {
        email: invitationDetails.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // If auto-login fails, redirect to login page
        setTimeout(() => {
          router.push("/login?message=Invitation accepted! Please login with your credentials.")
        }, 2000)
      } else if (signInResult?.ok) {
        // Successfully logged in, redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1500)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying invitation..." />
      </div>
    )
  }

  if (error && !invitationDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <CardTitle>Invalid Invitation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle>Welcome to the Team!</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging you in and redirecting to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Team Invitation</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join a team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitationDetails && (
            <div className="mb-6 rounded-lg bg-muted p-4 space-y-2 text-sm">
              <div>
                <span className="font-medium">Email:</span>{" "}
                <span className="text-muted-foreground">{invitationDetails.email}</span>
              </div>
              <div>
                <span className="font-medium">Account:</span>{" "}
                <span className="text-muted-foreground">{invitationDetails.accountName}</span>
              </div>
              <div>
                <span className="font-medium">Role:</span>{" "}
                <span className="text-muted-foreground">{invitationDetails.role}</span>
              </div>
              <div>
                <span className="font-medium">Invited by:</span>{" "}
                <span className="text-muted-foreground">{invitationDetails.invitedByName}</span>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                "Accept Invitation"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/login")}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

