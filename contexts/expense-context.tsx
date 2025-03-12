"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define expense type
export interface Expense {
  id: string
  date: string
  category: string
  amount: number
  paymentMethod: string
  description: string
  status: "Paid" | "Pending"
  createdAt: string
  updatedAt: string
}

// Define expense categories
export const EXPENSE_CATEGORIES = [
  "Rent",
  "Utilities",
  "Inventory",
  "Salaries",
  "Marketing",
  "Equipment",
  "Maintenance",
  "Insurance",
  "Taxes",
  "Office Supplies",
  "Travel",
  "Other",
]

// Define payment methods
export const PAYMENT_METHODS = ["Cash", "Credit Card", "Bank Transfer", "Check", "Mobile Payment", "Other"]

// Empty initial expenses
const INITIAL_EXPENSES: Expense[] = []

// Define context type
interface ExpenseContextType {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateExpense: (expense: Expense) => Promise<boolean>
  deleteExpense: (expenseId: string) => Promise<boolean>
  getExpense: (expenseId: string) => Expense | undefined
  getCategories: () => string[]
  getPaymentMethods: () => string[]
}

// Create the context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

// Provider props
interface ExpenseProviderProps {
  children: ReactNode
}

// Create the provider component
export function ExpenseProvider({ children }: ExpenseProviderProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const { toast } = useToast()

  // Initialize expenses
  useEffect(() => {
    // Load expenses from localStorage or use empty array
    const storedExpenses = localStorage.getItem("pos_expenses")
    if (storedExpenses) {
      try {
        setExpenses(JSON.parse(storedExpenses))
      } catch (error) {
        console.error("Failed to parse stored expenses:", error)
        setExpenses(INITIAL_EXPENSES)
        localStorage.setItem("pos_expenses", JSON.stringify(INITIAL_EXPENSES))
      }
    } else {
      setExpenses(INITIAL_EXPENSES)
      localStorage.setItem("pos_expenses", JSON.stringify(INITIAL_EXPENSES))
    }
  }, [])

  // Add expense function
  const addExpense = async (newExpense: Omit<Expense, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    // Create expense with ID and timestamps
    const expenseToAdd: Expense = {
      ...newExpense,
      id: `EXP-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add expense to state and localStorage
    const updatedExpenses = [expenseToAdd, ...expenses]
    setExpenses(updatedExpenses)
    localStorage.setItem("pos_expenses", JSON.stringify(updatedExpenses))

    toast({
      title: "Expense added",
      description: `Expense #${expenseToAdd.id} has been added successfully`,
    })

    return true
  }

  // Update expense function
  const updateExpense = async (updatedExpense: Expense): Promise<boolean> => {
    // Find expense index
    const expenseIndex = expenses.findIndex((e) => e.id === updatedExpense.id)

    if (expenseIndex === -1) {
      toast({
        title: "Error",
        description: "Expense not found",
        variant: "destructive",
      })
      return false
    }

    // Update expense with new timestamp
    const expenseToUpdate = {
      ...updatedExpense,
      updatedAt: new Date().toISOString(),
    }

    // Update expense in state and localStorage
    const updatedExpenses = [...expenses]
    updatedExpenses[expenseIndex] = expenseToUpdate
    setExpenses(updatedExpenses)
    localStorage.setItem("pos_expenses", JSON.stringify(updatedExpenses))

    toast({
      title: "Expense updated",
      description: `Expense #${expenseToUpdate.id} has been updated successfully`,
    })

    return true
  }

  // Delete expense function
  const deleteExpense = async (expenseId: string): Promise<boolean> => {
    // Find expense
    const expenseToDelete = expenses.find((e) => e.id === expenseId)

    if (!expenseToDelete) {
      toast({
        title: "Error",
        description: "Expense not found",
        variant: "destructive",
      })
      return false
    }

    // Remove expense from state and localStorage
    const updatedExpenses = expenses.filter((e) => e.id !== expenseId)
    setExpenses(updatedExpenses)
    localStorage.setItem("pos_expenses", JSON.stringify(updatedExpenses))

    toast({
      title: "Expense deleted",
      description: `Expense #${expenseId} has been deleted successfully`,
    })

    return true
  }

  // Get expense by ID
  const getExpense = (expenseId: string) => {
    return expenses.find((e) => e.id === expenseId)
  }

  // Get all categories
  const getCategories = () => {
    return EXPENSE_CATEGORIES
  }

  // Get all payment methods
  const getPaymentMethods = () => {
    return PAYMENT_METHODS
  }

  const value = {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,
    getCategories,
    getPaymentMethods,
  }

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

// Custom hook to use the expense context
export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider")
  }
  return context
}

