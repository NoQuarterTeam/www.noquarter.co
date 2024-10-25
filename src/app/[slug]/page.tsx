import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { InstagramFeed } from "~/components/InstagramFeed"
import { NotionBlock } from "~/components/NotionBlock"
import { notion } from "~/lib/notion"
import { getPageContent } from "./data"

export async function generateStaticParams() {
  const pages = await notion.databases.query({
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

  return (pages.results as PageObjectResponse[])
    .map((page) => ({
      slug: page.properties.Slug.type === "rich_text" ? page.properties.Slug.rich_text[0]?.plain_text : undefined,
    }))
    .filter(Boolean)
}

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const page = await getPageContent((await params).slug)
  if (!page) return { title: "Not found", description: "Not found", keywords: null }
  const { title, page: pageData } = page
  const description =
    pageData.properties.Description.type === "rich_text" ? pageData.properties.Description.rich_text[0]?.plain_text : null
  const keywords =
    pageData.properties.Meta.type === "rich_text" ? pageData.properties.Meta.rich_text[0]?.plain_text.split(" ") : null
  return { title, description, keywords }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const { page, content } = await getPageContent(slug)

  const instagramEmbedId =
    page.properties.Instagram && page.properties.Instagram.type === "rich_text" && page.properties.Instagram.rich_text.length > 0
      ? page.properties.Instagram.rich_text[0].plain_text
      : null

  return (
    <>
      <div>
        {content.map((block) => (
          <NotionBlock key={block.id} block={block} />
        ))}
      </div>
      {instagramEmbedId && <InstagramFeed instagramEmbedId={instagramEmbedId} />}
    </>
  )
}
