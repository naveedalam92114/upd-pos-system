"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProducts } from "@/contexts/product-context"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function POSProductGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const { products } = useProducts()
  const { addToCart } = useCart()
  const { toast } = useToast()

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group products by category
  const categories = Array.from(new Set(filteredProducts.map((product) => product.category)))
  const productsByCategory = categories.reduce(
    (acc, category) => {
      acc[category] = filteredProducts.filter((product) => product.category === category)
      return acc
    },
    {} as Record<string, typeof products>,
  )

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 1500,
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="flex-1">
          <ScrollArea className="h-[calc(100%-40px)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">No products found</div>
              ) : (
                filteredProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center text-center p-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    <div className="font-medium truncate w-full">{product.name}</div>
                    <div className="text-sm text-muted-foreground">Rs{product.price.toFixed(2)}</div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="flex-1">
            <ScrollArea className="h-[calc(100%-40px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {productsByCategory[category].length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">No products found</div>
                ) : (
                  productsByCategory[category].map((product) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center text-center p-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      <div className="font-medium truncate w-full">{product.name}</div>
                      <div className="text-sm text-muted-foreground">Rs{product.price.toFixed(2)}</div>
                    </Button>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

