"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { hasPermission } from "@/lib/permissions"
import type { Permission } from "@/lib/permissions"

interface ProtectedProps {
  children: ReactNode
  requiredPermission: Permission
  fallback?: ReactNode
}

export function Protected({ children, requiredPermission, fallback = null }: ProtectedProps) {
  const { user } = useAuth()

  if (!user || !hasPermission(user.role, requiredPermission)) {
    return fallback
  }

  return <>{children}</>
}

