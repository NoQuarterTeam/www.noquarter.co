"use cache"
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client"
import { unstable_cacheLife as cacheLife } from "next/cache"
import Link from "next/link"
import { notion } from "~/lib/notion"
import { NOTION_DB } from "./config"

const getSafeProperty = (
  page: PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse,
  propertyName: string,
) => {
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

export default async function Page() {
  cacheLife("hours")
  const content = await notion.databases.query({
    database_id: NOTION_DB,
    sorts: [{ property: "Date", direction: "descending" }],
  })

  const posts = content.results.map((result) => {
    return {
      id: result.id,
      uniqueId: getSafeProperty(result, "ID"),
      title: getSafeProperty(result, "Subject"),
      date: getSafeProperty(result, "Date"),
      project: getSafeProperty(result, "Project"),
      phase: getSafeProperty(result, "Phase"),
    }
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Updates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="p-6 border rounded-xs shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <div className="text-sm mb-3 space-y-1">
              <p>
                <span className="font-medium">Date:</span> {post.date}
              </p>
              <p>
                <span className="font-medium">Project:</span> {post.project}
              </p>
              <p>
                <span className="font-medium">Phase:</span> {post.phase}
              </p>
            </div>
            <Link
              href={`/updates/${post.uniqueId}`}
              className="inline-block mt-2 text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors duration-300"
            >
              Read more &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
