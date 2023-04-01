import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { cache } from "react"
import { Content } from "~/components/Content"
import { Filters } from "~/components/Filters"
import { Subheader } from "~/components/Subheader"
import { formatPageProperties } from "~/lib/content"
import { notion } from "~/lib/notion"
import { upload } from "~/lib/s3"

export const revalidate = 3000

const getContent = cache(async () => {
  const content = await notion.databases.query({
    database_id: "e031ba1c28de4e3dbe8298e2da42ea68",
    filter: { property: "Public", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  })

  return await Promise.all(
    (content.results as PageObjectResponse[]).map(async (page) => {
      const cover = page.cover
      if (!cover) return { ...page, cover: null }
      const imageUrl = cover.type === "external" ? cover.external.url : cover.file.url
      if (!imageUrl) return { ...page, cover: null }
      const url = await upload(imageUrl)
      return { ...page, cover: url }
    }),
  )
})

export const metadata = {
  description: "Check out some of our stuff",
}
export default async function Home() {
  const content = await getContent()
  return (
    <div className="space-y-4 lg:space-y-8 p-4 md:p-10 pb-52">
      <div className="grid w-full grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-5xl md:text-6xl">No Quarter</h1>
            <h2 className="my-8 block pb-4 text-3xl lg:hidden">
              <Subheader />
            </h2>
          </div>
          <div>
            <Filters />
          </div>
        </div>
        <div className="hidden justify-end lg:flex">
          <h2 className="max-w-xl text-right text-5xl">
            <Subheader />
          </h2>
        </div>
      </div>

      <div>
        <Content content={content.map(formatPageProperties)} />
      </div>
    </div>
  )
}
