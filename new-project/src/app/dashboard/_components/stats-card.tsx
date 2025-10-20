import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
}

export function StatsCard({ title, value, icon: Icon, iconColor, iconBgColor }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 truncate">{value}</p>
          </div>
          <div className={`p-2 sm:p-3 ${iconBgColor} rounded-xl flex-shrink-0 ml-3`}>
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

