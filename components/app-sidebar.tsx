"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Package,
  ShoppingCart,
  ClipboardList,
  Users,
  Settings,
  HelpCircle,
  Truck,
  DollarSign,
  RotateCcw,
  FileText,
  ShoppingBag,
  UserCog,
  LayoutDashboard,
  CreditCard,
  LogOut,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  SidebarToggle,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Protected } from "@/components/protected"

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <span className="font-bold">POS System</span>
        </div>
        <SidebarToggle className="ml-auto" />
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-2">
        <SidebarSection>
          <Protected requiredPermission="dashboard:view">
            <Link href="/">
              <SidebarItem
                icon={<LayoutDashboard className="h-5 w-5" />}
                title="Dashboard"
                isActive={pathname === "/"}
              />
            </Link>
          </Protected>

          <Protected requiredPermission="products:view">
            <Link href="/products">
              <SidebarItem
                icon={<Package className="h-5 w-5" />}
                title="Products"
                isActive={pathname.startsWith("/products")}
              />
            </Link>
          </Protected>

          <Protected requiredPermission="orders:create">
            <Link href="/cart">
              <SidebarItem
                icon={<ShoppingCart className="h-5 w-5" />}
                title="POS / Cart"
                isActive={pathname === "/cart"}
              />
            </Link>
          </Protected>

          <Protected requiredPermission="orders:view">
            <Link href="/orders">
              <SidebarItem
                icon={<ClipboardList className="h-5 w-5" />}
                title="Orders"
                isActive={pathname === "/orders"}
              />
            </Link>
          </Protected>
        </SidebarSection>

        <SidebarSection title="Inventory">
          <Protected requiredPermission="inventory:view">
            <Link href="/vendors">
              <SidebarItem icon={<Truck className="h-5 w-5" />} title="Vendors" isActive={pathname === "/vendors"} />
            </Link>
          </Protected>

          <Protected requiredPermission="returns:process">
            <Link href="/returns">
              <SidebarItem
                icon={<RotateCcw className="h-5 w-5" />}
                title="Returns"
                isActive={pathname === "/returns"}
              />
            </Link>
          </Protected>
        </SidebarSection>

        <SidebarSection title="Finance">
          <Protected requiredPermission="inventory:view">
            <Link href="/expenses">
              <SidebarItem
                icon={<DollarSign className="h-5 w-5" />}
                title="Expenses"
                isActive={pathname === "/expenses"}
              />
            </Link>
          </Protected>

          <Protected requiredPermission="reports:view">
            <Link href="/reports">
              <SidebarItem icon={<FileText className="h-5 w-5" />} title="Reports" isActive={pathname === "/reports"} />
            </Link>
          </Protected>

          <Protected requiredPermission="orders:view">
            <SidebarItem
              icon={<CreditCard className="h-5 w-5" />}
              title="Payments"
              isActive={pathname === "/payments"}
            />
          </Protected>
        </SidebarSection>

        <SidebarSection title="Administration">
          <Protected requiredPermission="customers:view">
            <Link href="/customers">
              <SidebarItem
                icon={<Users className="h-5 w-5" />}
                title="Customers"
                isActive={pathname === "/customers"}
              />
            </Link>
          </Protected>

          <Protected requiredPermission="users:view">
            <Link href="/users">
              <SidebarItem
                icon={<UserCog className="h-5 w-5" />}
                title="User Management"
                isActive={pathname === "/users"}
              />
            </Link>
          </Protected>

          <Protected requiredPermission="settings:view">
            <Link href="/settings">
              <SidebarItem
                icon={<Settings className="h-5 w-5" />}
                title="Settings"
                isActive={pathname === "/settings"}
              />
            </Link>
          </Protected>
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-full justify-start gap-2 px-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-xs">
                <span className="font-medium">{user.name}</span>
                <span className="text-muted-foreground capitalize">{user.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserCog className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

