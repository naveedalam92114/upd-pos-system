"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import type { ButtonProps } from "@/components/ui/button"
import { useState } from "react"

interface PrintButtonProps extends ButtonProps {
  contentRef: React.RefObject<HTMLElement>
  onAfterPrint?: () => void
  children?: React.ReactNode
}

export function PrintButton({ contentRef, onAfterPrint, children, ...props }: PrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    if (!contentRef.current) return

    setIsPrinting(true)

    try {
      // Create an iframe
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      document.body.appendChild(iframe)

      // Write content to iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        throw new Error("Could not access iframe document")
      }

      // Get the content including the styles
      const content = contentRef.current.outerHTML

      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Receipt</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            ${content}
          </body>
        </html>
      `)
      iframeDoc.close()

      // Print the iframe
      setTimeout(() => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()

        // Remove iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe)
          setIsPrinting(false)
          if (onAfterPrint) {
            onAfterPrint()
          }
        }, 1000)
      }, 500) // Small delay to ensure content is fully loaded
    } catch (error) {
      console.error("Printing failed:", error)
      setIsPrinting(false)
    }
  }

  return (
    <Button onClick={handlePrint} disabled={isPrinting} {...props}>
      <Printer className="mr-2 h-4 w-4" />
      {isPrinting ? "Printing..." : children || "Print"}
    </Button>
  )
}

