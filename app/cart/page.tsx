"use client"

import type React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { CartItem } from "@/components/cart-item"
import { useCart } from "@/hooks/use-cart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { POSKeypad } from "@/components/pos-keypad"
import { POSProductGrid } from "@/components/pos-product-grid"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOrders } from "@/contexts/order-context"
import { PrintReceipt } from "@/components/print-receipt"
import { PrintButton } from "@/components/print-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCustomers } from "@/contexts/customer-context"

export default function CartPage() {
  const { cart, total, clearCart, taxRate, setTaxRate } = useCart()
  const { addOrder } = useOrders()
  const { customers } = useCustomers()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [selectedCustomer, setSelectedCustomer] = useState("walk-in")
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const receiptRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    // Calculate tax amount and total with tax
    const taxAmount = total * (taxRate / 100)
    const totalWithTax = total + taxAmount

    // Get customer name
    const customerName =
      selectedCustomer === "walk-in"
        ? "Walk-in Customer"
        : customers.find((c) => c.id === selectedCustomer)?.name || "Walk-in Customer"

    try {
      // Create order
      const order = await addOrder({
        items: [...cart],
        customer: customerName,
        total: totalWithTax,
        subtotal: total,
        tax: taxAmount,
        taxRate: taxRate,
        paymentMethod: paymentMethod,
      })

      setCurrentOrder(order)
      setIsCheckingOut(false)
      setShowReceipt(true)
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
      setIsCheckingOut(false)
    }
  }

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value) && value >= 0) {
      setTaxRate(value)
    }
  }

  const handleAfterPrint = () => {
    setShowReceipt(false)
    clearCart()
    router.push("/orders")
  }

  // Calculate tax amount and total with tax
  const taxAmount = total * (taxRate / 100)
  const totalWithTax = total + taxAmount

  return (
    <DashboardShell>
      <DashboardHeader heading="Point of Sale" text="Process sales and checkout" />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <Tabs defaultValue="grid" className="h-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="grid">Product Grid</TabsTrigger>
                  <TabsTrigger value="keypad">Keypad</TabsTrigger>
                </TabsList>
                <TabsContent value="grid" className="h-[calc(100%-40px)]">
                  <POSProductGrid />
                </TabsContent>
                <TabsContent value="keypad" className="h-[calc(100%-40px)]">
                  <POSKeypad />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Current Sale</CardTitle>
              <CardDescription>
                Items: {cart.length} | Total: Rs{total.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground mb-4">No items in cart</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t pt-4">
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Walk-in Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Tax</span>
                      <div className="w-16">
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={taxRate}
                          onChange={handleTaxRateChange}
                          className="h-6 px-2 py-1 text-xs"
                        />
                      </div>
                      <span>%</span>
                    </div>
                    <span>Rs{taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rs{totalWithTax.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" onClick={clearCart} disabled={cart.length === 0}>
                  Clear
                </Button>
                <Button onClick={handleCheckout} disabled={isCheckingOut || cart.length === 0}>
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Completed</DialogTitle>
            <DialogDescription>Your order has been processed successfully.</DialogDescription>
          </DialogHeader>

          <div className="hidden">
            <PrintReceipt ref={receiptRef} order={currentOrder} />
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowReceipt(false)
                clearCart()
                router.push("/orders")
              }}
            >
              Close
            </Button>
            <PrintButton contentRef={receiptRef} onAfterPrint={handleAfterPrint}>
              Print Receipt
            </PrintButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

