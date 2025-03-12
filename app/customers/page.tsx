import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { CustomerList } from "@/components/customer-list"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { Protected } from "@/components/protected"

export default function CustomersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Customers" text="Manage your customer database">
        <Protected requiredPermission="customers:create">
          <Link href="/customers/new">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        </Protected>
      </DashboardHeader>
      <CustomerList />
    </DashboardShell>
  )
}

