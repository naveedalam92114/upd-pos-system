"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/contexts/auth-context"

// Define permission modules and actions
const permissionModules = [
  {
    name: "Dashboard",
    permissions: ["View", "Export Reports"],
  },
  {
    name: "Products",
    permissions: ["View", "Create", "Edit", "Delete", "Import/Export"],
  },
  {
    name: "Orders",
    permissions: ["View", "Create", "Edit", "Cancel", "Refund", "Export"],
  },
  {
    name: "Customers",
    permissions: ["View", "Create", "Edit", "Delete", "Export"],
  },
  {
    name: "Inventory",
    permissions: ["View", "Adjust", "Transfer", "Export"],
  },
  {
    name: "Reports",
    permissions: ["View Sales", "View Inventory", "View Financial", "Export"],
  },
  {
    name: "Users",
    permissions: ["View", "Create", "Edit", "Delete"],
  },
  {
    name: "Settings",
    permissions: ["View", "Edit"],
  },
]

// Define role templates
const roleTemplates = {
  Admin: permissionModules.reduce(
    (acc, module) => {
      acc[module.name] = module.permissions.reduce(
        (perms, perm) => {
          perms[perm] = true
          return perms
        },
        {} as Record<string, boolean>,
      )
      return acc
    },
    {} as Record<string, Record<string, boolean>>,
  ),

  Manager: {
    Dashboard: { View: true, "Export Reports": true },
    Products: { View: true, Create: true, Edit: true, Delete: false, "Import/Export": true },
    Orders: { View: true, Create: true, Edit: true, Cancel: true, Refund: true, Export: true },
    Customers: { View: true, Create: true, Edit: true, Delete: false, Export: true },
    Inventory: { View: true, Adjust: true, Transfer: true, Export: true },
    Reports: { "View Sales": true, "View Inventory": true, "View Financial": true, Export: true },
    Users: { View: true, Create: false, Edit: false, Delete: false },
    Settings: { View: true, Edit: false },
  },

  Staff: {
    Dashboard: { View: true, "Export Reports": false },
    Products: { View: true, Create: false, Edit: false, Delete: false, "Import/Export": false },
    Orders: { View: true, Create: true, Edit: false, Cancel: false, Refund: false, Export: false },
    Customers: { View: true, Create: true, Edit: false, Delete: false, Export: false },
    Inventory: { View: true, Adjust: false, Transfer: false, Export: false },
    Reports: { "View Sales": false, "View Inventory": false, "View Financial": false, Export: false },
    Users: { View: false, Create: false, Edit: false, Delete: false },
    Settings: { View: false, Edit: false },
  },
}

type Role = "admin" | "manager" | "staff" | "custom"

export function PermissionsSettings() {
  const [activeTab, setActiveTab] = useState("roles")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [userPermissions, setUserPermissions] = useState<Record<string, Record<string, Record<string, boolean>>>>({})
  const { toast } = useToast()
  const { users, updateUser, user: currentUser } = useAuth()

  // Initialize permissions for each user based on their role
  useEffect(() => {
    const initialPermissions = users.reduce(
      (acc, user) => {
        acc[user.id] = { ...roleTemplates[user.role as Role] }
        return acc
      },
      {} as Record<string, Record<string, Record<string, boolean>>>,
    )

    setUserPermissions(initialPermissions)
  }, [users])

  const handlePermissionChange = (userId: string, module: string, permission: string, checked: boolean) => {
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [module]: {
          ...prev[userId]?.[module],
          [permission]: checked,
        },
      },
    }))
  }

  const handleRoleChange = (userId: string, role: UserRole) => {
    // Find the user
    const userToUpdate = users.find((u) => u.id === userId)
    if (!userToUpdate) return

    // Check if manager is trying to promote to admin
    if (currentUser?.role === "manager" && role === "admin") {
      toast({
        title: "Permission denied",
        description: "Managers cannot promote users to admin role",
        variant: "destructive",
      })
      return
    }

    // Apply the role template permissions
    setUserPermissions((prev) => ({
      ...prev,
      [userId]: { ...roleTemplates[role] },
    }))

    // Update the user's role
    const updatedUser = {
      ...userToUpdate,
      role,
    }

    updateUser(updatedUser)

    toast({
      title: "Role updated",
      description: `User role has been updated to ${role}`,
    })
  }

  const savePermissions = () => {
    // In a real app, this would save to the database
    toast({
      title: "Permissions saved",
      description: "User permissions have been updated successfully",
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "manager":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Filter users based on current user's role
  const filteredUsers = users.filter((user) => {
    // Managers can't see or manage admins
    if (currentUser?.role === "manager" && user.role === "admin") {
      return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="permissions">Detailed Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>Assign roles to users to control their access to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Assign Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{user.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                          disabled={user.id === currentUser?.id} // Can't change own role
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Only admins can assign admin role */}
                            {currentUser?.role === "admin" && <SelectItem value="admin">Admin</SelectItem>}
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Role Descriptions</CardTitle>
              <CardDescription>Overview of permissions for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Admin</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Full access to all system features and settings. Can manage users, roles, and permissions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Manager</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access to most features except user management and sensitive settings. Can manage products, orders,
                    customers, and view all reports.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Staff</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Limited access focused on point of sale operations. Can create orders, view products, and manage
                    basic customer information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Permissions</CardTitle>
              <CardDescription>Customize specific permissions for each user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <Select value={selectedUser || undefined} onValueChange={setSelectedUser}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a user to edit permissions" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedUser && userPermissions[selectedUser] && (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Module</TableHead>
                          <TableHead>Permissions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissionModules.map((module) => (
                          <TableRow key={module.name}>
                            <TableCell className="font-medium">{module.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-4">
                                {module.permissions.map((permission) => (
                                  <div key={permission} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${selectedUser}-${module.name}-${permission}`}
                                      checked={userPermissions[selectedUser]?.[module.name]?.[permission] || false}
                                      onCheckedChange={(checked) =>
                                        handlePermissionChange(
                                          selectedUser,
                                          module.name,
                                          permission,
                                          checked as boolean,
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={`${selectedUser}-${module.name}-${permission}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {permission}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {selectedUser && (
                  <div className="flex justify-end">
                    <Button onClick={savePermissions}>Save Permissions</Button>
                  </div>
                )}

                {!selectedUser && (
                  <div className="text-center py-8 text-muted-foreground">Select a user to edit their permissions</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

