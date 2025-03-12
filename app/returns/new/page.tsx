"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useReturns, RETURN_REASONS } from "@/contexts/return-context"
import { useOrders } from "@/contexts/order-context"
import { useCustomers } from "@/contexts/customer-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewReturnPage() {
  const [orderId, setOrderId] = useState("")
  const [customer, setCustomer] = useState("")
  const [reason, setReason] = useState("")
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  const { addReturn } = useReturns()
  const { orders } = useOrders()
  const { customers } = useCustomers()
  const { toast } = useToast()
  const router = useRouter()

  // Get the selected order
  const selectedOrder = orders.find((o) => o.id === orderId)

  // Calculate the total amount for selected items
  const calculateAmount = () => {
    if (!selectedOrder) return 0

    return selectedOrder.items.reduce((total, item) => {
      if (selectedItems[item.id]) {
        return total + item.price * item.quantity
      }
      return total
    }, 0)
  }

  // Get the selected items
  const getSelectedItems = () => {
    if (!selectedOrder) return []

    return selectedOrder.items.filter((item) => selectedItems[item.id])
  }

  // Auto-select customer when order is selected
  useEffect(() => {
    if (selectedOrder && !customer) {
      setCustomer(selectedOrder.customer)
    }
  }, [orderId, selectedOrder, customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!orderId || !customer || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Check if any items are selected
    const returnItems = getSelectedItems()
    if (returnItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item to return",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Add return
      const success = await addReturn({
        orderId,
        customer,
        date: new Date().toISOString(),
        items: returnItems,
        amount: calculateAmount(),
        reason,
        status: "Processing",
      })

      setIsLoading(false)

      if (success) {
        toast({
          title: "Return processed",
          description: "The return has been processed successfully",
        })
        router.push("/returns")
      }
    } catch (error) {
      console.error("Error processing return:", error)
      toast({
        title: "Error",
        description: "There was an error processing the return",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Handle item selection
  const handleItemSelect = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: checked,
    }))
  }

  // Handle select all items
  const handleSelectAll = (checked: boolean) => {
    if (!selectedOrder) return

    const newSelectedItems: Record<string, boolean> = {}
    selectedOrder.items.forEach((item) => {
      newSelectedItems[item.id] = checked
    })

    setSelectedItems(newSelectedItems)
  }

  // Check if all items are selected
  const areAllItemsSelected = () => {
    if (!selectedOrder || selectedOrder.items.length === 0) return false

    return selectedOrder.items.every((item) => selectedItems[item.id])
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Process Return" text="Process a product return from a customer" />
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Return Information</CardTitle>
            <CardDescription>Enter the details of the return.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Select value={orderId} onValueChange={setOrderId}>
                  <SelectTrigger id="orderId">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id} - {new Date(order.date).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Walk-in Customer">Walk-in Customer</SelectItem>
                    {customers.map((cust) => (
                      <SelectItem key={cust.id} value={cust.name}>
                        {cust.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedOrder && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Select Items to Return</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="selectAll"
                      checked={areAllItemsSelected()}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    />
                    <label
                      htmlFor="selectAll"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Select All
                    </label>
                  </div>
                </div>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={!!selectedItems[item.id]}
                              onCheckedChange={(checked) => handleItemSelect(item.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>Rs{item.price.toFixed(2)}</TableCell>
                          <TableCell>Rs{(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end font-medium">Total Return Amount: Rs{calculateAmount().toFixed(2)}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Return Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {RETURN_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Enter any additional notes" rows={3} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Process Return"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardShell>
  )
}

