import { Inngest } from "inngest";
import { serve as serveHono } from "inngest/hono";

/** Mount in a Hono app: `app.on(["GET","POST","PUT"], "/", serve({ client: inngest, functions }))`. */
export const serve = serveHono;

/** Inngest works on Vercel and on a VPS (self-host or cloud), so jobs stay portable. */
export const inngest = new Inngest({ id: "app" });

export const sendWelcome = inngest.createFunction(
  { id: "send-welcome" },
  { event: "user/created" },
  async ({ event, step }) => {
    await step.run("log", async () => {
      console.log("welcome flow for", event.data.email);
    });
    return { ok: true };
  },
);

export const functions = [sendWelcome];
