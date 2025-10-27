'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Download, Loader2, CheckCircle } from 'lucide-react'
import { PLAN_LIMITS } from '@/config/plans'
import { format } from 'date-fns'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFreshAccount } from '@/hooks/use-fresh-account'

interface Payment {
  id: string
  date: string
  amount: number
  currency: string
  plan: string
  status: string
  invoiceUrl: string | null
}

// Component that uses searchParams - needs to be wrapped in Suspense
function BillingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { account, refetch } = useFreshAccount() // ✅ Use centralized hook
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [autoCheckoutLoading, setAutoCheckoutLoading] = useState(false)

  // Get current plan from fresh account data
  const currentPlan = account?.plan || 'FREE'
  const subscriptionCancelAt = account?.subscriptionCancelAt
  const isScheduledToCancel = !!subscriptionCancelAt

  const initiateCheckout = useCallback(async (planId: string) => {
    setAutoCheckoutLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: planId === 'deluxe' ? 'DELUXE' : 'ONE_TIME',
        }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        console.error('Failed to create checkout:', data.error)
        // Clear the plan param on error so user can try again
        window.history.replaceState({}, '', '/dashboard/billing')
      }
    } catch (error) {
      console.error('Error initiating checkout:', error)
      window.history.replaceState({}, '', '/dashboard/billing')
    } finally {
      setAutoCheckoutLoading(false)
    }
  }, [])

  // Check for payment success
  useEffect(() => {
    const success = searchParams?.get('success')
    if (success === 'true') {
      setShowSuccess(true)
      
      // Fetch fresh data immediately after payment
      refetch() // ✅ Use centralized refetch
      
      // Clear success param after 3 seconds
      setTimeout(() => {
        window.history.replaceState({}, '', '/dashboard/billing')
        setShowSuccess(false)
      }, 3000)
    }
  }, [searchParams, refetch])

  // Auto-initiate checkout if plan parameter is present (from registration flow)
  // Works for both email/password signup and Google OAuth signup
  // Note: FREE plan users never hit this because they're redirected to /dashboard (not /dashboard/billing)
  useEffect(() => {
    const planParam = searchParams?.get('plan')
    
    // Only handle paid plans (FREE plan users never reach here anyway)
    if (planParam && (planParam === 'deluxe' || planParam === 'one-time')) {
      // Only auto-checkout if user is still on FREE plan
      if (currentPlan === 'FREE') {
        initiateCheckout(planParam)
      } else {
        // User already has a plan, clear the parameter
        window.history.replaceState({}, '', '/dashboard/billing')
      }
    }
    // If planParam is 'free' or anything else, ignore it (no Stripe call)
  }, [searchParams, currentPlan, initiateCheckout])

  // Fetch billing history on mount (account data fetched by hook)
  useEffect(() => {
    fetchBillingHistory()
  }, [])

  const fetchBillingHistory = async () => {
    try {
      const response = await fetch('/api/billing/history')
      const data = await response.json()
      
      if (response.ok) {
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Failed to fetch billing history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setPortalLoading(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to open billing portal')
      }
    } catch (error) {
      console.error('Failed to open portal:', error)
      alert('Failed to open billing portal')
    } finally {
      setPortalLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      COMPLETED: 'default',
      PENDING: 'secondary',
      FAILED: 'destructive',
      REFUNDED: 'outline',
    }

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.toLowerCase()}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view payment history
        </p>
      </div>

      {/* Auto-checkout loading indicator */}
      {autoCheckoutLoading && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-900 dark:text-blue-100">Redirecting to checkout...</AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Please wait while we prepare your subscription checkout. You&apos;ll be redirected to Stripe in a moment.
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-900 dark:text-green-100">Payment Successful!</AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200">
            Your subscription has been activated. Your session is being refreshed...
          </AlertDescription>
        </Alert>
      )}

      {/* Scheduled Cancellation Warning */}
      {isScheduledToCancel && subscriptionCancelAt && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <AlertTitle className="text-amber-900 dark:text-amber-100">Subscription Ending Soon</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            Your subscription will end on <strong>{format(new Date(subscriptionCancelAt), 'MMMM dd, yyyy')}</strong>. 
            You&apos;ll continue to have access until then. To keep your benefits, reactivate your subscription in the Stripe portal.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold">
                {PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS]?.name || 'Free Plan'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {currentPlan === 'DELUXE' && '$29.99 / month'}
                {currentPlan === 'ONE_TIME' && '$99.99 one-time'}
                {currentPlan === 'FREE' && '$0.00 / month'}
              </p>
            </div>
            <Badge variant={currentPlan !== 'FREE' ? 'default' : 'secondary'}>
              Active
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Plan Features:</p>
            <ul className="text-muted-foreground space-y-1">
              {(PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS]?.features || PLAN_LIMITS.FREE.features).map((feature, index) => (
                <li key={index} className="text-sm">• {feature}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            {/* Show "Upgrade Plan" only if NOT on ONE_TIME and NOT scheduled to cancel */}
            {currentPlan !== 'ONE_TIME' && !isScheduledToCancel && (
              <Button onClick={() => router.push('/pricing')}>
                Upgrade Plan
              </Button>
            )}
            
            {/* Show "Manage Subscription" only if on DELUXE (subscription plan) */}
            {currentPlan === 'DELUXE' && (
              <Button
                variant={isScheduledToCancel ? 'default' : 'outline'}
                onClick={handleManageSubscription}
                disabled={portalLoading}
              >
                {portalLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isScheduledToCancel ? 'Reactivate Subscription' : 'Manage Subscription'}
                  </>
                )}
              </Button>
            )}

            {/* ONE_TIME users: Show a message instead of buttons */}
            {currentPlan === 'ONE_TIME' && (
              <p className="text-sm text-muted-foreground">
                ✓ You have lifetime access to all features. No further action needed.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View all your past transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No payment history yet</p>
              <p className="text-sm mt-1">
                Upgrade to a paid plan to see your transactions here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Plan</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b last:border-0">
                      <td className="py-3 text-sm">
                        {format(new Date(payment.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 text-sm">
                        {payment.plan.replace('_', ' ')}
                      </td>
                      <td className="py-3 text-sm font-medium">
                        ${payment.amount.toFixed(2)} {payment.currency}
                      </td>
                      <td className="py-3">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-3">
                        {payment.invoiceUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(payment.invoiceUrl!, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Main page component with Suspense boundary
export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <BillingPageContent />
    </Suspense>
  )
}

