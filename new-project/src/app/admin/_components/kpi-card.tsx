import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: number
  change: number
  trend: 'up' | 'down'
  icon: LucideIcon
  format?: 'currency' | 'percentage' | 'number'
}

export function KPICard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  format = 'number' 
}: KPICardProps) {
  const isPositive = (trend === 'up' && change > 0) || (trend === 'down' && change < 0)
  
  const formatValue = (val: number) => {
    if (format === 'currency') {
      return `$${val.toLocaleString()}`
    }
    if (format === 'percentage') {
      return `${val.toFixed(1)}%`
    }
    return val.toLocaleString()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        <div className="flex items-center mt-1 text-xs">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
          <span className="text-muted-foreground ml-1">vs last period</span>
        </div>
      </CardContent>
    </Card>
  )
}

