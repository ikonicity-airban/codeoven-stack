# Build from the repo root:  docker build -f docker/api.Dockerfile -t api .
FROM node:22-alpine AS base
RUN corepack enable
ENV HUSKY=0

FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm dlx turbo@2 prune @template/api --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@template/api

# The API is bundled into a single file (tsup), so the runtime image needs no node_modules.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=8787
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 api
COPY --from=installer --chown=api:nodejs /app/apps/api/dist ./dist
USER api
EXPOSE 8787
CMD ["node", "dist/server.js"]
