import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { OrderList } from "@/components/order-list"

export default function OrdersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Orders" text="View and manage your orders" />
      <OrderList />
    </DashboardShell>
  )
}

