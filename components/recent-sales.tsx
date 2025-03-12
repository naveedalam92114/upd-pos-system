"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useOrders } from "@/contexts/order-context"
import { useEffect, useState } from "react"

export function RecentSales() {
  const { orders } = useOrders()
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    // Get the 5 most recent orders
    const sortedOrders = [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        customer: order.customer,
        amount: order.total,
      }))

    setRecentOrders(sortedOrders)
  }, [orders])

  // If no orders yet, show empty state
  if (recentOrders.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No recent sales to display</div>
  }

  return (
    <div className="space-y-8">
      {recentOrders.map((order, index) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
            <AvatarFallback>{order.customer.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer}</p>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
          </div>
          <div className="ml-auto font-medium">+Rs{order.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}

