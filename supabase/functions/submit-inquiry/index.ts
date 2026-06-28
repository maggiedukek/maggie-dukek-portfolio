// Supabase Edge Function: submit-inquiry
// Receives contact-form submissions, blocks bots, then writes to the `inquiries` table.
//
// Checks, in order:
//   1. Honeypot field filled        -> silently drop (pretend success)
//   2. Submitted too fast (<2s)      -> silently drop (pretend success)
//   3. Cloudflare Turnstile token    -> must verify with Cloudflare, else reject
//   4. Whitelist + trim fields, require name/email/message
//   5. Insert with the service-role key (bypasses RLS)
//
// Deploy with --no-verify-jwt so the public form can call it without a login.
// Required secret: TURNSTILE_SECRET_KEY
// Auto-provided by Supabase: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or lock to "https://maggiedukek.com"
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Only these columns are ever written to the database.
const ALLOWED_FIELDS = [
  "name",
  "email",
  "phone",
  "project_type",
  "budget_setup",
  "timeline",
  "links",
  "message",
];

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  const token: string = body?.token ?? "";
  const elapsedMs: number = Number(body?.elapsed_ms ?? 0);
  const fields: Record<string, unknown> = body?.fields ?? {};

  // 1) Honeypot — a real visitor never fills this. Pretend success, store nothing.
  if (fields.website) return json({ ok: true }, 200);

  // 2) Humans take more than two seconds to fill a form. Bots don't.
  if (elapsedMs > 0 && elapsedMs < 2000) return json({ ok: true }, 200);

  // 3) Verify the Turnstile token with Cloudflare.
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return json({ error: "Server not configured" }, 500);
  if (!token) return json({ error: "Verification required" }, 403);

  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: req.headers.get("CF-Connecting-IP") ?? "",
      }),
    },
  );
  const outcome = await verifyRes.json();
  if (!outcome.success) return json({ error: "Verification failed" }, 403);

  // 4) Whitelist + sanitize.
  const clean: Record<string, string> = {};
  for (const key of ALLOWED_FIELDS) {
    const val = fields[key];
    if (val != null && String(val).trim() !== "") {
      clean[key] = String(val).trim().slice(0, 5000);
    }
  }
  if (!clean.name || !clean.email || !clean.message) {
    return json({ error: "Missing required fields" }, 400);
  }

  // 5) Insert with the service-role key (bypasses RLS).
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { error } = await supabase.from("inquiries").insert(clean);
  if (error) {
    console.error("insert failed:", error);
    return json({ error: "Could not save" }, 500);
  }

  return json({ ok: true }, 200);
});
