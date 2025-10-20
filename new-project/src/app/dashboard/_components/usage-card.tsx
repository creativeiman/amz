import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

interface UsageCardProps {
  scansUsed: number
  scanLimit: number | null
  plan: string
  onUpgrade: () => void
}

export function UsageCard({ scansUsed, scanLimit, plan, onUpgrade }: UsageCardProps) {
  const isUnlimited = scanLimit === null
  const percentage = isUnlimited ? 0 : (scansUsed / scanLimit) * 100
  const remaining = isUnlimited ? 'Unlimited' : Math.max(0, scanLimit - scansUsed)

  const getPlanBadgeColor = (planType: string) => {
    switch (planType) {
      case 'DELUXE':
        return 'text-blue-600 dark:text-blue-400'
      case 'ONE_TIME':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-700 dark:text-gray-300'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">Scan Usage</CardTitle>
            <CardDescription className="text-sm">
              Current plan: <span className={`font-semibold ${getPlanBadgeColor(plan)}`}>{plan}</span>
            </CardDescription>
          </div>
          {plan === 'FREE' && (
            <Button onClick={onUpgrade} size="sm" variant="outline" className="flex-shrink-0">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Upgrade
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Scans used</span>
            <span className="text-xl sm:text-2xl font-bold">
              {scansUsed} {!isUnlimited && `/ ${scanLimit}`}
            </span>
          </div>
          {!isUnlimited && (
            <>
              <Progress value={percentage} className="h-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                {remaining} scan{remaining !== 1 && 's'} remaining this month
              </p>
            </>
          )}
          {isUnlimited && (
            <p className="text-xs sm:text-sm text-green-600 font-medium">
              ✨ Unlimited scans available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

