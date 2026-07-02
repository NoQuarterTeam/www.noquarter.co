import { HeadObjectCommand, NotFound, S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { env } from "./env"

const REGION = "eu-central-1"
const S3_BUCKET = "www.noquarter.co"
const CLOUDFRONT_URL = "https://d23esfr6ddgb3k.cloudfront.net"
const FILE_FOLDER = "files"

const client = new S3Client({
  region: REGION,
  credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY },
})

function shouldUploadAfterHeadError(error: unknown) {
  if (error instanceof NotFound) return true
  if (typeof error !== "object" || error === null) return false

  const metadata = "$metadata" in error ? error.$metadata : undefined
  const status =
    typeof metadata === "object" && metadata !== null && "httpStatusCode" in metadata ? metadata.httpStatusCode : undefined

  return status === 403 || status === 404
}

export async function upload(fileUrl: string): Promise<string> {
  // imageUrl contains a load of aws stuff, so we need to extract the path to use as the key
  const url = new URL(fileUrl)
  const key = FILE_FOLDER + url.pathname
  const headCommand = new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key })
  // check if file exists, if it does this resolves, if not it throws an error
  await client.send(headCommand).catch(async (e) => {
    if (!shouldUploadAfterHeadError(e)) throw e
    const res = await fetch(fileUrl)
    if (!res.body) throw new Error(`No file for key: ${key}`)
    const uploader = new Upload({
      client,
      params: { Bucket: S3_BUCKET, Key: key, Body: res.body, ACL: "public-read" },
    })
    await uploader.done()
  })
  return `${CLOUDFRONT_URL}/${key}`
}
