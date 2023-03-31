import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  NOTION_TOKEN: z.string(),
  SLACK_TOKEN: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)
