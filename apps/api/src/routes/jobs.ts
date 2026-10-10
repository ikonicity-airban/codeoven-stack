import { functions, inngest, serve } from "@template/jobs";
import { Hono } from "hono";

export const jobs = new Hono();
jobs.on(["GET", "POST", "PUT"], "/", serve({ client: inngest, functions }));
