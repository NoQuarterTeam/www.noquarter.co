import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { notion } from "~/lib/notion"
import { redirect } from "next/navigation"
import { NotionBlock } from "~/components/NotionBlock"
import { cache } from "react"

const getPageContent = cache(async (slug: string) => {
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
  return {
    title,
    page,
    content: pageContent.results as BlockObjectResponse[],
  }
})

export const revalidate = 3000

export const generateMetadata = async function ({ params: { slug } }: { params: { slug: string } }) {
  const { title, page } = await getPageContent(slug)
  const description =
    page.properties.Description.type === "rich_text" ? page.properties.Description.rich_text[0].plain_text : null
  const keywords = page.properties.Meta.type === "rich_text" ? page.properties.Meta.rich_text[0].plain_text.split(" ") : null
  return { title, description, keywords }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const { title, content } = await getPageContent(slug)

  return (
    <>
      <h1 className="mb-10 text-center text-5xl">{title}</h1>
      {content.map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </>
  )
}
