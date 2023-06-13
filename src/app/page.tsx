import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { cache } from "react"
import { Content } from "~/components/Content"
import { Filters } from "~/components/Filters"

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
    <div className="space-y-4 lg:space-y-8 p-4 md:p-6 pb-52">
      <div className="grid w-full grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2">
        <div className="flex flex-col flex-start">
          <h1 className="text-xl md:text-xl xl:text-xl pb-4 font-bold">NO QUARTER</h1>
          <h2 className="mb-4 block text-sm lg:hidden font-sans">
            <Subheader />
          </h2>

          <div className="block">
            <Filters />
          </div>
        </div>
        <div className="hidden justify-end lg:flex">
          <h2 className="pl-0 lg:pl-8  max-w-xl text-left text-md font-sans">
            <Subheader />
          </h2>
        </div>
      </div>

      <div className="pt-8 lg:pt-20">
        <Content content={content.map(formatPageProperties)} />
      </div>
    </div>
  )
}

function Subheader() {
  return (
    <>
      We design and build digital tools that contribute to a more equitable future. We believe that digital products play a vital
      part in the transitions needed this decade, and we strive to build products that effectuate meaningful change. For this
      reason, we prioritize working on projects that establish social and environmental justice, creating a future in which all
      living beings can thrive.
    </>
  )
}
