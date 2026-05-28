"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, CheckCircle2, Loader2, Printer, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { STORES } from "@/lib/stores";
import { formatPrice } from "@/lib/data/catering-products";
import type { OrderItem } from "@/lib/db/schema";

// JSON-serialized version of an `orders` row (Dates become ISO strings on the wire).
type WireOrder = {
  id: string;
  storeId: "astoria" | "flushing";
  fulfillmentMethod: "pickup" | "delivery";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string | null;
  guestCount: number | null;
  deliveryAddress: string | null;
  notes: string | null;
  items: OrderItem[];
  subtotalCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  status: "pending" | "paid" | "confirmed" | "fulfilled" | "cancelled" | "refunded";
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
  createdAt: string;
  updatedAt: string;
};

const POLL_MS = 5000;
const SOUND_PREF_KEY = "chick-admin-sound-enabled";

// Two short sine pings — chimes loud enough to grab attention in a busy kitchen,
// soft enough not to startle. Web Audio API means no asset to ship.
function playChime() {
  if (typeof window === "undefined") return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const t0 = ctx.currentTime;
  [880, 1320].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain).connect(ctx.destination);
    const start = t0 + i * 0.22;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.45, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.6);
    osc.start(start);
    osc.stop(start + 0.65);
  });
  setTimeout(() => ctx.close().catch(() => {}), 1500);
}

const ALERT_AUDIO_SRC = "/order-alert.mp3";
const REMINDER_INTERVAL_MS = 10_000;

// Pre-generated neural-TTS clip ("You've got an order. Please confirm it.") —
// sounds dramatically better than the browser's robotic SpeechSynthesis voice.
function speak() {
  if (typeof window === "undefined") return;
  const audio = new Audio(ALERT_AUDIO_SRC);
  audio.volume = 1;
  audio.play().catch(() => {
    // Autoplay was blocked (no user gesture yet). The "Enable sound" toggle
    // primes the browser; once tapped, subsequent plays are allowed.
  });
}

function playNewOrderAlert() {
  playChime();
  setTimeout(speak, 650);
}

