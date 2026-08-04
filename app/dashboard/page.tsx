import { requireAuth } from "@/lib/auth/session";
import { SignOutButton } from "@/components/layout/sign-out-button";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Welcome{session.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        {session.user?.email && (
          <p className="text-sm text-slate-500">{session.user.email}</p>
        )}
        <div className="pt-4">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
