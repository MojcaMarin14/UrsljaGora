# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV STRAPI_TELEMETRY_DISABLED=true
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG PUBLIC_URL
ENV PUBLIC_URL=$PUBLIC_URL
ENV NODE_ENV=production
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=1337 \
    STRAPI_TELEMETRY_DISABLED=true
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/config ./config
COPY --from=build --chown=node:node /app/src ./src
COPY --from=build --chown=node:node /app/types ./types
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/scripts ./scripts
COPY --from=build --chown=node:node /app/tsconfig.json ./tsconfig.json
RUN mkdir -p /app/database/migrations /app/.tmp && chown -R node:node /app/database /app/.tmp
USER node
EXPOSE 1337
CMD ["node", "scripts/start-production.cjs"]
