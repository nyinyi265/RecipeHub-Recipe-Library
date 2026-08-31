import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";

export default async function AuthRedirectPage() {
  const session = await getCurrentSession();

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  redirect("/");
}
