"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/products"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/products" || pathname.startsWith("/products/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Products
      </Link>
      <Link
        href="/cart"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/cart" ? "text-primary" : "text-muted-foreground",
        )}
      >
        POS
      </Link>
      <Link
        href="/orders"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/orders" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Orders
      </Link>
    </nav>
  )
}

