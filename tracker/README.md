# vsevochart-tracker

Standalone Cloudflare Worker + D1 that counts button clicks for the chart app.
Decoupled from the Next site (which is on Vercel) so it works no matter where
the frontend is hosted.

- `POST /track  { event }` — atomic `count += 1` in D1. Called by the browser
  via `sendBeacon` (see `lib/track.ts` in the main app).
- `GET /stats` — aggregated totals per event, gated behind a bearer token.
  Read this server-side from a future `/stats` page.

## One-time setup

```bash
cd tracker
npm install
npx wrangler login

# 1. Create the D1 database, then paste the printed database_id into wrangler.toml
npx wrangler d1 create vsevochart-clicks

# 2. Create the table (remote = production D1)
npm run db:init

# 3. Set the token that protects GET /stats (pick any random string)
npx wrangler secret put STATS_TOKEN

# 4. Edit wrangler.toml -> ALLOWED_ORIGINS = your live site origin
# 5. Ship it
npm run deploy
```

`deploy` prints a URL like `https://vsevochart-tracker.<you>.workers.dev`.

## Wire up the frontend

In Vercel project settings add an env var, then redeploy:

```
NEXT_PUBLIC_TRACK_URL = https://vsevochart-tracker.<you>.workers.dev
```

For local testing, put the same line in the main app's `.env.local`.
Until this var is set, `track()` no-ops — nothing breaks.

## Check it's recording

```bash
npx wrangler d1 execute vsevochart-clicks --remote \
  --command "SELECT event, SUM(count) AS total FROM clicks GROUP BY event ORDER BY total DESC"
```

## Free-tier headroom

D1 free: 100k writes/day, 5M reads/day, 5GB. One click = one write. Way inside
the limit for this app, and counters never approach the storage cap.
