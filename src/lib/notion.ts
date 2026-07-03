import { Client } from "@notionhq/client"
import { cacheLife, cacheTag } from "next/cache"
import { NOTION_CACHE_TAG } from "./cache"
import { env } from "./env"

export const NOTION_CONTENT_DATABASE_ID = "e031ba1c28de4e3dbe8298e2da42ea68"

export const notion = new Client({ auth: env.NOTION_TOKEN })

export async function getContentDataSourceId() {
  "use cache"
  cacheLife("max")
  cacheTag(NOTION_CACHE_TAG)

  const database = await notion.databases.retrieve({ database_id: NOTION_CONTENT_DATABASE_ID })
  if (!("data_sources" in database)) {
    throw new Error(`Unable to retrieve data sources for Notion database ${NOTION_CONTENT_DATABASE_ID}`)
  }

  const dataSource = database.data_sources[0]

  if (!dataSource) {
    throw new Error(`No data source found for Notion database ${NOTION_CONTENT_DATABASE_ID}`)
  }

  return dataSource.id
}
