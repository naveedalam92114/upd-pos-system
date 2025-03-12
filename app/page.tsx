"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CreditCard, DollarSign, Users } from "lucide-react"
import { useOrders } from "@/contexts/order-context"
import { useCustomers } from "@/contexts/customer-context"
import { useMemo } from "react"

export default function DashboardPage() {
  const { orders } = useOrders()
  const { customers } = useCustomers()

  // Calculate total revenue from all orders
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.total, 0)
  }, [orders])

  // Calculate total number of sales (orders)
  const totalSales = orders.length

  // Calculate number of unique customers who have placed orders
  const activeCustomers = useMemo(() => {
    const uniqueCustomers = new Set(orders.map((order) => order.customer))
    return uniqueCustomers.size
  }, [orders])

  // Calculate daily sales (orders made today)
  const dailySales = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return orders.filter((order) => {
      const orderDate = new Date(order.date)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    }).length
  }, [orders])

  // Calculate revenue change percentage (last 30 days vs previous 30 days)
  const revenueChange = useMemo(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sixtyDaysAgo = new Date(today)
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const last30DaysRevenue = orders
      .filter((order) => new Date(order.date) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + order.total, 0)

    const previous30DaysRevenue = orders
      .filter((order) => {
        const orderDate = new Date(order.date)
        return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo
      })
      .reduce((sum, order) => sum + order.total, 0)

    if (previous30DaysRevenue === 0) return 0
    return ((last30DaysRevenue - previous30DaysRevenue) / previous30DaysRevenue) * 100
  }, [orders])

  // Calculate sales change percentage
  const salesChange = useMemo(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sixtyDaysAgo = new Date(today)
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const last30DaysSales = orders.filter((order) => new Date(order.date) >= thirtyDaysAgo).length

    const previous30DaysSales = orders.filter((order) => {
      const orderDate = new Date(order.date)
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo
    }).length

    if (previous30DaysSales === 0) return 0
    return ((last30DaysSales - previous30DaysSales) / previous30DaysSales) * 100
  }, [orders])

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your store's performance" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs{totalRevenue.toFixed(2)}</div>
            {revenueChange !== 0 && (
              <p className="text-xs text-muted-foreground">
                {revenueChange > 0 ? "+" : ""}
                {revenueChange.toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            {salesChange !== 0 && (
              <p className="text-xs text-muted-foreground">
                {salesChange > 0 ? "+" : ""}
                {salesChange.toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">{customers.length} total registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{dailySales}</div>
            <p className="text-xs text-muted-foreground">Orders today</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made {totalSales} sales total</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>Detailed breakdown of your sales performance</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best selling products</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

