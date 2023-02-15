import { WebClient } from "@slack/web-api"
import type { APIRoute } from "astro"
import { z } from "zod"

const slack = new WebClient(import.meta.env.SLACK_TOKEN)

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
})

export const post: APIRoute = async ({ request }) => {
  const json = await request.json()
  const result = contactSchema.safeParse(json)
  if (!result.success) return new Response(JSON.stringify({ success: false }), { status: 400 })
  const data = result.data
  const text = `New message! From: ${data.name} - ${data.email}. Message: ${data.message} `
  if (import.meta.env.PROD) {
    await slack.chat.postMessage({ channel: "CE88M0M8D", text })
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
