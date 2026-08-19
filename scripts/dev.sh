#!/usr/bin/env bash
set -e

# Kill both child processes together on exit (including Ctrl+C), so
# neither the Express nor the Vite server is left running in the background.
trap 'kill 0' EXIT

npm run server:dev &
npm run dev &

wait
