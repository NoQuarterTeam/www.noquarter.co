import { WebClient } from "@slack/web-api"
import { NextResponse } from "next/server"

import { z } from "zod"
import { env } from "~/lib/env"

const slack = new WebClient(env.SLACK_TOKEN)

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
})

export const POST = async (request: Request) => {
  const json = await request.json()
  const result = contactSchema.safeParse(json)
  if (!result.success) return NextResponse.json({ success: false }, { status: 400 })
  const data = result.data
  const text = `New message! From: ${data.name} - ${data.email}. Message: ${data.message} `
  if (process.env.NODE_ENV === "production") {
    await slack.chat.postMessage({ channel: "CE88M0M8D", text })
  }
  return NextResponse.json({ success: true }, { status: 200 })
}
