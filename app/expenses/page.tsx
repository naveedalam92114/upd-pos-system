import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { ExpenseList } from "@/components/expense-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ExpensesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Expenses" text="Track and manage your business expenses">
        <Link href="/expenses/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </Link>
      </DashboardHeader>
      <ExpenseList />
    </DashboardShell>
  )
}

