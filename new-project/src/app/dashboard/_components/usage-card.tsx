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
        return 'bg-gradient-to-r from-blue-500 to-purple-500'
      case 'ONE_TIME':
        return 'bg-gradient-to-r from-green-500 to-emerald-500'
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scan Usage</CardTitle>
            <CardDescription>
              Current plan: <span className={`font-semibold ${getPlanBadgeColor(plan)}`}>{plan}</span>
            </CardDescription>
          </div>
          {plan === 'FREE' && (
            <Button onClick={onUpgrade} size="sm" variant="outline">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Upgrade
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Scans used</span>
            <span className="text-2xl font-bold">
              {scansUsed} {!isUnlimited && `/ ${scanLimit}`}
            </span>
          </div>
          {!isUnlimited && (
            <>
              <Progress value={percentage} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {remaining} scan{remaining !== 1 && 's'} remaining this month
              </p>
            </>
          )}
          {isUnlimited && (
            <p className="text-sm text-green-600 font-medium">
              ✨ Unlimited scans available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

