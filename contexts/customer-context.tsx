"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define customer type
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  createdAt: string
  updatedAt: string
}

// Empty initial customers
const INITIAL_CUSTOMERS: Customer[] = []

// Define context type
interface CustomerContextType {
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateCustomer: (customer: Customer) => Promise<boolean>
  deleteCustomer: (customerId: string) => Promise<boolean>
  getCustomer: (customerId: string) => Customer | undefined
}

// Create the context
const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

// Provider props
interface CustomerProviderProps {
  children: ReactNode
}

// Create the provider component
export function CustomerProvider({ children }: CustomerProviderProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const { toast } = useToast()

  // Initialize customers
  useEffect(() => {
    // Load customers from localStorage or use empty array
    const storedCustomers = localStorage.getItem("pos_customers")
    if (storedCustomers) {
      try {
        setCustomers(JSON.parse(storedCustomers))
      } catch (error) {
        console.error("Failed to parse stored customers:", error)
        setCustomers(INITIAL_CUSTOMERS)
        localStorage.setItem("pos_customers", JSON.stringify(INITIAL_CUSTOMERS))
      }
    } else {
      setCustomers(INITIAL_CUSTOMERS)
      localStorage.setItem("pos_customers", JSON.stringify(INITIAL_CUSTOMERS))
    }
  }, [])

  // Add customer function
  const addCustomer = async (newCustomer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    // Check if email already exists
    if (customers.some((c) => c.email === newCustomer.email)) {
      toast({
        title: "Error",
        description: "A customer with this email already exists",
        variant: "destructive",
      })
      return false
    }

    // Create customer with ID and timestamps
    const customerToAdd: Customer = {
      ...newCustomer,
      id: `customer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add customer to state and localStorage
    const updatedCustomers = [...customers, customerToAdd]
    setCustomers(updatedCustomers)
    localStorage.setItem("pos_customers", JSON.stringify(updatedCustomers))

    toast({
      title: "Customer added",
      description: `${customerToAdd.name} has been added successfully`,
    })

    return true
  }

  // Update customer function
  const updateCustomer = async (updatedCustomer: Customer): Promise<boolean> => {
    // Find customer index
    const customerIndex = customers.findIndex((c) => c.id === updatedCustomer.id)

    if (customerIndex === -1) {
      toast({
        title: "Error",
        description: "Customer not found",
        variant: "destructive",
      })
      return false
    }

    // Check if email already exists on another customer
    if (customers.some((c) => c.email === updatedCustomer.email && c.id !== updatedCustomer.id)) {
      toast({
        title: "Error",
        description: "Another customer with this email already exists",
        variant: "destructive",
      })
      return false
    }

    // Update customer with new timestamp
    const customerToUpdate = {
      ...updatedCustomer,
      updatedAt: new Date().toISOString(),
    }

    // Update customer in state and localStorage
    const updatedCustomers = [...customers]
    updatedCustomers[customerIndex] = customerToUpdate
    setCustomers(updatedCustomers)
    localStorage.setItem("pos_customers", JSON.stringify(updatedCustomers))

    toast({
      title: "Customer updated",
      description: `${customerToUpdate.name} has been updated successfully`,
    })

    return true
  }

  // Delete customer function
  const deleteCustomer = async (customerId: string): Promise<boolean> => {
    // Find customer
    const customerToDelete = customers.find((c) => c.id === customerId)

    if (!customerToDelete) {
      toast({
        title: "Error",
        description: "Customer not found",
        variant: "destructive",
      })
      return false
    }

    // Remove customer from state and localStorage
    const updatedCustomers = customers.filter((c) => c.id !== customerId)
    setCustomers(updatedCustomers)
    localStorage.setItem("pos_customers", JSON.stringify(updatedCustomers))

    toast({
      title: "Customer deleted",
      description: `${customerToDelete.name} has been deleted successfully`,
    })

    return true
  }

  // Get customer by ID
  const getCustomer = (customerId: string) => {
    return customers.find((c) => c.id === customerId)
  }

  const value = {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
  }

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

// Custom hook to use the customer context
export function useCustomers() {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error("useCustomers must be used within a CustomerProvider")
  }
  return context
}

