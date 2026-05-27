// Transactional order emails (customer receipt + restaurant owner notification),
// sent via Resend from the Stripe webhook once a payment clears.
//
// Required env vars (set in .env.local AND in Vercel project settings):
//   RESEND_API_KEY            – Resend API key (re_…)
//   ORDER_NOTIFICATION_EMAIL  – central inbox that receives a copy of every order
//   ORDER_FROM_EMAIL          – verified sender, e.g. "Chick Rocks <orders@chickrocksus.com>"
// Optional:
//   NEXT_PUBLIC_SITE_URL      – absolute site URL used for the logo (defaults to prod domain)
import { Resend } from "resend";
import type { Order } from "@/lib/db";
import { STORES } from "@/lib/stores";

const BRAND = "#F5680A"; // orange primary (hsl(24 92% 50%))
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://chickrocksus.com").replace(/\/$/, "");
const FROM = process.env.ORDER_FROM_EMAIL ?? "Chick Rocks <orders@chickrocksus.com>";

// Built lazily so a missing key never crashes module load / `next build`.
let client: Resend | null = null;
const getResend = (): Resend | null => {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
};

const formatCents = (cents: number): string =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Escape user-controlled values before interpolating into the HTML.
const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const shortId = (id: string): string => id.slice(0, 8).toUpperCase();

const itemRows = (order: Order): string =>
  order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;">
          ${it.quantity}&times; ${esc(it.name)}${it.notes ? ` <span style="color:#888;">(${esc(it.notes)})</span>` : ""}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;color:#333;white-space:nowrap;">
          ${formatCents(it.unitPriceCents * it.quantity)}
        </td>
      </tr>`
    )
    .join("");

const totalsRows = (order: Order): string => {
  const row = (label: string, cents: number, bold = false) => `
    <tr>
      <td style="padding:4px 0;${bold ? "font-weight:700;font-size:16px;" : "color:#666;"}">${label}</td>
      <td style="padding:4px 0;text-align:right;${bold ? "font-weight:700;font-size:16px;" : "color:#666;"}white-space:nowrap;">${formatCents(cents)}</td>
    </tr>`;
  return [
    row("Subtotal", order.subtotalCents),
    order.taxCents > 0 ? row("Sales tax", order.taxCents) : "",
    order.tipCents > 0 ? row("Tip", order.tipCents) : "",
    row("Total", order.totalCents, true),
  ].join("");
};

// Shared shell: logo header, content, footer.
const layout = (heading: string, intro: string, order: Order): string => {
  const store = STORES.find((s) => s.id === order.storeId);
  const storeName = store ? store.name : order.storeId;
  const pickup = order.notes || "See order details";
  return `
  <div style="background:#f6f6f6;padding:24px 0;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:${BRAND};padding:24px;text-align:center;">
          <img src="${SITE_URL}/email-logo.png" alt="Chick Rocks" width="160" style="display:inline-block;max-width:160px;height:auto;" />
        </td>
      </tr>
      <tr>
        <td style="padding:28px 28px 8px;">
          <h1 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;">${esc(heading)}</h1>
          <p style="margin:0 0 16px;color:#555;line-height:1.5;">${intro}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:14px 16px;background:#fafafa;border-radius:8px;color:#333;line-height:1.6;">
                <strong>Pickup &mdash; ${esc(storeName)}</strong><br/>
                ${pickup ? esc(pickup) : ""}${store ? `<br/>${esc(store.addressLine1)}, ${esc(store.addressLine2)}<br/>${esc(store.phone)}` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${itemRows(order)}
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
            ${totalsRows(order)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 28px;color:#999;font-size:12px;line-height:1.6;">
          Order #${shortId(order.id)}<br/>
          Questions? Reply to this email or call your pickup location.
        </td>
      </tr>
    </table>
  </div>`;
};

const customerHtml = (order: Order): string => {
  const firstName = esc(order.customerName.split(" ")[0] || "there");
  return layout(
    `Thanks for your order, ${firstName}!`,
    "We've received your catering order and payment. Here are the details &mdash; we'll see you at pickup.",
    order
  );
};

const ownerHtml = (order: Order): string =>
  layout(
    "New catering order",
    `<strong>${esc(order.customerName)}</strong><br/>${esc(order.customerEmail)} &middot; ${esc(order.customerPhone)}`,
    order
  );

/**
 * Send the customer receipt and the owner notification. Best-effort: any failure is
 * logged but never thrown, so a transient email problem can't roll back a paid order
 * or trigger endless Stripe webhook retries.
 */
export async function sendOrderReceipts(order: Order): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping order receipt emails.");
    return;
  }

  const ownerTo = process.env.ORDER_NOTIFICATION_EMAIL;
  const store = STORES.find((s) => s.id === order.storeId);
  const storeName = store ? store.name : order.storeId;

  const sends: Promise<{ data: unknown; error: unknown }>[] = [
    resend.emails.send({
      from: FROM,
      to: order.customerEmail,
      subject: `Your Chick Rocks order — #${shortId(order.id)}`,
      html: customerHtml(order),
    }),
  ];

  if (ownerTo) {
    sends.push(
      resend.emails.send({
        from: FROM,
        to: ownerTo,
        replyTo: order.customerEmail, // owner can reply straight to the customer
        subject: `New order · ${storeName} · ${formatCents(order.totalCents)}`,
        html: ownerHtml(order),
      })
    );
  } else {
    console.warn("ORDER_NOTIFICATION_EMAIL not set — owner copy not sent.");
  }

  const results = await Promise.allSettled(sends);
  results.forEach((r, i) => {
    const which = i === 0 ? "customer" : "owner";
    if (r.status === "rejected") {
      console.error(`Order ${shortId(order.id)} ${which} email failed:`, r.reason);
    } else if (r.value?.error) {
      console.error(`Order ${shortId(order.id)} ${which} email error:`, r.value.error);
    }
  });
}
