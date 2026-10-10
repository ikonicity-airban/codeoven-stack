# Add-on: background worker (`apps/worker`)

For long-running work that should not live in serverless functions (VPS only):

1. Create `apps/worker` as a small Node + Hono app that mounts the Inngest handler from `@template/jobs` (same pattern as `apps/api/src/routes/jobs.ts`), or use Trigger.dev.
2. Add `docker/worker.Dockerfile` modelled on `docker/api.Dockerfile` and a `worker` service in `docker/docker-compose.yml`.
