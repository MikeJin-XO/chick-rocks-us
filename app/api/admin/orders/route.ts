import { NextResponse } from "next/server";
import { and, desc, gte, inArray } from "drizzle-orm";
import { db, orders } from "@/lib/db";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Last 7 days of orders that have made it past Stripe — owner-relevant statuses only.
// "pending" orders are checkout sessions in flight that may never pay, so we skip them.
export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const rows = await db
    .select()
    .from(orders)
    .where(
      and(
        inArray(orders.status, ["paid", "confirmed", "fulfilled"]),
        gte(orders.createdAt, since)
      )
    )
    .orderBy(desc(orders.createdAt))
    .limit(200);

  return NextResponse.json({ orders: rows });
}
