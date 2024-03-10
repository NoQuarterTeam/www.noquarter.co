"use server"
import { WebClient } from "@slack/web-api"
import { z } from "zod"
import { env } from "~/lib/env"

const slack = new WebClient(env.SLACK_TOKEN)

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string().min(100),
})
export async function submitContact(_: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const result = contactSchema.safeParse(data)
  if (!result.success) return { success: false, fieldErrors: result.error.flatten().fieldErrors }
  const text = `New message! From: ${data.name} - ${data.email}. Message: ${data.message} `
  if (env.NODE_ENV === "production") {
    await slack.chat.postMessage({ channel: "CE88M0M8D", text })
  }
  return { success: true }
}
