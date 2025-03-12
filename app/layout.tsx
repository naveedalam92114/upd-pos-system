import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { ProductProvider } from "@/contexts/product-context"
import { OrderProvider } from "@/contexts/order-context"
import { CustomerProvider } from "@/contexts/customer-context"
import { VendorProvider } from "@/contexts/vendor-context"
import { ExpenseProvider } from "@/contexts/expense-context"
import { ReturnProvider } from "@/contexts/return-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WK & GH",
  description: "Professional Point of Sale System",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ProductProvider>
            <OrderProvider>
              <CustomerProvider>
                <VendorProvider>
                  <ExpenseProvider>
                    <ReturnProvider>
                      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        {children}
                        <Toaster />
                      </ThemeProvider>
                    </ReturnProvider>
                  </ExpenseProvider>
                </VendorProvider>
              </CustomerProvider>
            </OrderProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'