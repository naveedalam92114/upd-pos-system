"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Package,
  ShoppingCart,
  ClipboardList,
  Users,
  Settings,
  HelpCircle,
  TrendingUp,
  Truck,
  DollarSign,
  RotateCcw,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block">
      <ScrollArea className={cn("h-screen py-6 pr-6 lg:pr-8", className)}>
        <div className="pl-4 pr-1">
          <div className="space-y-1">
            <Link href="/">
              <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant={pathname.startsWith("/products") ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant={pathname === "/cart" ? "default" : "ghost"} size="sm" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant={pathname === "/orders" ? "default" : "ghost"} size="sm" className="w-full justify-start">
                <ClipboardList className="mr-2 h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Link href="/vendors">
              <Button
                variant={pathname === "/vendors" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Truck className="mr-2 h-4 w-4" />
                Vendors
              </Button>
            </Link>
            <Link href="/expenses">
              <Button
                variant={pathname === "/expenses" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Expenses
              </Button>
            </Link>
            <Link href="/returns">
              <Button
                variant={pathname === "/returns" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Returns
              </Button>
            </Link>
            <Link href="/reports">
              <Button
                variant={pathname === "/reports" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
          </div>
          <div className="mt-6 space-y-1">
            <div className="text-xs font-semibold text-muted-foreground pl-2 mb-2">Administration</div>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Customers
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Sales
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

