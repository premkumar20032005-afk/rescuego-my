import { redirect } from "next/navigation";

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // We use /dashboard as the request wizard page.
  // This stub redirects there, forwarding the selected service (if any).
  // Middleware ensures authentication.
  const { service } = await searchParams;
  const slug = typeof service === "string" ? service : undefined;
  redirect(slug ? `/dashboard?service=${encodeURIComponent(slug)}` : "/dashboard");
}
