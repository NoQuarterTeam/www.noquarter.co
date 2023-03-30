import S3 from "aws-sdk/clients/s3"
import { env } from "./env"
import axios from "axios"
import stream from "stream"

const client = new S3({
  signatureVersion: "v4",
  region: "eu-central-1",
  credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY },
})

const S3_BUCKET = "www.noquarter.co"

const CLOUDFRONT_URL = "https://d23esfr6ddgb3k.cloudfront.net"

export async function upload(imageUrl: string): Promise<string> {
  // imageUrl contains a load of aws stuff, so we need to extract the path to use as the key
  const url = new URL(imageUrl)
  const key = "images" + url.pathname
  await client
    .getObject({ Bucket: S3_BUCKET, Key: key })
    .promise()
    .catch(async (e) => {
      if (e.code !== "NoSuchKey") throw e
      const res = await axios.get(imageUrl, { responseType: "stream" })
      const uploadSteam = new stream.PassThrough()
      res.data.pipe(uploadSteam)
      await client
        .upload({ Bucket: S3_BUCKET, Key: key, Body: uploadSteam })
        .promise()
        .catch((putError) => {
          console.log(putError)
        })
    })
  return client.getSignedUrl("getObject", { Key: key, Bucket: S3_BUCKET })
}
