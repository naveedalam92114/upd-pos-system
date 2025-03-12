import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { UserList } from "@/components/user-list"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { Protected } from "@/components/protected"

export default function UsersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="User Management" text="Manage system users and permissions">
        <Protected requiredPermission="users:create">
          <Link href="/users/new">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        </Protected>
      </DashboardHeader>
      <UserList />
    </DashboardShell>
  )
}

