"use client";

import { createClient } from "@template/auth/client";
import { Button } from "@template/ui";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 p-8">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      {sent ? (
        <p>Check your inbox for a magic link.</p>
      ) : (
        <>
          <input
            className="border-border bg-background h-10 rounded-md border px-3"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={onSubmit}>Send magic link</Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </>
      )}
    </main>
  );
}
