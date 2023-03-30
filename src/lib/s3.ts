import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { env } from "./env"
import axios from "axios"

const REGION = "eu-central-1"
const S3_BUCKET = "www.noquarter.co"
const CLOUDFRONT_URL = "https://d23esfr6ddgb3k.cloudfront.net"

const client = new S3Client({
  region: REGION,
  credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY },
})

export async function upload(imageUrl: string): Promise<string> {
  // imageUrl contains a load of aws stuff, so we need to extract the path to use as the key
  const url = new URL(imageUrl)
  const key = "images" + url.pathname
  const getCommand = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key })

  await client.send(getCommand).catch(async (e) => {
    if (e.Code !== "NoSuchKey") throw e
    const res = await axios.get(imageUrl, { responseType: "stream" })
    if (!res.data) throw new Error("No image for " + key)
    const uploader = new Upload({ client, params: { Bucket: S3_BUCKET, Key: key, Body: res.data, ACL: "public-read" } })
    await uploader.done()
  })
  return CLOUDFRONT_URL + "/" + key
}
