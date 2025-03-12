"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Define user roles
export type UserRole = "admin" | "manager" | "staff"

// Define user type
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  status?: string
  lastActive?: string
}

// Sample initial users for demo
const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@pos.com",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Active",
    lastActive: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@pos.com",
    role: "manager",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Active",
    lastActive: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Staff User",
    email: "staff@pos.com",
    role: "staff",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "Active",
    lastActive: new Date().toISOString(),
  },
]

// Define passwords (in a real app, these would be hashed and stored in a database)
const INITIAL_PASSWORDS: Record<string, string> = {
  "admin@pos.com": "admin123",
  "manager@pos.com": "manager123",
  "staff@pos.com": "staff123",
  "info@pos.com": "12345678", // Keep the original credentials
}

// Define the context type
interface AuthContextType {
  user: User | null
  users: User[]
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  addUser: (user: Omit<User, "id" | "lastActive" | "status">, password: string) => Promise<boolean>
  updateUser: (user: User) => Promise<boolean>
  deleteUser: (userId: string) => Promise<boolean>
  getUsers: () => User[]
  getPasswords: () => Record<string, string>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Create the provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [passwords, setPasswords] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Initialize users and passwords
  useEffect(() => {
    // Load users from localStorage or use initial users
    const storedUsers = localStorage.getItem("pos_users")
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers))
      } catch (error) {
        console.error("Failed to parse stored users:", error)
        setUsers(INITIAL_USERS)
        localStorage.setItem("pos_users", JSON.stringify(INITIAL_USERS))
      }
    } else {
      setUsers(INITIAL_USERS)
      localStorage.setItem("pos_users", JSON.stringify(INITIAL_USERS))
    }

    // Load passwords from localStorage or use initial passwords
    const storedPasswords = localStorage.getItem("pos_passwords")
    if (storedPasswords) {
      try {
        setPasswords(JSON.parse(storedPasswords))
      } catch (error) {
        console.error("Failed to parse stored passwords:", error)
        setPasswords(INITIAL_PASSWORDS)
        localStorage.setItem("pos_passwords", JSON.stringify(INITIAL_PASSWORDS))
      }
    } else {
      setPasswords(INITIAL_PASSWORDS)
      localStorage.setItem("pos_passwords", JSON.stringify(INITIAL_PASSWORDS))
    }
  }, [])

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("pos_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("pos_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = pathname === "/login"

      if (!user && !isAuthRoute) {
        router.push("/login")
      } else if (user && isAuthRoute) {
        router.push("/")
      }
    }
  }, [user, isLoading, pathname, router])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check credentials
    if (passwords[email] === password) {
      // Find the user
      const foundUser =
        email === "info@pos.com"
          ? {
              id: "admin-legacy",
              name: "Admin User",
              email: "info@pos.com",
              role: "admin" as UserRole,
              avatar: "/placeholder.svg?height=32&width=32",
              status: "Active",
              lastActive: new Date().toISOString(),
            }
          : users.find((u) => u.email === email)

      if (foundUser) {
        // Update last active time
        const updatedUser = {
          ...foundUser,
          lastActive: new Date().toISOString(),
        }

        // Update in users array if not the legacy admin
        if (email !== "info@pos.com") {
          const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
          setUsers(updatedUsers)
          localStorage.setItem("pos_users", JSON.stringify(updatedUsers))
        }

        setUser(updatedUser)
        localStorage.setItem("pos_user", JSON.stringify(updatedUser))

        toast({
          title: "Login successful",
          description: `Welcome back, ${updatedUser.name}!`,
        })

        setIsLoading(false)
        return true
      }
    }

    setIsLoading(false)
    return false
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("pos_user")
    router.push("/login")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  // Add user function
  const addUser = async (newUser: Omit<User, "id" | "lastActive" | "status">, password: string): Promise<boolean> => {
    // Check if email already exists
    if (users.some((u) => u.email === newUser.email) || newUser.email === "info@pos.com") {
      toast({
        title: "Error",
        description: "A user with this email already exists",
        variant: "destructive",
      })
      return false
    }

    // Create user with ID and timestamps
    const userToAdd: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      lastActive: new Date().toISOString(),
      status: "Active",
    }

    // Add user to state and localStorage
    const updatedUsers = [...users, userToAdd]
    setUsers(updatedUsers)
    localStorage.setItem("pos_users", JSON.stringify(updatedUsers))

    // Add password to passwords object
    const updatedPasswords = { ...passwords, [newUser.email]: password }
    setPasswords(updatedPasswords)
    localStorage.setItem("pos_passwords", JSON.stringify(updatedPasswords))

    toast({
      title: "User added",
      description: `${userToAdd.name} has been added successfully`,
    })

    return true
  }

  // Update user function
  const updateUser = async (updatedUser: User): Promise<boolean> => {
    // Find user index
    const userIndex = users.findIndex((u) => u.id === updatedUser.id)

    if (userIndex === -1) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      })
      return false
    }

    // Update user in state and localStorage
    const updatedUsers = [...users]
    updatedUsers[userIndex] = updatedUser
    setUsers(updatedUsers)
    localStorage.setItem("pos_users", JSON.stringify(updatedUsers))

    // Update current user if it's the same user
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser)
      localStorage.setItem("pos_user", JSON.stringify(updatedUser))
    }

    toast({
      title: "User updated",
      description: `${updatedUser.name} has been updated successfully`,
    })

    return true
  }

  // Delete user function
  const deleteUser = async (userId: string): Promise<boolean> => {
    // Find user
    const userToDelete = users.find((u) => u.id === userId)

    if (!userToDelete) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      })
      return false
    }

    // Remove user from state and localStorage
    const updatedUsers = users.filter((u) => u.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem("pos_users", JSON.stringify(updatedUsers))

    // Remove password
    const { [userToDelete.email]: _, ...updatedPasswords } = passwords
    setPasswords(updatedPasswords)
    localStorage.setItem("pos_passwords", JSON.stringify(updatedPasswords))

    toast({
      title: "User deleted",
      description: `${userToDelete.name} has been deleted successfully`,
    })

    return true
  }

  // Get all users
  const getUsers = () => users

  // Get all passwords (for demo purposes only)
  const getPasswords = () => passwords

  const value = {
    user,
    users,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    addUser,
    updateUser,
    deleteUser,
    getUsers,
    getPasswords,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

