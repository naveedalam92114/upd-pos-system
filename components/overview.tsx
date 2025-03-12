"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import { useOrders } from "@/contexts/order-context"

export function Overview() {
  const { orders } = useOrders()
  const [data, setData] = useState<{ name: string; total: number }[]>([])

  useEffect(() => {
    // Generate monthly data based on actual orders
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentYear = new Date().getFullYear()

    // Initialize monthly totals with zero
    const monthlyTotals = months.map((month) => ({ name: month, total: 0 }))

    // Calculate totals from actual orders
    orders.forEach((order) => {
      const orderDate = new Date(order.date)
      // Only include orders from current year
      if (orderDate.getFullYear() === currentYear) {
        const monthIndex = orderDate.getMonth()
        monthlyTotals[monthIndex].total += order.total
      }
    })

    setData(monthlyTotals)
  }, [orders])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rs${value}`}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

