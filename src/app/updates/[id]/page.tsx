import { NotionBlock } from "~/components/notion-block"
import { getPageContent } from "./data"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
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
