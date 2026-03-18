"use client"

import { useState, type ComponentProps } from "react"

import { createCheckoutSession } from "@/app/actions/checkout"
import { Button } from "@/components/ui/button"

type BuyButtonProps = ComponentProps<typeof Button>

export function BuyButton({ children, disabled, ...props }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBuy = async () => {
    setIsLoading(true)
    try {
      const { url } = await createCheckoutSession()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      {...props}
      onClick={handleBuy}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Redirecting..." : (children ?? "Buy Now - $13.99")}
    </Button>
  )
}
