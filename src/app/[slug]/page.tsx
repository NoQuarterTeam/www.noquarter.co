import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { notion } from "~/lib/notion"
import { redirect } from "next/navigation"
import { NotionBlock } from "~/components/NotionBlock"
import { cache } from "react"
import { upload } from "~/lib/s3"

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
  const title = name.title[0]?.plain_text

  const pageContent = await notion.blocks.children.list({ block_id: page.id })
  return {
    title,
    page,
    content: await Promise.all(
      (pageContent.results as BlockObjectResponse[]).map(async (block) => {
        if (block.type === "image" && block.image.type === "file") {
          const imageUrl = block.image.file.url
          const url = await upload(imageUrl)
          return { ...block, image: { ...block.image, file: { ...block.image.file, url } } }
        } else if (block.type === "video" && block.video.type === "file") {
          const videoUrl = block.video.file.url
          const url = await upload(videoUrl)
          return { ...block, video: { ...block.video, file: { ...block.video.file, url } } }
        }
        return block
      }),
    ),
  }
})

export const revalidate = 3000

export const generateMetadata = async function ({ params: { slug } }: { params: { slug: string } }) {
  const { title, page } = await getPageContent(slug)
  const description =
    page.properties.Description.type === "rich_text" ? page.properties.Description.rich_text[0]?.plain_text : null
  const keywords = page.properties.Meta.type === "rich_text" ? page.properties.Meta.rich_text[0]?.plain_text.split(" ") : null
  return { title, description, keywords }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const { content } = await getPageContent(slug)

  return (
    <div>
      {/* <h1 className="mb-10 text-center text-3xl md:text-4xl lg:text-5xl">{title}</h1> */}
      {content.map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </div>
  )
}
