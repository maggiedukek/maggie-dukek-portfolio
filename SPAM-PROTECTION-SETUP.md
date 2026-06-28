# Stopping spam inquiries — setup guide

You got a junk inquiry because your contact form posted **straight to the database**
with a public key, and nothing checked whether the sender was a human. This setup adds
three layers and routes every submission through a server-side check first:

1. **Honeypot** — a hidden field bots fill and people never see. Filled = dropped.
2. **Time trap** — anything submitted in under 2 seconds is treated as a bot.
3. **Cloudflare Turnstile** — an invisible "are you human" check, verified on the server.

Submissions now go through a Supabase **Edge Function** (`submit-inquiry`) that runs all
three checks before writing to the `inquiries` table. After step 4 below, the form can no
longer write to the database directly, so a bot can't skip the form and POST junk.

> **Do the steps in order.** The website change is already made, but the form points at the
> Edge Function — so deploy the function (steps 1–3) **before** you publish the new site,
> or the form will error until it's live.

---

## 1. Get free Cloudflare Turnstile keys

1. Go to <https://dash.cloudflare.com> → **Turnstile** (left sidebar). Create a free account if needed.
2. Click **Add widget**.
   - **Widget name:** `maggiedukek contact`
   - **Domain:** `maggiedukek.com` (add `www.maggiedukek.com` too if you use it)
   - **Widget mode:** **Managed** (this is the invisible/auto one)
3. Copy the two keys it gives you:
   - **Site Key** (public, goes in the website)
   - **Secret Key** (private, goes in Supabase — never put this in the website)

### Paste the Site Key into the website
Open `newsite/contact.html`, find this line and replace the placeholder:

```html
<div class="cf-turnstile" data-sitekey="YOUR_TURNSTILE_SITE_KEY" data-theme="light" ...>
```

Change `YOUR_TURNSTILE_SITE_KEY` to your real **Site Key**. (The Secret Key does NOT go here.)

---

## 2. Add the Secret Key to Supabase

Easiest way — the dashboard:

1. Go to <https://supabase.com/dashboard> → your project (`dzjhpxkjqngqdgoefnih`).
2. **Project Settings → Edge Functions → Secrets** (or **Edge Functions → Manage secrets**).
3. Add a new secret:
   - **Name:** `TURNSTILE_SECRET_KEY`
   - **Value:** the Secret Key from Cloudflare
4. Save.

(`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are already provided automatically — you don't add those.)

---

## 3. Deploy the Edge Function

The function code is in this project at:
`maggie-dukek-portfolio/supabase/functions/submit-inquiry/index.ts`

**Option A — Supabase CLI (recommended):**

```bash
# one-time, if you don't have the CLI:
npm install -g supabase

cd maggie-dukek-portfolio
supabase login
supabase link --project-ref dzjhpxkjqngqdgoefnih
supabase functions deploy submit-inquiry --no-verify-jwt
```

`--no-verify-jwt` is important — it lets the public form call the function without a login.
The bot checks inside the function are what protect it.

**Option B — Dashboard:** Edge Functions → **Create a function** → name it `submit-inquiry`,
paste in the contents of `index.ts`, and in its settings turn **Verify JWT = OFF**. Then add
the secret from step 2 if you haven't.

---

## 4. Lock the database so bots can't bypass the form

Right now the public key can insert rows directly. Close that door so the **only** way in is
through the function.

In Supabase: **Authentication → Policies** (or **Database → Policies**) for the `inquiries` table:

1. Make sure **Row Level Security is ON** for `inquiries`.
2. **Delete / disable any policy that lets `anon` (or `public`) INSERT.** Don't add a new one.

The Edge Function uses the service-role key, which bypasses RLS — so it keeps working while
direct posts with the public key stop working.

> Quick SQL version (Supabase → **SQL Editor**), adjust the policy name if yours differs:
> ```sql
> alter table public.inquiries enable row level security;
> -- list existing policies so you can see the name to drop:
> select policyname from pg_policies where tablename = 'inquiries';
> -- then drop the anon insert policy, e.g.:
> -- drop policy "Enable insert for anon" on public.inquiries;
> ```

---

## 5. Publish the site & test

1. Publish/redeploy `newsite/` the way you normally do.
2. Open the contact page. The Turnstile check should appear/run automatically.
3. **Real test:** fill it out normally and submit → should succeed and show up in your Inquiries dashboard.
4. **Bot test (optional):** in the browser console on the contact page, run
   `document.querySelector('[name=website]').value='x'` then submit → it should *look* like
   success to you but **nothing** should appear in the dashboard.

---

## What each layer stops

| Layer | Stops |
|---|---|
| Honeypot | Basic bots that fill every field (like the one you got) |
| Time trap | Scripts that submit instantly |
| Turnstile + server verify | Smarter bots and anything POSTing directly to the endpoint |
| RLS lockdown | Bots trying to skip the form and write to the database |

If spam ever still gets through, the next lever is rate-limiting by IP inside the function —
easy to add later.
