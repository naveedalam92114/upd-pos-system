import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { ReturnList } from "@/components/return-list"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import Link from "next/link"
import { Protected } from "@/components/protected"

export default function ReturnsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Returns" text="Manage product returns and refunds">
        <Protected requiredPermission="returns:create">
          <Link href="/returns/new">
            <Button>
              <RotateCcw className="mr-2 h-4 w-4" />
              Process Return
            </Button>
          </Link>
        </Protected>
      </DashboardHeader>
      <ReturnList />
    </DashboardShell>
  )
}

