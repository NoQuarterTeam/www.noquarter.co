import { timingSafeEqual } from "node:crypto"
import { revalidateTag } from "next/cache"
import { NOTION_CACHE_TAG } from "~/lib/cache"

export async function POST(request: Request) {
  const secret = process.env.CACHE_REVALIDATION_SECRET

  if (!secret) {
    return Response.json({ error: "CACHE_REVALIDATION_SECRET is not configured" }, { status: 500 })
  }

  if (!isValidSecret(getBearerToken(request), secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  revalidateTag(NOTION_CACHE_TAG, "max")

  return Response.json({ revalidated: true, tag: NOTION_CACHE_TAG })
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization")
  if (!authorization?.startsWith("Bearer ")) return null

  return authorization.slice("Bearer ".length)
}

function isValidSecret(value: string | null, secret: string) {
  if (!value) return false

  const valueBuffer = Buffer.from(value)
  const secretBuffer = Buffer.from(secret)

  if (valueBuffer.length !== secretBuffer.length) return false

  return timingSafeEqual(valueBuffer, secretBuffer)
}
