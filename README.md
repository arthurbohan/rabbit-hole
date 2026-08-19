# Rabbit Hole

A music explorer: type in a starting point, get five directions with an explanation of the connection and a track to get you in. Sign in with Google to sync your Crate across devices; without signing in, it's saved locally in your browser.

## Running it

Two servers, two terminals — Vite doesn't talk to Google or your database directly anymore, it proxies everything to the local Express server:

```bash
npm install

# terminal 1
npm run server:dev   # Express on :3000 — Gemini proxy, auth, crate, previews

# terminal 2
npm run dev           # Vite on :5173 — the actual app
```

Opens at http://localhost:5173

You'll need a `.env` in the project root with:

```
GEMINI_API_KEY=...       # https://aistudio.google.com/apikey — free tier, no payment needed
GOOGLE_CLIENT_ID=...     # Google Cloud Console → Credentials → OAuth client (Web application)
GOOGLE_CLIENT_SECRET=...
SESSION_SECRET=...       # any random string, signs the session cookie
PUBLIC_URL=http://localhost:5173
```

Authorized redirect URI for the OAuth client: `http://localhost:5173/api/auth/google/callback`.

## How it's built

```
index.html            font loading, entry point
vite.config.js         dev proxy: all /api/* → the local Express server
src/main.jsx           mounts React
src/App.jsx             assembles hooks and components
src/hooks/              useCrate, useExplorer, useDeepDive, useAuth
src/components/         SearchBar, Trail, BranchCard, NodeCard, CratePanel, AuthButton, ListenRow
src/api.js               model requests and prompts
src/music.js            seed list, streaming search links
src/audioPlayer.js      one 30-second preview plays at a time, page-wide
src/styles.css          all styling
server/
  index.js               entry point, starts listening
  app.js                  sessions, mounts every route, serves dist/ in prod
  db.js                    SQLite schema — users, crate_items, gemini_cache
  routes/
    gemini.js               proxies to Google with the key attached
    auth.js                  Google OAuth login flow
    crate.js                  per-user crate CRUD
    preview.js                 iTunes Search → 30-second preview URL
  services/               one file per route above, holds the actual logic
```

### About the key

The Gemini key can't live in browser code — anyone who opens DevTools would see it. So the app hits `/api/gemini/...`, and Express attaches the `x-goog-api-key` header server-side. In dev, Vite proxies that route straight through to the local Express instance (see `vite.config.js`); in production, Express handles it directly. Either way, the key never makes it into the bundle.

### Accounts & Crate

The Crate always saves locally (`localStorage`), logged in or not — that part never changes. Signing in with Google additionally syncs it to a per-user row in SQLite: on login, whatever's in your local Crate is merged into your saved one (nothing is lost), and from then on every add/remove is written to both places. The Crate panel shows a hint when you're not signed in, since in that state it only lives in the current browser.

### Gemini response caching

Identical requests (same model, same prompt) are cached in SQLite (`gemini_cache`) — asking about the same starting point twice only calls Gemini once. The cache key is a hash of the exact request body, so it self-invalidates whenever the model or prompt text changes; no manual cache-clearing needed.

### Track previews

The play button next to "Listen" hits `/api/preview`, which asks the iTunes Search API for a 30-second preview clip — no key needed, but also no guarantee: niche/obscure names sometimes have nothing in Apple's catalog. Only one preview plays at a time across the whole page.

### Deploying

```bash
npm run build   # bundles the frontend into dist/
npm run start   # Express serves dist/, proxies Gemini/preview, handles auth + crate
```

`npm run start` reads `.env` via Node's built-in `--env-file` flag — no `dotenv` package needed. Set `PORT` to change the listening port (defaults to 3000), and update `PUBLIC_URL` plus the OAuth client's authorized redirect URI to match your real domain.

Note the database is a local SQLite file (`server/data.sqlite`) — most free hosting tiers wipe local disk on every redeploy/restart, so double-check that before picking a host.

### Model

The model string lives in `src/api.js` (`MODEL`). Model names change — the current list is at https://ai.google.dev/gemini-api/docs/models

## What's left to do

- Export the Crate as text or a playlist
- Sync the whole route (trail), not just the Crate, to the database per signed-in user — it currently only survives a reload via `localStorage`, not a cross-device login
- Playwright tests — `data-testid` attributes are already in place in the markup
