import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { VendorList } from "@/components/vendor-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function VendorsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Vendors" text="Manage your suppliers and vendors">
        <Link href="/vendors/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </Link>
      </DashboardHeader>
      <VendorList />
    </DashboardShell>
  )
}

