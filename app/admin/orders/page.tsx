import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin-auth";
import AdminOrders from "@/views/AdminOrders";

export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }
  return <AdminOrders />;
}
