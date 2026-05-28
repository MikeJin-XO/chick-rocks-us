import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, orders } from "@/lib/db";
import { isAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  // Only transition paid → confirmed. Re-clicking on an already-confirmed order is a no-op.
  const [row] = await db
    .update(orders)
    .set({ status: "confirmed" })
    .where(and(eq(orders.id, id), eq(orders.status, "paid")))
    .returning();

  if (!row) {
    return NextResponse.json(
      { error: "Order not found or already confirmed." },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true, order: row });
}
