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
```

### About the key

The key can't live in browser code — anyone who opens DevTools would see it. So the app hits `/api/gemini/...`, and the Vite dev server attaches the `x-goog-api-key` header on its own side (see `configure` in `vite.config.js`). The key never makes it into the bundle.

Because of this, the built version won't work after `npm run build` — the proxy only lives in the dev server. Deploying needs a serverless function that does the same thing.

### Model

The model string lives in `src/api.js` (`MODEL`). Model names change — the current list is at https://ai.google.dev/gemini-api/docs/models

## What's left to do

- 30-second previews instead of links: serverless function → iTunes Search API → `previewUrl` → `<audio>`
- Export the Crate as text or a playlist
- Save the whole route, not just the Crate
- Playwright tests — `data-testid` attributes are already in place in the markup