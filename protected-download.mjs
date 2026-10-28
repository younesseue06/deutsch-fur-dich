import { createClient } from "@supabase/supabase-js";

export default async (request) => {
  const json = (data, status = 200) => new Response(JSON.stringify(data), {
    status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "";
  const secretKey = process.env.SUPABASE_SECRET_KEY || "";
  const bucket = process.env.SUPABASE_PRIVATE_BUCKET || "private-course-pdfs";
  if (!url || !publishableKey || !secretKey) return json({ error: "Server configuration is incomplete. Check Netlify environment variables." }, 500);

  const match = (request.headers.get("authorization") || "").match(/^Bearer\s+(.+)$/i);
  if (!match) return json({ error: "Please sign in before opening or downloading a PDF." }, 401);

  let user;
  try {
    const publicClient = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await publicClient.auth.getUser(match[1]);
    if (error || !data?.user) return json({ error: "Your session is invalid or expired. Please sign in again." }, 401);
    user = data.user;
  } catch { return json({ error: "Could not verify the account. Please try again." }, 502); }

  if (!user.email || !(user.email_confirmed_at || user.confirmed_at)) {
    return json({ error: "Confirm your email address before accessing private PDFs." }, 403);
  }

  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON request." }, 400); }
  const level = String(body?.level || "").toUpperCase();
  const action = body?.action === "download" ? "download" : body?.action === "open" ? "open" : "";
  const files = { A1: "a1_diaa_abdullah.pdf", A2: "a2_diaa_abdullah.pdf", B1: "b1_diaa_abdullah.pdf" };
  const file = files[level];
  if (!file || !action) return json({ error: "Unknown PDF or action." }, 400);

  try {
    const adminClient = createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await adminClient.storage.from(bucket).createSignedUrl(file, action === "download" ? 120 : 900, action === "download" ? { download: true } : {});
    if (error || !data?.signedUrl) return json({ error: error?.message || "Could not create a temporary PDF link. Check the private bucket and file names." }, 502);
    return json({ url: data.signedUrl, expiresIn: action === "download" ? 120 : 900 });
  } catch { return json({ error: "A network error occurred while preparing the PDF." }, 502); }
};
