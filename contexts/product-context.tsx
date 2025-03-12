"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define product type
export interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  sku: string
  description?: string
  createdAt: string
  updatedAt: string
}

// Empty initial products array
const INITIAL_PRODUCTS: Product[] = []

// Define medicine categories
export const MEDICINE_CATEGORIES = [
  "Pain Relief",
  "Antibiotics",
  "Allergy",
  "Digestive Health",
  "Cardiovascular",
  "Diabetes",
  "Hormones",
  "Respiratory",
  "Vitamins & Supplements",
  "First Aid",
  "Skin Care",
  "Eye Care",
  "Other",
]

// Define context type
interface ProductContextType {
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateProduct: (product: Product) => Promise<boolean>
  deleteProduct: (productId: string) => Promise<boolean>
  getProduct: (productId: string) => Product | undefined
  getCategories: () => string[]
}

// Create the context
const ProductContext = createContext<ProductContextType | undefined>(undefined)

// Provider props
interface ProductProviderProps {
  children: ReactNode
}

// Create the provider component
export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([])
  const { toast } = useToast()

  // Initialize products
  useEffect(() => {
    // Load products from localStorage or use empty array
    const storedProducts = localStorage.getItem("pos_products")
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts))
      } catch (error) {
        console.error("Failed to parse stored products:", error)
        setProducts(INITIAL_PRODUCTS)
        localStorage.setItem("pos_products", JSON.stringify(INITIAL_PRODUCTS))
      }
    } else {
      setProducts(INITIAL_PRODUCTS)
      localStorage.setItem("pos_products", JSON.stringify(INITIAL_PRODUCTS))
    }
  }, [])

  // Add product function
  const addProduct = async (newProduct: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    // Check if SKU already exists
    if (products.some((p) => p.sku === newProduct.sku)) {
      toast({
        title: "Error",
        description: "A product with this SKU already exists",
        variant: "destructive",
      })
      return false
    }

    // Create product with ID and timestamps
    const productToAdd: Product = {
      ...newProduct,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add product to state and localStorage
    const updatedProducts = [...products, productToAdd]
    setProducts(updatedProducts)
    localStorage.setItem("pos_products", JSON.stringify(updatedProducts))

    toast({
      title: "Product added",
      description: `${productToAdd.name} has been added successfully`,
    })

    return true
  }

  // Update product function
  const updateProduct = async (updatedProduct: Product): Promise<boolean> => {
    // Find product index
    const productIndex = products.findIndex((p) => p.id === updatedProduct.id)

    if (productIndex === -1) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      })
      return false
    }

    // Check if SKU already exists on another product
    if (products.some((p) => p.sku === updatedProduct.sku && p.id !== updatedProduct.id)) {
      toast({
        title: "Error",
        description: "Another product with this SKU already exists",
        variant: "destructive",
      })
      return false
    }

    // Update product with new timestamp
    const productToUpdate = {
      ...updatedProduct,
      updatedAt: new Date().toISOString(),
    }

    // Update product in state and localStorage
    const updatedProducts = [...products]
    updatedProducts[productIndex] = productToUpdate
    setProducts(updatedProducts)
    localStorage.setItem("pos_products", JSON.stringify(updatedProducts))

    toast({
      title: "Product updated",
      description: `${productToUpdate.name} has been updated successfully`,
    })

    return true
  }

  // Delete product function
  const deleteProduct = async (productId: string): Promise<boolean> => {
    // Find product
    const productToDelete = products.find((p) => p.id === productId)

    if (!productToDelete) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      })
      return false
    }

    // Remove product from state and localStorage
    const updatedProducts = products.filter((p) => p.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem("pos_products", JSON.stringify(updatedProducts))

    toast({
      title: "Product deleted",
      description: `${productToDelete.name} has been deleted successfully`,
    })

    return true
  }

  // Get product by ID
  const getProduct = (productId: string) => {
    return products.find((p) => p.id === productId)
  }

  // Get all categories
  const getCategories = () => {
    return MEDICINE_CATEGORIES
  }

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getCategories,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

// Custom hook to use the product context
export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}

