import { redirect } from "next/navigation";

export default function RequestPage() {
  // We use /dashboard as the request wizard page.
  // This stub redirects there. Middleware ensures authentication.
  redirect("/dashboard");
}
