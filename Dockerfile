FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

# Not `npm run start` — that script hardcodes --env-file=.env, and no .env
# ships in the image (it's gitignored, holds real API keys). Env vars come
# from docker-compose's `environment:` instead, already in the process env
# by the time this runs.
CMD ["node", "server/index.js"]
