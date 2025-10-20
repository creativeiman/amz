"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn, useSession } from "next-auth/react"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { api, ApiError } from "@/lib/api-client"

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
import { Separator } from "@/components/ui/separator"

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

function AcceptInviteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [invitationDetails, setInvitationDetails] = React.useState<InvitationDetails | null>(null)
  const [isAcceptingOAuth, setIsAcceptingOAuth] = React.useState(false)

  // Check if user is already signed in and invitation was auto-accepted
  React.useEffect(() => {
    // If user is signed in and invitation doesn't exist, it was likely auto-accepted
    if (session?.user && error && error.includes('already been used')) {
      console.log('[AcceptInvite] Invitation already accepted, redirecting to dashboard')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }, [session, error, router])

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
        const data = await api.get<{ invitation: InvitationDetails }>(`/api/invitations/verify?token=${token}`)
        setInvitationDetails(data.invitation)
        setIsLoading(false)
      } catch (error) {
        console.error("Error verifying invitation:", error)
        const message = error instanceof ApiError ? error.message : "Failed to verify invitation. Please try again."
        setError(message)
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
      await api.post("/api/invitations/accept", {
        token,
        name: data.name,
        password: data.password,
      })

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
    } catch (error) {
      console.error("Error accepting invitation:", error)
      const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again."
      setError(message)
      setIsSubmitting(false)
    }
  }

  const handleOAuthAccept = async () => {
    if (!session?.user || !token) return

    setIsAcceptingOAuth(true)
    setError(null)

    try {
      const result = await api.post<{ redirectUrl?: string }>("/api/invitations/accept-oauth", { token })
      setSuccess(true)
      setTimeout(() => {
        router.push(result.redirectUrl || "/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Error accepting OAuth invitation:", error)
      const message = error instanceof ApiError ? error.message : "Failed to accept invitation"
      setError(message)
    } finally {
      setIsAcceptingOAuth(false)
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
    // Check if user is signed in - invitation might have been auto-accepted
    const isAutoAccepted = session?.user && error.includes('already been used')
    
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              {isAutoAccepted ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <CardTitle>{isAutoAccepted ? 'Invitation Accepted!' : 'Invalid Invitation'}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant={isAutoAccepted ? "default" : "destructive"}>
              <AlertDescription>
                {isAutoAccepted 
                  ? "Your invitation has been accepted! You've been added to the team. Redirecting to dashboard..."
                  : error
                }
              </AlertDescription>
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

          {/* Show different UI based on authentication status */}
          {session?.user && session.user.authProvider === 'google' && session.user.email === invitationDetails?.email ? (
            // User is signed in with Google and email matches - show OAuth acceptance
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  You&apos;re signed in as <strong>{session.user.email}</strong>
                </p>
                <Button 
                  onClick={handleOAuthAccept}
                  disabled={isAcceptingOAuth}
                  className="w-full"
                >
                  {isAcceptingOAuth ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    "Accept Invitation"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            // Show credential form or Google sign-in option
            <>
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-4">
              <GoogleSignInButton 
                callbackUrl={`/accept-invite?token=${token}`}
                className="w-full"
              />
            </div>
          </div>
            </>
          )}
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

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center min-h-screen py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Loading...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  )
}

