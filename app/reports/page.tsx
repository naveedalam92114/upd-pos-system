import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesReport } from "@/components/sales-report"
import { InventoryReport } from "@/components/inventory-report"
import { ProfitLossReport } from "@/components/profit-loss-report"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Reports" text="View detailed business analytics and reports" />

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <SalesReport />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryReport />
        </TabsContent>

        <TabsContent value="profit-loss" className="space-y-4">
          <ProfitLossReport />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

