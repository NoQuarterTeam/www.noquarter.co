"use cache"
import { NotionBlock } from "~/components/notion-block"
import { getPageContent } from "./data"
import { unstable_cacheLife as cacheLife } from "next/cache"
// export async function generateStaticParams() {
//   const pages = await notion.databases.query({
//     database_id: NOTION_DB,
//     // filter: {
//     //   and: [
//     //     { property: "Public", checkbox: { equals: true } },
//     //     {
//     //       property: "Slug",
//     //       rich_text: { is_not_empty: true },
//     //     },
//     //   ],
//     // },
//   })

//   return (pages.results as PageObjectResponse[])
//     .map((page) => ({
//       slug: page.properties.Slug.type === "rich_text" ? page.properties.Slug.rich_text[0]?.plain_text : undefined,
//     }))
//     .filter(Boolean)
// }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  cacheLife("hours")
  const id = (await params).id
  const { page, content } = await getPageContent(id)

  const title = page.properties.Subject.type === "title" ? page.properties.Subject.title[0].plain_text : null
  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {content.map((block) => (
          <NotionBlock key={block.id} block={block} />
        ))}
      </div>
    </>
  )
}
