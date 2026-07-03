import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { cacheLife, cacheTag } from "next/cache"
import { NOTION_CACHE_TAG } from "~/lib/cache"
import { getContentDataSourceId, notion } from "~/lib/notion"

async function getSitemapPages() {
  "use cache"
  cacheLife("max")
  cacheTag(NOTION_CACHE_TAG)

  const content = await notion.dataSources.query({
    data_source_id: await getContentDataSourceId(),
    filter: {
      and: [
        { property: "Public", checkbox: { equals: true } },
        {
          property: "Slug",
          rich_text: { is_not_empty: true },
        },
      ],
    },
  })

  return (content.results as PageObjectResponse[]).map((page) => ({
    url: `https://www.noquarter.co/${
      page.properties.Slug.type === "rich_text" ? page.properties.Slug.rich_text[0]?.plain_text : ""
    }`,
  }))
}

export default async function Page() {
  const pages = await getSitemapPages()
  const routes = [""].map((route) => ({
    url: `https://www.noquarter.co${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  return [...routes, ...pages]
}
