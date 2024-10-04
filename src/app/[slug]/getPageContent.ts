import type { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { redirect } from "next/navigation"
import { cache } from "react"
import { notion } from "~/lib/notion"
import { upload } from "~/lib/s3"

export const getPageContent = cache(async (slug: string) => {
  const pages = await notion.databases.query({
    database_id: "e031ba1c28de4e3dbe8298e2da42ea68",
    page_size: 1,
    filter: {
      and: [
        { property: "Slug", rich_text: { equals: slug } },
        { property: "Public", checkbox: { equals: true } },
      ],
    },
  })

  const page = pages.results[0] as PageObjectResponse
  if (!page) return redirect("/")

  // check name and typeguard that its a title property
  const name = page.properties.Name
  if (name.type !== "title") redirect("/")
  const title = name.title[0]?.plain_text

  const pageContent = await notion.blocks.children.list({ block_id: page.id })
  return {
    title,
    page,
    content: await Promise.all(
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
    ),
  }
})
