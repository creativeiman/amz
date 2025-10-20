import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertItem } from "./alert-item"

interface RecentAlertsProps {
  alerts: Array<{
    type: 'critical' | 'warning' | 'success' | 'info'
    message: string
    time: string
  }>
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Alerts & Events</CardTitle>
        <Button variant="ghost" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div>
            {alerts.map((alert, index) => (
              <AlertItem key={index} {...alert} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent alerts
          </p>
        )}
      </CardContent>
    </Card>
  )
}

