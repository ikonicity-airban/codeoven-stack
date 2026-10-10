export interface SmsProvider {
  send(input: { to: string; message: string }): Promise<{ id?: string }>;
}

/** Termii (Nigeria). Docs: https://developers.termii.com */
export function createTermiiSms(
  opts: { apiKey?: string; senderId?: string; channel?: "generic" | "dnd" | "whatsapp" } = {},
): SmsProvider {
  const apiKey = opts.apiKey ?? process.env.TERMII_API_KEY;
  const from = opts.senderId ?? process.env.TERMII_SENDER_ID;
  return {
    async send({ to, message }) {
      if (!apiKey || !from) throw new Error("TERMII_API_KEY and TERMII_SENDER_ID are required");
      const res = await fetch("https://api.ng.termii.com/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          to,
          from,
          sms: message,
          type: "plain",
          channel: opts.channel ?? "generic",
        }),
      });
      const json = (await res.json()) as { message_id?: string; message?: string };
      if (!res.ok) throw new Error(`Termii error: ${json.message ?? res.statusText}`);
      return { id: json.message_id };
    },
  };
}

/** Push / in-app: implement against Expo Push, OneSignal or Novu and export a matching interface. */
export interface PushProvider {
  send(input: {
    to: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<void>;
}
