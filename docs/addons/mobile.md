# Add-on: mobile app (`apps/mobile`, Expo)

```bash
cd apps
pnpm create expo-app mobile --template blank-typescript
```

Monorepo notes: add `node-linker=hoisted` to the root `.npmrc` (Expo/Metro needs a hoisted `node_modules`), keep shared logic in `packages/validators` and `packages/utils`, and call the Hono API with the same RPC client (`hc<AppType>`). Use `@supabase/supabase-js` with `expo-secure-store` for sessions.
