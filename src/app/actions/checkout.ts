"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // use latest
})

export async function createCheckoutSession() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured")
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Government by Gangsterism",
            images: [`${baseUrl}/images/bookcover.png`],
          },
          unit_amount: 1399, // $13.99
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/`,
  })

  return { url: session.url }
}
