"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItemType } from "@/types/cart"

interface CartState {
  cart: CartItemType[]
  total: number
  taxRate: number
  addToCart: (item: CartItemType) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setTaxRate: (rate: number) => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      total: 0,
      taxRate: 7, // Default tax rate of 7%
      addToCart: (item) => {
        const { cart } = get()
        const existingItem = cart.find((i) => i.id === item.id)

        if (existingItem) {
          const updatedCart = cart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))

          set({
            cart: updatedCart,
            total: calculateTotal(updatedCart),
          })
        } else {
          const updatedCart = [...cart, item]

          set({
            cart: updatedCart,
            total: calculateTotal(updatedCart),
          })
        }
      },
      removeFromCart: (id) => {
        const { cart } = get()
        const updatedCart = cart.filter((item) => item.id !== id)

        set({
          cart: updatedCart,
          total: calculateTotal(updatedCart),
        })
      },
      updateQuantity: (id, quantity) => {
        const { cart } = get()
        const updatedCart = cart.map((item) => (item.id === id ? { ...item, quantity } : item))

        set({
          cart: updatedCart,
          total: calculateTotal(updatedCart),
        })
      },
      clearCart: () => {
        set({ cart: [], total: 0 })
      },
      setTaxRate: (rate) => {
        set({ taxRate: rate })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

function calculateTotal(cart: CartItemType[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

