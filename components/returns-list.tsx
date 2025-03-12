"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Search } from "lucide-react"

// Sample returns data
const returns = [
  {
    id: "RET-001",
    orderId: "ORD-003",
    customer: "Michael Brown",
    date: "2023-03-18",
    items: 2,
    amount: 129.98,
    reason: "Defective product",
    status: "Completed",
  },
  {
    id: "RET-002",
    orderId: "ORD-005",
    customer: "David Wilson",
    date: "2023-03-15",
    items: 1,
    amount: 79.99,
    reason: "Wrong size",
    status: "Processing",
  },
  {
    id: "RET-003",
    orderId: "ORD-007",
    customer: "Robert Martinez",
    date: "2023-03-12",
    items: 1,
    amount: 49.99,
    reason: "Changed mind",
    status: "Completed",
  },
  {
    id: "RET-004",
    orderId: "ORD-002",
    customer: "Sarah Johnson",
    date: "2023-03-10",
    items: 1,
    amount: 89.99,
    reason: "Not as described",
    status: "Pending",
  },
  {
    id: "RET-005",
    orderId: "ORD-008",
    customer: "Lisa Anderson",
    date: "2023-03-05",
    items: 2,
    amount: 59.98,
    reason: "Damaged in shipping",
    status: "Completed",
  },
]

export function ReturnsList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReturns = returns.filter(
    (returnItem) =>
      returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Processing":
        return "secondary"
      case "Pending":
        return "warning"
      default:
        return "default"
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Returns Management</CardTitle>
        <CardDescription>Process and track product returns and refunds.</CardDescription>
        <div className="flex items-center gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search returns..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Return ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReturns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No returns found
                </TableCell>
              </TableRow>
            ) : (
              filteredReturns.map((returnItem) => (
                <TableRow key={returnItem.id}>
                  <TableCell className="font-medium">{returnItem.id}</TableCell>
                  <TableCell>{returnItem.orderId}</TableCell>
                  <TableCell>{returnItem.customer}</TableCell>
                  <TableCell>{formatDate(returnItem.date)}</TableCell>
                  <TableCell>{returnItem.items}</TableCell>
                  <TableCell>Rs{returnItem.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(returnItem.status)}>{returnItem.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Process Refund</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredReturns.length} of {returns.length} returns
        </div>
        <div className="text-sm font-medium">
          Total Refunds: Rs{filteredReturns.reduce((sum, returnItem) => sum + returnItem.amount, 0).toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  )
}

