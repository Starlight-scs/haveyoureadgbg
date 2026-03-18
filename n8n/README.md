# n8n: Stripe -> Ship.com Label Workflow

Workflow file:
- `n8n/workflows/stripe-shipcom-shipping-label.json`

## What it does
- Receives Stripe webhook events.
- Handles only `checkout.session.completed` events.
- Extracts buyer shipping address from `data.object.shipping_details`.
- Calls Ship.com to:
  1. get auth token
  2. create order
  3. fetch rates
  4. purchase label using the cheapest returned rate
- Responds with JSON including `orderId`, `trackingNumber`, and `labelUrl`.

## Required n8n environment variables
Set these in your n8n environment:

- `SHIP_COM_EMAIL`
- `SHIP_COM_PASSWORD`
- `SHIP_FROM_NAME`
- `SHIP_FROM_ADDRESS1`
- `SHIP_FROM_CITY`
- `SHIP_FROM_STATE`
- `SHIP_FROM_POSTAL_CODE`
- `SHIP_FROM_COUNTRY` (default expected: `US`)

Optional:
- `SHIP_FROM_COMPANY`
- `SHIP_FROM_PHONE`
- `SHIP_FROM_ADDRESS2`
- `PACKAGE_LENGTH_IN` (default: `9`)
- `PACKAGE_WIDTH_IN` (default: `6`)
- `PACKAGE_HEIGHT_IN` (default: `1`)
- `PACKAGE_WEIGHT_OZ` (default: `12`)

## Stripe webhook setup
In Stripe Dashboard webhook settings, point the endpoint to your n8n webhook URL:
- `POST /webhook/stripe-shipcom-label` (production) or test path from n8n editor.

Subscribe this event at minimum:
- `checkout.session.completed`

Your Checkout Session must collect shipping details so Stripe sends `shipping_details`.

## Import steps
1. In n8n, go to Workflows -> Import from file.
2. Select `n8n/workflows/stripe-shipcom-shipping-label.json`.
3. Save and activate the workflow.
4. Copy webhook URL into Stripe webhook config.

## Notes
- If your Ship.com account response fields differ, adjust the two Code nodes:
  - `Normalize Order ID`
  - `Pick Cheapest Rate`
- The workflow is written to be resilient to common field name variations, but Ship.com account schemas can vary.
