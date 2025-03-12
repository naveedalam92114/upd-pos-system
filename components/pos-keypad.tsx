"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

export function POSKeypad() {
  const [productName, setProductName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("1")
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (!productName || !price || !quantity) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const priceNum = Number.parseFloat(price)
    const quantityNum = Number.parseInt(quantity)

    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    addToCart({
      id: `custom-${Date.now()}`,
      name: productName,
      price: priceNum,
      quantity: quantityNum,
    })

    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
      duration: 1500,
    })

    // Reset form
    setProductName("")
    setPrice("")
    setQuantity("1")
  }

  const appendToPrice = (digit: string) => {
    if (digit === "." && price.includes(".")) return
    setPrice((prev) => prev + digit)
  }

  const backspace = () => {
    setPrice((prev) => prev.slice(0, -1))
  }

  const clear = () => {
    setPrice("")
  }

  return (
    <div className="grid grid-cols-1 gap-6 h-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product-name">Product Name</Label>
          <Input
            id="product-name"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (Rs)</Label>
          <Input id="price" placeholder="0.00" value={price} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button key={num} variant="outline" onClick={() => appendToPrice(num.toString())}>
            {num}
          </Button>
        ))}
        <Button variant="outline" onClick={() => appendToPrice(".")}>
          .
        </Button>
        <Button variant="outline" onClick={() => appendToPrice("0")}>
          0
        </Button>
        <Button variant="outline" onClick={backspace}>
          ←
        </Button>
        <Button variant="outline" onClick={clear} className="col-span-3">
          Clear
        </Button>
        <Button onClick={handleAddToCart} className="col-span-3">
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

