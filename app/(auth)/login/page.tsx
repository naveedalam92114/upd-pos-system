"use client"

import type React from "react"

import { useState } from "react"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }

    const success = await login(email, password)

    if (!success) {
      toast({
        title: "Invalid credentials",
        description: "The email or password you entered is incorrect",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="w-full max-w-md px-4">
        <Card className="w-full">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">POS System Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs" type="button">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <Tabs defaultValue="admin" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                  <TabsTrigger value="manager">Manager</TabsTrigger>
                  <TabsTrigger value="staff">Staff</TabsTrigger>
                </TabsList>
                <TabsContent value="admin" className="mt-2 text-center text-sm text-muted-foreground">
                  <p>Email: admin@pos.com</p>
                  <p>Password: admin123</p>
                  <p className="mt-1 text-xs">Full system access</p>
                </TabsContent>
                <TabsContent value="manager" className="mt-2 text-center text-sm text-muted-foreground">
                  <p>Email: manager@pos.com</p>
                  <p>Password: manager123</p>
                  <p className="mt-1 text-xs">Staff management, limited settings</p>
                </TabsContent>
                <TabsContent value="staff" className="mt-2 text-center text-sm text-muted-foreground">
                  <p>Email: staff@pos.com</p>
                  <p>Password: staff123</p>
                  <p className="mt-1 text-xs">Sales, history, and returns only</p>
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center text-xs text-muted-foreground">
                <p>Original credentials also work:</p>
                <p>Email: info@pos.com | Password: 12345678</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

