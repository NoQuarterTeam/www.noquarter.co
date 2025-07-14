import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client"
import dayjs from "dayjs"
import { NotionBlock } from "~/components/notion-block"
import { notion } from "~/lib/notion"
import { NOTION_DB } from "./config"
import { getBlocks } from "./data"

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
  const updates = await notion.databases.query({
    database_id: NOTION_DB,
    page_size: 3,
    sorts: [{ property: "Date", direction: "descending" }],
  })

  const posts = await Promise.all(
    updates.results.map(async (result) => {
      const content = await getBlocks(result.id)
      return {
        id: result.id,
        uniqueId: getSafeProperty(result, "ID"),
        title: getSafeProperty(result, "Subject"),
        date: getSafeProperty(result, "Date"),
        project: getSafeProperty(result, "Project"),
        phase: getSafeProperty(result, "Phase"),
        content,
      }
    }),
  )

  const groupedByDate = posts.reduce(
    (acc, post) => {
      const date = post.date
      if (!date) return acc
      if (!acc[date]) acc[date] = []
      acc[date].push(post)
      return acc
    },
    {} as Record<string, typeof posts>,
  )

  return (
    <div className="container relative mx-auto p-4 space-y-12 pt-16">
      <h1 className="text-3xl font-bold block">Updates</h1>

      <hr />

      <div className="space-y-12">
        {Object.entries(groupedByDate).map(([date, posts]) => (
          <div key={date} className="flex gap-4">
            <div className="w-sm">
              <div className="sticky top-4">
                <h2 className="text-2xl font-semibold mb-2">
                  {dayjs(date).isSame(dayjs(), "day")
                    ? "Today"
                    : dayjs(date).isSame(dayjs().subtract(1, "day"), "day")
                      ? "Yesterday"
                      : dayjs(date).format("ddd, DD MMM")}
                </h2>
              </div>
            </div>
            <div className="space-y-4 w-full">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-xs w-full">
                  <div className="flex font-mono text-sm justify-between border-b bg-muted">
                    <div className="px-6 py-4 flex-1 border-r">
                      <p>{post.project}</p>
                    </div>
                    <div className="px-6 py-4 flex-1 border-r">
                      <p>{post.phase}</p>
                    </div>
                    <div className="px-6 py-4 text-center">
                      <p className="text-muted-foreground whitespace-nowrap">NQ-{post.uniqueId}</p>
                    </div>
                  </div>
                  <div className="px-6 pt-4">
                    <h3 className="text-3xl font-bold">{post.title?.toString().trim() || post.phase}</h3>
                  </div>
                  <div className="px-6 pb-4">
                    {post.content.map((block) => (
                      <NotionBlock key={block.id} block={block} />
                    ))}
                  </div>
                  {/* <Link
                    href={`/updates/${post.uniqueId}`}
                    className="inline-block mt-2 text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors duration-300"
                  >
                    Read more &rarr;
                  </Link> */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
