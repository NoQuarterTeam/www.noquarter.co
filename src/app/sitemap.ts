import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { notion } from "~/lib/notion"

export default async function Page() {
  const content = await notion.databases.query({
    database_id: "e031ba1c28de4e3dbe8298e2da42ea68",
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
  const pages = (content.results as PageObjectResponse[]).map((page) => ({
    url: `https://www.noquarter.co/${
      page.properties.Slug.type === "rich_text" ? page.properties.Slug.rich_text[0]?.plain_text : ""
    }`,
  }))
  const routes = [""].map((route) => ({
    url: `https://www.noquarter.co${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }))

  return [...routes, ...pages]
}
