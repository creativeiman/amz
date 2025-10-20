"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  mrr: {
    label: "Total MRR",
    color: "var(--chart-1)",
  },
  newRevenue: {
    label: "New Revenue",
    color: "var(--chart-2)",
  },
  churnRevenue: {
    label: "Churned",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

interface MRRChartProps {
  data: Array<{
    month: string
    mrr: number
    newRevenue: number
    churnRevenue: number
  }>
}

export function MRRChart({ data }: MRRChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>MRR Growth & Churn</CardTitle>
        <CardDescription>Monthly recurring revenue trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillMRR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mrr)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mrr)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area 
              dataKey="mrr" 
              type="monotone" 
              fill="url(#fillMRR)" 
              stroke="var(--color-mrr)" 
              stackId="1"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

