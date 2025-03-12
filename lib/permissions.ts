import type { UserRole } from "@/contexts/auth-context"

// Define permission structure
export type Permission =
  | "dashboard:view"
  | "products:view"
  | "products:create"
  | "products:edit"
  | "products:delete"
  | "orders:view"
  | "orders:create"
  | "orders:edit"
  | "orders:cancel"
  | "orders:refund"
  | "customers:view"
  | "customers:create"
  | "customers:edit"
  | "customers:delete"
  | "inventory:view"
  | "inventory:adjust"
  | "reports:view"
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  | "settings:view"
  | "settings:edit"
  | "returns:process"

// Define role-based permissions
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "dashboard:view",
    "products:view",
    "products:create",
    "products:edit",
    "products:delete",
    "orders:view",
    "orders:create",
    "orders:edit",
    "orders:cancel",
    "orders:refund",
    "customers:view",
    "customers:create",
    "customers:edit",
    "customers:delete",
    "inventory:view",
    "inventory:adjust",
    "reports:view",
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "settings:view",
    "settings:edit",
    "returns:process",
  ],
  manager: [
    "dashboard:view",
    "products:view",
    "products:create",
    "products:edit",
    "orders:view",
    "orders:create",
    "orders:edit",
    "orders:cancel",
    "orders:refund",
    "customers:view",
    "customers:create",
    "customers:edit",
    "inventory:view",
    "inventory:adjust",
    "reports:view",
    "users:view",
    "users:create",
    "users:edit", // Can manage staff but not admins
    "settings:view",
    "returns:process",
  ],
  staff: [
    "dashboard:view",
    "products:view",
    "orders:view",
    "orders:create",
    "customers:view",
    "customers:create",
    "inventory:view",
    "returns:process",
  ],
}

// Check if a role has a specific permission
export function hasPermission(role: UserRole | null, permission: Permission): boolean {
  if (!role) return false
  return rolePermissions[role].includes(permission)
}

// Get all permissions for a role
export function getPermissionsForRole(role: UserRole): Permission[] {
  return rolePermissions[role]
}

