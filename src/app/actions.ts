"use server"
import { z } from "zod"
import { env } from "~/lib/env"

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
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${env.SLACK_TOKEN}`)
    headers.append("Content-Type", "application/json")
    const body = JSON.stringify({ channel: "CE88M0M8D", text })
    await fetch("https://slack.com/api/chat.postMessage", { method: "post", headers, body })
  }
  return { success: true }
}
