# Add-on: admin dashboard (`apps/admin`)

```bash
cp -r apps/web apps/admin     # simplest start: same stack, same shared packages
```

Then: rename the package to `@template/admin`, change the dev port (`next dev --port 3002`), protect everything with `hasRole(role, "admin")` from `@template/auth`, and deploy as its own Vercel project / compose service.
