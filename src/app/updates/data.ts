import type { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { redirect } from "next/navigation"
import { cache } from "react"
import { notion } from "~/lib/notion"
import { upload } from "~/lib/s3"
import { NOTION_DB } from "./config"

export const getPage = cache(async (id: string) => {
  const pages = await notion.databases.query({
    database_id: NOTION_DB,
    page_size: 1,
    filter: { property: "ID", number: { equals: Number(id) } },
  })

  const page = pages.results[0] as PageObjectResponse

  if (!page) redirect("/updates")

  // check name and typeguard that its a title property
  const name = page.properties.Subject
  if (name.type !== "title") redirect("/updates")
  const title = name.title[0]?.plain_text

  const blocks = await getBlocks(page.id)
  return {
    title,
    page,
    content: blocks,
  }
})

export const getBlocks = cache(async (id: string) => {
  const pageContent = await notion.blocks.children.list({ block_id: id })
  return await Promise.all(
    (pageContent.results as BlockObjectResponse[]).map(async (block) => {
      if (block.type === "image" && block.image.type === "file") {
        const imageUrl = block.image.file.url
        const url = await upload(imageUrl)
        return { ...block, image: { ...block.image, file: { ...block.image.file, url } } }
      }
      if (block.type === "video" && block.video.type === "file") {
        const videoUrl = block.video.file.url
        const url = await upload(videoUrl)
        return { ...block, video: { ...block.video, file: { ...block.video.file, url } } }
      }
      return block
    }),
  )
})
