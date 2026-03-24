"use client"

import { useState, type ComponentProps } from "react"

import { Button } from "@/components/ui/button"

type BuyButtonProps = ComponentProps<typeof Button>

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/fZu00l4RB9AQdPw36d2VG00"

export function BuyButton({ children, disabled, ...props }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBuy = () => {
    setIsLoading(true)
    window.location.href = STRIPE_PAYMENT_LINK
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
