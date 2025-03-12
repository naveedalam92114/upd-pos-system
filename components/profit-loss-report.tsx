"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useState } from "react"
import { useOrders } from "@/contexts/order-context"
import { useExpenses } from "@/contexts/expense-context"
import { useMemo } from "react"

export function ProfitLossReport() {
  const [period, setPeriod] = useState("monthly")
  const { orders } = useOrders()
  const { expenses } = useExpenses()

  // Process financial data by month
  const plData = useMemo(() => {
    // Helper to get month name
    const getMonthName = (date: Date) => {
      return date.toLocaleString("default", { month: "long" })
    }

    // Create a map to aggregate data by month
    const dataByMonth = new Map()

    // Process orders (revenue)
    orders.forEach((order) => {
      const date = new Date(order.date)
      const monthYear = `${getMonthName(date)} ${date.getFullYear()}`

      if (!dataByMonth.has(monthYear)) {
        dataByMonth.set(monthYear, {
          month: monthYear,
          revenue: 0,
          cogs: 0,
          expenses: 0,
          profit: 0,
        })
      }

      const monthData = dataByMonth.get(monthYear)
      monthData.revenue += order.total
      // Estimate COGS as 40% of revenue for simplicity
      monthData.cogs += order.total * 0.4
      dataByMonth.set(monthYear, monthData)
    })

    // Process expenses
    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const monthYear = `${getMonthName(date)} ${date.getFullYear()}`

      if (!dataByMonth.has(monthYear)) {
        dataByMonth.set(monthYear, {
          month: monthYear,
          revenue: 0,
          cogs: 0,
          expenses: 0,
          profit: 0,
        })
      }

      const monthData = dataByMonth.get(monthYear)
      monthData.expenses += expense.amount
      dataByMonth.set(monthYear, monthData)
    })

    // Calculate profit for each month
    dataByMonth.forEach((value, key) => {
      value.profit = value.revenue - value.cogs - value.expenses
      dataByMonth.set(key, value)
    })

    // Convert to array and sort by date (assuming month names are in chronological order)
    return Array.from(dataByMonth.values())
  }, [orders, expenses])

  // Chart data
  const chartData = useMemo(() => {
    return plData.map((item) => ({
      name: item.month,
      revenue: item.revenue,
      profit: item.profit,
    }))
  }, [plData])

  // Calculate totals
  const totalRevenue = useMemo(() => plData.reduce((sum, item) => sum + item.revenue, 0), [plData])
  const totalCOGS = useMemo(() => plData.reduce((sum, item) => sum + item.cogs, 0), [plData])
  const totalExpenses = useMemo(() => plData.reduce((sum, item) => sum + item.expenses, 0), [plData])
  const totalProfit = useMemo(() => plData.reduce((sum, item) => sum + item.profit, 0), [plData])
  const profitMargin = useMemo(
    () => (totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0),
    [totalProfit, totalRevenue],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total COGS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs{totalCOGS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{profitMargin.toFixed(1)}% margin</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue & Profit Trends</CardTitle>
          <CardDescription>Monthly revenue and profit performance</CardDescription>
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
                    tickFormatter={(value) => `Rs${value / 1000}k`}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No financial data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
          <CardDescription>Detailed monthly breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>COGS</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No financial data available
                  </TableCell>
                </TableRow>
              ) : (
                plData.map((item) => (
                  <TableRow key={item.month}>
                    <TableCell className="font-medium">{item.month}</TableCell>
                    <TableCell>Rs{item.revenue.toFixed(2)}</TableCell>
                    <TableCell>Rs{item.cogs.toFixed(2)}</TableCell>
                    <TableCell>Rs{item.expenses.toFixed(2)}</TableCell>
                    <TableCell>Rs{item.profit.toFixed(2)}</TableCell>
                    <TableCell>{item.revenue > 0 ? ((item.profit / item.revenue) * 100).toFixed(1) : 0}%</TableCell>
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

