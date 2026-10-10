# Add-on: documentation site (`apps/docs`)

```bash
cd apps
pnpm dlx create-fumadocs-app docs   # choose Next.js + Fumadocs MDX
```

Then: rename the package to `@template/docs`, set `"dev": "next dev --port 3001"`, extend `@template/config/tsconfig/nextjs.json`, and add `apps/docs` to Vercel as a separate project (Root Directory `apps/docs`).
