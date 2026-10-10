import { Button } from "@template/ui";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Monorepo template</h1>
      <p className="text-muted-foreground opacity-70">
        Next.js + Hono + Drizzle + Supabase. Edit <code>apps/web/src/app/page.tsx</code> to start.
      </p>
      <Button>Get started</Button>
    </main>
  );
}
