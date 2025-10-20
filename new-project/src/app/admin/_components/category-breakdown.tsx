import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryBreakdownProps {
  data: {
    toys: number
    babyProducts: number
    cosmetics: number
  }
  totalScans: number
  avgScore: number
}

export function CategoryBreakdown({ data, totalScans, avgScore }: CategoryBreakdownProps) {
  const categories = [
    { name: "Toys", scans: data.toys, percentage: totalScans > 0 ? (data.toys / totalScans) * 100 : 0 },
    { name: "Baby Products", scans: data.babyProducts, percentage: totalScans > 0 ? (data.babyProducts / totalScans) * 100 : 0 },
    { name: "Cosmetics", scans: data.cosmetics, percentage: totalScans > 0 ? (data.cosmetics / totalScans) * 100 : 0 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scans by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground">{category.scans.toLocaleString()} scans</span>
              </div>
              <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Total Scans</div>
            <div className="text-2xl font-bold">{totalScans.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Avg. Compliance Score</div>
            <div className="text-2xl font-bold">{avgScore.toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

