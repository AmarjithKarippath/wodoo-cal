import { AdminDashboard } from "@/components/AdminDashboard";
import { isAdminAuthenticated } from "@/lib/auth";
import { getWaitlistCount, getWaitlistEntries } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  const entries = authenticated ? getWaitlistEntries() : [];
  const count = authenticated ? getWaitlistCount() : 0;

  return (
    <AdminDashboard
      initialAuthenticated={authenticated}
      initialEntries={entries}
      initialCount={count}
    />
  );
}
