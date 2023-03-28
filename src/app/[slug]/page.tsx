import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { notion } from "~/lib/notion"
import { redirect } from "next/navigation"
import { NotionBlock } from "~/components/NotionBlock"

export const revalidate = 3000

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
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
  const title = name.title[0].plain_text

  const pageContent = await notion.blocks.children.list({ block_id: page.id })
  return (
    <>
      <h1 className="mb-10 text-center text-5xl">{title}</h1>
      {(pageContent.results as BlockObjectResponse[]).map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </>
  )
}
