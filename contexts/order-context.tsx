"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { CartItemType } from "@/types/cart"

// Define order type
export interface Order {
  id: string
  items: CartItemType[]
  customer: string
  date: string
  total: number
  subtotal: number
  tax: number
  taxRate: number
  status: "Pending" | "Completed" | "Cancelled"
  paymentMethod: string
}

// Define context type
interface OrderContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => Promise<Order>
  getOrder: (orderId: string) => Order | undefined
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<boolean>
  deleteOrder: (orderId: string) => Promise<boolean>
}

// Create the context
const OrderContext = createContext<OrderContextType | undefined>(undefined)

// Provider props
interface OrderProviderProps {
  children: ReactNode
}

// Create the provider component
export function OrderProvider({ children }: OrderProviderProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const { toast } = useToast()

  // Initialize orders
  useEffect(() => {
    // Load orders from localStorage
    try {
      const storedOrders = localStorage.getItem("pos_orders")
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders))
      } else {
        setOrders([])
        localStorage.setItem("pos_orders", JSON.stringify([]))
      }
    } catch (error) {
      console.error("Failed to load orders from localStorage:", error)
      setOrders([])
      localStorage.setItem("pos_orders", JSON.stringify([]))
    }
  }, [])

  // Add order function
  const addOrder = async (newOrder: Omit<Order, "id" | "date" | "status">): Promise<Order> => {
    try {
      // Create order with ID and date
      const orderToAdd: Order = {
        ...newOrder,
        id: `ORD-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        status: "Completed",
      }

      // Add order to state
      const updatedOrders = [orderToAdd, ...orders]
      setOrders(updatedOrders)

      // Save to localStorage
      localStorage.setItem("pos_orders", JSON.stringify(updatedOrders))

      toast({
        title: "Order created",
        description: `Order ${orderToAdd.id} has been created successfully`,
      })

      return orderToAdd
    } catch (error) {
      console.error("Error adding order:", error)
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Get order by ID
  const getOrder = (orderId: string) => {
    return orders.find((o) => o.id === orderId)
  }

  // Update order status
  const updateOrderStatus = async (orderId: string, status: Order["status"]): Promise<boolean> => {
    try {
      const orderIndex = orders.findIndex((o) => o.id === orderId)

      if (orderIndex === -1) {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive",
        })
        return false
      }

      // Update order status
      const updatedOrders = [...orders]
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        status,
      }

      setOrders(updatedOrders)

      // Save to localStorage
      localStorage.setItem("pos_orders", JSON.stringify(updatedOrders))

      toast({
        title: "Order updated",
        description: `Order #${orderId} status has been updated to ${status}`,
      })

      return true
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  // Delete order
  const deleteOrder = async (orderId: string): Promise<boolean> => {
    try {
      const orderToDelete = orders.find((o) => o.id === orderId)

      if (!orderToDelete) {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive",
        })
        return false
      }

      // Remove order from state
      const updatedOrders = orders.filter((o) => o.id !== orderId)
      setOrders(updatedOrders)

      // Save to localStorage
      localStorage.setItem("pos_orders", JSON.stringify(updatedOrders))

      toast({
        title: "Order deleted",
        description: `Order #${orderId} has been deleted successfully`,
      })

      return true
    } catch (error) {
      console.error("Error deleting order:", error)
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const value = {
    orders,
    addOrder,
    getOrder,
    updateOrderStatus,
    deleteOrder,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

// Custom hook to use the order context
export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}

