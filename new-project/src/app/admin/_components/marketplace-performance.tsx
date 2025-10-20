import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MarketplacePerformanceProps {
  data: {
    usa: { users: number; scans: number }
    uk: { users: number; scans: number }
    germany: { users: number; scans: number }
  }
  totalUsers: number
}

export function MarketplacePerformance({ data, totalUsers }: MarketplacePerformanceProps) {
  const marketplaces = [
    { name: "USA", ...data.usa },
    { name: "UK", ...data.uk },
    { name: "Germany", ...data.germany },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketplace Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketplaces.map((market) => (
            <div key={market.name} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-semibold">{market.name}</span>
                <Badge variant="secondary">
                  {totalUsers > 0 ? ((market.users / totalUsers) * 100).toFixed(1) : 0}% of users
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <div className="text-xs text-muted-foreground">Users</div>
                  <div className="text-lg font-bold">{market.users}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Scans</div>
                  <div className="text-lg font-bold">{market.scans.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

