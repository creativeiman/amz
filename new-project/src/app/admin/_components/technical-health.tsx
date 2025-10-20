import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Activity, CheckCircle, Star } from "lucide-react"

interface TechnicalHealthProps {
  metrics: {
    uptime: number
    avgScanTime: number
    apiErrorRate: number
    ocrAccuracy: number
  }
}

export function TechnicalHealth({ metrics }: TechnicalHealthProps) {
  const healthMetrics = [
    {
      label: "Uptime",
      value: `${metrics.uptime}%`,
      target: "Target: 99.9%",
      icon: Zap,
      color: "green",
    },
    {
      label: "Avg Scan Time",
      value: `${metrics.avgScanTime}s`,
      target: "Target: <30s",
      icon: Activity,
      color: "blue",
    },
    {
      label: "API Error Rate",
      value: `${metrics.apiErrorRate}%`,
      target: "Target: <1%",
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "OCR Accuracy",
      value: `${metrics.ocrAccuracy}%`,
      target: "Target: >90%",
      icon: Star,
      color: "blue",
    },
  ]

  const getColorClasses = (color: string) => {
    if (color === "green") {
      return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
    }
    return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-xs mt-1 opacity-80">{metric.target}</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

