import type Stripe from "stripe";
import { db, orders } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { sendOrderReceipts } from "@/lib/email";
import { and, eq, ne } from "drizzle-orm";

// Webhooks need the raw request body for signature verification, so this must run
// on Node (not edge) and read the body as text, not JSON.
export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set — cannot verify webhook.");
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    // Async variant works regardless of runtime's crypto implementation.
    event = await getStripe().webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // Only mark paid once payment actually cleared (covers async methods).
        if (session.payment_status !== "paid") break;
        const orderId = session.metadata?.orderId ?? session.client_reference_id;
        if (!orderId) break;
        // Guard on `status != paid` so Stripe's webhook retries (or duplicate
        // deliveries) only transition the order — and send emails — once.
        const [paidOrder] = await db
          .update(orders)
          .set({
            status: "paid",
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
            stripeCheckoutSessionId: session.id,
          })
          .where(and(eq(orders.id, orderId), ne(orders.status, "paid")))
          .returning();
        // Only the first delivery returns a row; send receipts then. Email is
        // best-effort and never throws, so it can't fail the webhook.
        if (paidOrder) {
          await sendOrderReceipts(paidOrder);
        }
        break;
      }
      case "checkout.session.expired": {
        // Customer abandoned the Stripe page — leave a record by cancelling the
        // still-pending order so it doesn't linger.
        const session = event.data.object;
        const orderId = session.metadata?.orderId ?? session.client_reference_id;
        if (orderId) {
          await db
            .update(orders)
            .set({ status: "cancelled" })
            .where(eq(orders.id, orderId));
        }
        break;
      }
      default:
        // Ignore other event types.
        break;
    }
  } catch (err) {
    // Returning 500 makes Stripe retry — good for transient DB hiccups.
    console.error(`Error handling webhook ${event.type}:`, err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
