import type {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints"
import { unstable_cache } from "next/cache"
import { redirect } from "next/navigation"
import { notion } from "~/lib/notion"
import { upload } from "~/lib/s3"
import { NOTION_DB } from "./config"

export const getUpdates = unstable_cache(
  async (startCursor?: string, project?: string) => {
    const updates = await notion.databases.query({
      database_id: NOTION_DB,
      page_size: 20,
      start_cursor: startCursor,
      sorts: [{ property: "Date", direction: "descending" }],
      filter: project ? { property: "Project", select: { equals: project } } : undefined,
    })

    if (!updates) redirect("/")

    return await Promise.all(
      updates.results.map(async (update) => {
        const blocks = await getBlocks(update.id)
        return {
          id: update.id,
          uniqueId: getSafeProperty(update, "ID"),
          title: getSafeProperty(update, "Subject"),
          date: getSafeProperty(update, "Date"),
          project: getSafeProperty(update, "Project"),
          phase: getSafeProperty(update, "Phase"),
          content: blocks,
        }
      }),
    )
  },
  ["updates"],
)

export type Update = Awaited<ReturnType<typeof getUpdates>>[number]

const getBlocks = async (id: string) => {
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
}

function getSafeProperty(
  page: PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse,
  propertyName: string,
) {
  if (!("properties" in page)) return `No ${propertyName}`

  const property = page.properties[propertyName]
  if (!property) return `No ${propertyName}`

  switch (property.type) {
    case "unique_id":
      return "number" in property.unique_id ? property.unique_id.number : undefined
    case "title":
      return property.title.map((text) => text.plain_text).join(" ")
    case "date":
      return property.date?.start
    case "rich_text":
      return property.rich_text.map((text) => text.plain_text).join(" ")
    case "select":
      if (!property.select) return undefined
      return "name" in property.select ? property.select.name : undefined
    default:
      return `Invalid property type: ${property.type}`
  }
}
