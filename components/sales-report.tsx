"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useOrders } from "@/contexts/order-context"
import { useMemo } from "react"

export function SalesReport() {
  const [period, setPeriod] = useState("weekly")
  const { orders } = useOrders()

  // Process orders to create sales data by date
  const salesData = useMemo(() => {
    // Create a map to aggregate sales by date
    const salesByDate = new Map()

    orders.forEach((order) => {
      const date = new Date(order.date).toISOString().split("T")[0] // YYYY-MM-DD

      if (!salesByDate.has(date)) {
        salesByDate.set(date, {
          date,
          sales: 0,
          orders: 0,
          avgOrderValue: 0,
        })
      }

      const dateData = salesByDate.get(date)
      dateData.sales += order.total
      dateData.orders += 1
      salesByDate.set(date, dateData)
    })

    // Calculate average order value and convert to array
    const result = Array.from(salesByDate.values()).map((item) => ({
      ...item,
      avgOrderValue: item.sales / item.orders,
    }))

    // Sort by date (newest first)
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [orders])

  // Prepare chart data
  const chartData = useMemo(() => {
    return salesData
      .slice(0, 14)
      .reverse()
      .map((item) => ({
        name: formatDate(item.date),
        sales: item.sales,
      }))
  }, [salesData])

  // Format date for display
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange className="w-auto" />
        </div>

        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>View your sales performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rs${value}`}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No sales data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Details</CardTitle>
          <CardDescription>Detailed breakdown of sales by date</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Avg. Order Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No sales data available
                  </TableCell>
                </TableRow>
              ) : (
                salesData.map((item) => (
                  <TableRow key={item.date}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>Rs{item.sales.toFixed(2)}</TableCell>
                    <TableCell>{item.orders}</TableCell>
                    <TableCell>Rs{item.avgOrderValue.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

