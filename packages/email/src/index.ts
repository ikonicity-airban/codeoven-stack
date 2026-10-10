import { Resend } from "resend";
import type { ReactElement } from "react";

export { WelcomeEmail } from "./templates/welcome";

let client: Resend | undefined;
const getClient = () => (client ??= new Resend(process.env.RESEND_API_KEY));

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({ from = process.env.EMAIL_FROM, ...rest }: SendEmailInput) {
  if (!from) throw new Error("EMAIL_FROM is not set");
  const { data, error } = await getClient().emails.send({ from, ...rest });
  if (error) throw new Error(`Resend error: ${error.message}`);
  return data;
}
