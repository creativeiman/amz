"use client"

import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  accounts: {
    label: "Accounts",
  },
  free: {
    label: "Free",
    color: "var(--chart-1)",
  },
  deluxe: {
    label: "Deluxe ($29.99/mo)",
    color: "var(--chart-2)",
  },
  oneTime: {
    label: "One-Time ($59.99)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

interface PlanDistributionChartProps {
  data: {
    free: number
    deluxe: number
    oneTime: number
  }
}

export function PlanDistributionChart({ data }: PlanDistributionChartProps) {
  const chartData = [
    { name: "free", value: data.free, label: "Free", color: "var(--chart-1)" },
    { name: "deluxe", value: data.deluxe, label: "Deluxe", color: "var(--chart-2)" },
    { name: "oneTime", value: data.oneTime, label: "One-Time", color: "var(--chart-3)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Distribution</CardTitle>
        <CardDescription>Accounts by plan type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => 
                `${chartConfig[name as keyof typeof chartConfig].label} ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          {chartData.map((plan) => (
            <div key={plan.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: plan.color }} />
                <span className="text-muted-foreground">{plan.label}</span>
              </div>
              <span className="font-medium">{plan.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

