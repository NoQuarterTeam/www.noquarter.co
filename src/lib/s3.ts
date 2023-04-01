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

export async function upload(fileUrl: string): Promise<string> {
  if (env.NODE_ENV === "development") return fileUrl
  // imageUrl contains a load of aws stuff, so we need to extract the path to use as the key
  const url = new URL(fileUrl)
  const key = FILE_FOLDER + url.pathname
  const headCommand = new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key })

  await client.send(headCommand).catch(async (e) => {
    if (!(e instanceof NotFound)) throw e
    const res = await fetch(fileUrl)
    const arrayBuffer = await res.arrayBuffer()
    const uploader = new Upload({
      client,
      params: { Bucket: S3_BUCKET, Key: key, Body: Buffer.from(arrayBuffer), ACL: "public-read" },
    })
    await uploader.done()
  })
  return CLOUDFRONT_URL + "/" + key
}
