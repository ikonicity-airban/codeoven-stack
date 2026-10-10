# Build from the repo root:  docker build -f docker/web.Dockerfile -t web .
FROM node:22-alpine AS base
RUN corepack enable
ENV HUSKY=0 NEXT_TELEMETRY_DISABLED=1

FROM base AS pruner
WORKDIR /app
COPY . .
RUN pnpm dlx turbo@2 prune @template/web --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
# Public vars are inlined at build time: pass them as build args if you use them client-side.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SKIP_ENV_VALIDATION=1
RUN pnpm turbo run build --filter=@template/web

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
