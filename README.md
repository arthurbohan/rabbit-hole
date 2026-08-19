# Rabbit Hole

A music explorer: type in a starting point, get five directions with an explanation of the connection and a track to get you in.

## Running it

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# paste your key into .env
npm run dev
```

Opens at http://localhost:5173

Get a key here: https://aistudio.google.com/apikey. The Gemini API is free under its generous free tier — no payment needed.

## How it's built

```
index.html          font loading, entry point
vite.config.js       dev proxy to generativelanguage.googleapis.com
src/main.jsx         mounts React
src/App.jsx           assembles hooks and components
src/hooks/            state: crate, explorer, deep dive
src/components/       markup for individual UI blocks
src/api.js             model requests and prompts
src/music.js          list of starting points, streaming links
src/styles.css        all styling
server/               production server (proxy + serves the build)
  index.js             entry point, starts listening
  app.js                wires up the proxy route and static file serving
  routes/gemini.js      HTTP layer for /api/gemini/*
  services/geminiProxy.js  forwards the request to Google with the key attached
```

### About the key

The key can't live in browser code — anyone who opens DevTools would see it. So the app hits `/api/gemini/...`, and something attaches the `x-goog-api-key` header server-side instead. In dev, that's the Vite dev server (see `configure` in `vite.config.js`); in production, it's the Express app under `server/`. Either way, the key never makes it into the bundle.

### Deploying

```bash
npm run build   # bundles the frontend into dist/
npm run start   # Express serves dist/ and proxies /api/gemini/* to Google
```

`npm run start` reads the key from `.env` via Node's built-in `--env-file` flag — no `dotenv` package needed. Set `PORT` to change the listening port (defaults to 3000).

### Model

The model string lives in `src/api.js` (`MODEL`). Model names change — the current list is at https://ai.google.dev/gemini-api/docs/models

## What's left to do

- 30-second previews instead of links: new Express route → iTunes Search API → `previewUrl` → `<audio>`
- Export the Crate as text or a playlist
- Save the whole route, not just the Crate
- Playwright tests — `data-testid` attributes are already in place in the markup