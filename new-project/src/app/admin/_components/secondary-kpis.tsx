import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign } from "lucide-react"

interface SecondaryKPIsProps {
  conversionRate: number
  newUsersThisMonth: number
  userGrowthRate: number
  avgRevenuePerUser: number
}

export function SecondaryKPIs({ 
  conversionRate, 
  newUsersThisMonth, 
  userGrowthRate, 
  avgRevenuePerUser 
}: SecondaryKPIsProps) {
  const metrics = [
    {
      label: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      description: "Free to paid conversion",
      icon: TrendingUp,
      color: "text-blue-500 dark:text-blue-400",
    },
    {
      label: "New Users This Month",
      value: newUsersThisMonth.toString(),
      description: "User signups this month",
      icon: Users,
      color: "text-green-500 dark:text-green-400",
    },
    {
      label: "Growth Rate",
      value: `${userGrowthRate.toFixed(1)}%`,
      description: "Month over month growth",
      icon: TrendingUp,
      color: "text-blue-500 dark:text-blue-400",
    },
    {
      label: "Avg Revenue/User",
      value: `$${avgRevenuePerUser.toFixed(2)}`,
      description: "Revenue per user",
      icon: DollarSign,
      color: "text-blue-500 dark:text-blue-400",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            const isLast = index === metrics.length - 1
            return (
              <div key={metric.label} className={!isLast ? "pb-4 border-b" : ""}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{metric.description}</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