const storeName = (id: string) => STORES.find((s) => s.id === id)?.name ?? id;

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTimeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Prints a single order via a hidden iframe — avoids popup blockers and the
// "do you want to print the whole dashboard?" footgun.
function printOrder(order: WireOrder) {
  const lines = order.items
    .map((it) => {
      const total = formatPrice(it.unitPriceCents * it.quantity);
      const name = it.notes ? `${it.name} (${it.notes})` : it.name;
      return `<tr><td class="qty">${it.quantity}×</td><td>${escapeHtml(name)}</td><td class="r">${total}</td></tr>`;
    })
    .join("");

  const html = `<!doctype html>
<html><head><title>Order ${order.id.slice(0, 8)}</title>
<style>
  @page { margin: 12mm; }
  body { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12pt; color: #000; }
  h1 { font-size: 16pt; margin: 0 0 4pt 0; letter-spacing: 1px; }
  h2 { font-size: 11pt; margin: 12pt 0 4pt 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 2pt; }
  table { width: 100%; border-collapse: collapse; margin-top: 4pt; }
  td { padding: 2pt 0; vertical-align: top; }
  td.qty { width: 36pt; }
  td.r { text-align: right; width: 60pt; white-space: nowrap; }
  .row { display: flex; justify-content: space-between; padding: 2pt 0; }
  .total { font-weight: bold; font-size: 14pt; border-top: 2px solid #000; padding-top: 4pt; margin-top: 4pt; }
  .muted { color: #555; font-size: 10pt; }
</style></head>
<body>
  <h1>CHICK ROCKS — CATERING</h1>
  <div class="muted">${storeName(order.storeId).toUpperCase()} • Order #${order.id.slice(0, 8)}</div>
  <div class="muted">Placed ${escapeHtml(formatDateTime(order.createdAt))}</div>

  <h2>Customer</h2>
  <div>${escapeHtml(order.customerName)}</div>
  <div>${escapeHtml(order.customerPhone)}</div>
  <div>${escapeHtml(order.customerEmail)}</div>

  <h2>${order.fulfillmentMethod === "delivery" ? "Delivery" : "Pickup"}</h2>
  <div>${escapeHtml(order.notes ?? "—")}</div>
  ${order.deliveryAddress ? `<div>${escapeHtml(order.deliveryAddress)}</div>` : ""}

  <h2>Items</h2>
  <table>${lines}</table>

  <div class="row" style="margin-top: 8pt;"><span>Subtotal</span><span>${formatPrice(order.subtotalCents)}</span></div>
  <div class="row"><span>Tax</span><span>${formatPrice(order.taxCents)}</span></div>
  <div class="row"><span>Tip</span><span>${formatPrice(order.tipCents)}</span></div>
  <div class="row total"><span>TOTAL</span><span>${formatPrice(order.totalCents)}</span></div>
</body></html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc || !iframe.contentWindow) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();
  // Defer print() to next tick so the iframe has a chance to lay out.
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 1500);
  }, 50);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}

export default function AdminOrders() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [soundEnabled, setSoundEnabled] = useState(false);
  // Tracks order ids we've already seen so we only alert on the diff. `null` until
  // the first fetch lands — we seed without alerting so existing orders don't ring.
  const seenIdsRef = useRef<Set<string> | null>(null);
  const [confirming, setConfirming] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem(SOUND_PREF_KEY);
    if (stored === "1") setSoundEnabled(true);
  }, []);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to load orders");
      const json = (await res.json()) as { orders: WireOrder[] };
      return json.orders;
    },
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: true,
  });

  // Diff incoming orders against what we've seen; ring the bell for any *new* paid order.
  useEffect(() => {
    if (!data) return;
    if (seenIdsRef.current === null) {
      seenIdsRef.current = new Set(data.map((o) => o.id));
      return;
    }
    const seen = seenIdsRef.current;
    const fresh = data.filter((o) => !seen.has(o.id));
    const freshPaid = fresh.filter((o) => o.status === "paid");
    fresh.forEach((o) => seen.add(o.id));
    if (freshPaid.length > 0 && soundEnabled) {
      playNewOrderAlert();
    }
    if (freshPaid.length > 0) {
      toast.success(
        freshPaid.length === 1
          ? `New order from ${freshPaid[0].customerName}`
          : `${freshPaid.length} new orders`
      );
    }
  }, [data, soundEnabled]);

  const unconfirmedCount = useMemo(
    () => (data ?? []).filter((o) => o.status === "paid").length,
    [data]
  );

  // While any order is sitting unconfirmed, ring the alarm every 10s as a nag.
  // The initial alert on arrival still fires from the diff effect above; this
  // takes over to keep reminding until the staff hits Confirm.
  useEffect(() => {
    if (!soundEnabled || unconfirmedCount === 0) return;
    const id = setInterval(() => {
      playNewOrderAlert();
    }, REMINDER_INTERVAL_MS);
    return () => clearInterval(id);
  }, [soundEnabled, unconfirmedCount]);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem(SOUND_PREF_KEY, next ? "1" : "0");
    if (next) {
      // The toggle click counts as a user gesture — kick a chime now so the
      // AudioContext is unlocked for future automatic plays.
      playNewOrderAlert();
    }
  }, [soundEnabled]);

  const confirmOrder = useCallback(
    async (id: string) => {
      setConfirming((c) => ({ ...c, [id]: true }));
      try {
        const res = await fetch(`/api/admin/orders/${id}/confirm`, { method: "POST" });
        if (!res.ok) {
          const json = (await res.json().catch(() => ({}))) as { error?: string };
          toast.error(json.error ?? "Could not confirm order.");
          return;
        }
        toast.success("Order confirmed.");
        await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      } catch {
        toast.error("Network error. Try again.");
      } finally {
        setConfirming((c) => {
          const next = { ...c };
          delete next[id];
          return next;
        });
      }
    },
    [queryClient]
  );

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const orders = data ?? [];
  const newOrders = useMemo(() => orders.filter((o) => o.status === "paid"), [orders]);
  const recentOrders = useMemo(
    () => orders.filter((o) => o.status === "confirmed" || o.status === "fulfilled"),
    [orders]
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <h1 className="font-heading uppercase tracking-wide text-xl text-foreground">
            Chick Rocks · Orders
          </h1>
          <span className="text-xs text-muted-foreground tabular-nums">
            {isFetching ? "Updating…" : `Auto-refresh ${POLL_MS / 1000}s`}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition ${
                soundEnabled
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
              title={soundEnabled ? "Sound is on (click to test/disable)" : "Click to enable sound alerts"}
            >
              {soundEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
              {soundEnabled ? "Sound on" : "Enable sound"}
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-border text-foreground hover:bg-muted transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={signOut}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
        {!soundEnabled && (
          <div className="bg-yellow-100 text-yellow-900 text-xs px-4 py-2 text-center border-t border-yellow-200">
            Sound alerts are off — click <strong>Enable sound</strong> above so you'll hear new orders.
          </div>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-8">
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading orders…
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            Couldn't load orders. <button onClick={() => refetch()} className="underline">Try again</button>.
          </div>
        )}

        {!isLoading && !error && (
          <>
            <section>
              <h2 className="font-heading uppercase tracking-wide text-sm text-muted-foreground mb-3">
                Needs confirmation {newOrders.length > 0 && <span className="text-foreground">({newOrders.length})</span>}
              </h2>
              {newOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
                  No new orders. Keep this tab open — new orders will appear here automatically.
                </div>
              ) : (
                <div className="space-y-4">
                  {newOrders.map((o) => (
                    <OrderCard
                      key={o.id}
                      order={o}
                      highlight
                      confirming={!!confirming[o.id]}
                      onConfirm={() => confirmOrder(o.id)}
                      onPrint={() => printOrder(o)}
                    />
                  ))}
                </div>
              )}
            </section>

            {recentOrders.length > 0 && (
              <section>
                <h2 className="font-heading uppercase tracking-wide text-sm text-muted-foreground mb-3">
                  Recent
                </h2>
                <div className="space-y-3">
                  {recentOrders.map((o) => (
                    <OrderCard key={o.id} order={o} onPrint={() => printOrder(o)} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

type OrderCardProps = {
  order: WireOrder;
  highlight?: boolean;
  confirming?: boolean;
  onConfirm?: () => void;
  onPrint: () => void;
};

function OrderCard({ order, highlight, confirming, onConfirm, onPrint }: OrderCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-card p-4 shadow-sm transition ${
        highlight
          ? "border-primary/60 ring-2 ring-primary/20"
          : "border-border"
      }`}
    >
      <header className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-foreground text-background">
            {storeName(order.storeId)}
          </span>
          <StatusBadge status={order.status} />
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          Placed {formatTimeOnly(order.createdAt)}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <div className="font-semibold text-foreground">{order.customerName}</div>
          <div className="text-muted-foreground">{order.customerPhone}</div>
          <div className="text-muted-foreground break-all">{order.customerEmail}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {order.fulfillmentMethod === "delivery" ? "Delivery" : "Pickup"}
          </div>
          <div className="font-semibold text-foreground">{order.notes ?? "—"}</div>
          {order.deliveryAddress && (
            <div className="text-muted-foreground">{order.deliveryAddress}</div>
          )}
        </div>
      </div>

      <ul className="mt-3 border-t border-border pt-3 space-y-1 text-sm">
        {order.items.map((it, i) => (
          <li key={i} className="flex items-baseline gap-2">
            <span className="font-bold tabular-nums w-8 text-foreground">{it.quantity}×</span>
            <span className="flex-1 text-foreground">
              {it.name}
              {it.notes ? <span className="text-muted-foreground"> ({it.notes})</span> : null}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {formatPrice(it.unitPriceCents * it.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 border-t border-border pt-3 flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm">
          <span className="text-muted-foreground">Total </span>
          <span className="font-bold text-foreground tabular-nums">
            {formatPrice(order.totalCents)}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums ml-2">
            (subtotal {formatPrice(order.subtotalCents)} + tax {formatPrice(order.taxCents)} + tip {formatPrice(order.tipCents)})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-border text-foreground hover:bg-muted transition"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirming}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-primary text-primary-foreground disabled:opacity-60 hover:translate-y-[-1px] hover:shadow-md transition"
            >
              {confirming ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              {confirming ? "Confirming…" : "Confirm order"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: WireOrder["status"] }) {
  const styles: Record<WireOrder["status"], string> = {
    paid: "bg-yellow-100 text-yellow-900 border border-yellow-300",
    confirmed: "bg-green-100 text-green-900 border border-green-300",
    fulfilled: "bg-gray-100 text-gray-700 border border-gray-300",
    pending: "bg-gray-100 text-gray-700 border border-gray-300",
    cancelled: "bg-red-100 text-red-900 border border-red-300",
    refunded: "bg-red-100 text-red-900 border border-red-300",
  };
  const labels: Record<WireOrder["status"], string> = {
    paid: "New · paid",
    confirmed: "Confirmed",
    fulfilled: "Fulfilled",
    pending: "Pending",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
