import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ShipComClient, ShipTo } from "@/lib/ship-com";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const ADMIN_EMAIL = "acarie66@icloud.com";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      console.log(`Processing checkout session completed: ${session.id}`);

      const shipping = session.shipping_details;
      const address = shipping?.address;

      if (!shipping?.name || !address?.line1 || !address?.city || !address?.postal_code || !address?.country) {
        throw new Error("Missing shipping details in Stripe session");
      }

      const shipTo: ShipTo = {
        name: shipping.name,
        phone: shipping.phone || session.customer_details?.phone || undefined,
        address1: address.line1,
        address2: address.line2 || undefined,
        city: address.city,
        state: address.state || "",
        postalCode: address.postal_code,
        country: address.country,
      };

      const shipCom = new ShipComClient();

      // 1. Create Order
      console.log(`Creating Ship.com order for session ${session.id}`);
      const orderId = await shipCom.createOrder({
        orderNumber: session.id,
        to: shipTo,
        metadata: {
          stripeSessionId: session.id,
          customerEmail: session.customer_details?.email || session.customer_email || "",
        },
      });

      // 2. Get Rates
      console.log(`Getting rates for order ${orderId}`);
      const rates = await shipCom.getRates(orderId);

      // 3. Pick Cheapest Rate
      const bestRate = rates.sort((a, b) => a.amount - b.amount)[0];
      console.log(`Selected best rate: ${bestRate.shippingMethod} - ${bestRate.serviceLevel} ($${bestRate.amount})`);

      // 4. Purchase Label
      console.log(`Purchasing label for order ${orderId}`);
      const labelData = await shipCom.purchaseLabel({
        orderId,
        rate: bestRate,
      });

      const trackingNumber = labelData.trackingNumber || labelData.tracking || labelData.data?.trackingNumber;
      const labelUrl = labelData.labelUrl || labelData.labelURL || labelData.shippingLabelURL || labelData.data?.labelUrl;

      console.log(`Successfully purchased label. Tracking: ${trackingNumber}, Label URL: ${labelUrl}`);

      // 5. Send Email to Admin
      if (labelUrl) {
        console.log(`Sending label email to admin: ${ADMIN_EMAIL}`);
        try {
          await resend.emails.send({
            from: "Book Landing <onboarding@resend.dev>",
            to: ADMIN_EMAIL,
            subject: `Shipping Label Ready - Order ${session.id}`,
            html: `
              <h2>New Shipping Label Ready</h2>
              <p>A shipping label has been generated for order <strong>${session.id}</strong>.</p>
              <p><strong>Tracking Number:</strong> ${trackingNumber || "N/A"}</p>
              <p><strong>Shipping Method:</strong> ${bestRate.shippingMethod} - ${bestRate.serviceLevel}</p>
              <p><strong>Label URL:</strong> <a href="${labelUrl}">${labelUrl}</a></p>
              <hr/>
              <p><strong>Ship To:</strong><br/>
              ${shipping.name}<br/>
              ${address.line1}<br/>
              ${address.line2 ? address.line2 + "<br/>" : ""}
              ${address.city}, ${address.state} ${address.postal_code}<br/>
              ${address.country}</p>
            `,
          });
        } catch (emailErr: any) {
          console.error(`Failed to send label email: ${emailErr.message}`);
          // We don't throw here as the label was successfully created
        }
      }

      // Optional: Update Stripe session with tracking info if possible (Stripe doesn't support direct updates of some fields post-completion, but metadata works)
      await stripe.checkout.sessions.update(session.id, {
        metadata: {
          shipComOrderId: orderId,
          trackingNumber: trackingNumber || "N/A",
          labelUrl: labelUrl || "N/A",
        },
      });

      return NextResponse.json({
        ok: true,
        orderId,
        trackingNumber,
        labelUrl,
      });
    } catch (err: any) {
      console.error(`Error processing shipping label for session ${session.id}: ${err.message}`);
      // We return 200 here to acknowledge receipt to Stripe, even if internal processing failed, 
      // otherwise Stripe will retry the webhook multiple times. 
      // In a production app, you might want to log this to an error tracking service.
      return NextResponse.json({ error: err.message }, { status: 200 });
    }
  }

  return NextResponse.json({ received: true });
}
