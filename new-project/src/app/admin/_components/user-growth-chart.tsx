"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  free: {
    label: "Free",
    color: "var(--chart-1)",
  },
  deluxe: {
    label: "Deluxe",
    color: "var(--chart-2)",
  },
  oneTime: {
    label: "One-Time",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

interface UserGrowthChartProps {
  data: Array<{
    date: string
    free: number
    deluxe: number
    oneTime: number
    total: number
  }>
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth by Plan Type</CardTitle>
        <CardDescription>Account distribution across plans</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="free" fill="var(--color-free)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="deluxe" fill="var(--color-deluxe)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="oneTime" fill="var(--color-oneTime)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

