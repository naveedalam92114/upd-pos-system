import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { UserProfileSettings } from "@/components/user-profile-settings"

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="My Profile" text="Manage your account settings and profile" />
      <div className="mx-auto max-w-2xl">
        <UserProfileSettings />
      </div>
    </DashboardShell>
  )
}

