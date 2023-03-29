import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { notion } from "~/lib/notion"

export default async function Sitemap() {
  const content = await notion.databases.query({
    database_id: "e031ba1c28de4e3dbe8298e2da42ea68",
    filter: { property: "Public", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  })
  const pages = (content.results as PageObjectResponse[]).map((page) => ({
    url: `https://www-noquarter-co-next.vercel.app/${
      page.properties.Slug.type === "rich_text" ? page.properties.Slug.rich_text[0].plain_text : ""
    }`,
  }))
  const routes = [""].map((route) => ({
    url: `https://www-noquarter-co-next.vercel.app${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  return [...routes, ...pages]
}
