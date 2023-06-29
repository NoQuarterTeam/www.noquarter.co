import type { BlockObjectResponse, ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import Image from "next/image"
import { notion } from "~/lib/notion"
import { NotionRichText } from "./NotionRichText"

interface Props {
  block: BlockObjectResponse
}

export async function NotionBlock({ block }: Props) {
  switch (block.type) {
    case "paragraph":
      if (block.paragraph.rich_text.length === 0) return <br />
      return (
        <p className="mb-3 text-lg font-light leading-normal">
          {block.paragraph.rich_text.map((richText, i) => (
            <NotionRichText key={i} richText={richText} />
          ))}
        </p>
      )
    case "image":
      return (
        <div className="space-y-2 mb-3">
          <Image
            src={block.image.type === "external" ? block.image.external.url : block.image.file.url}
            width={700}
            height={420}
            quality={70}
            className="object-contain !max-h-[600px]"
            alt={block.image.caption?.[0]?.plain_text || "No Quarter post image"}
          />
          {block.image.caption && block.image.caption.length > 0 ? (
            <p className="w-full text-center text-sm font-light text-white">
              {block.image.caption.map((richText, i) => (
                <NotionRichText key={i} richText={richText} />
              ))}
            </p>
          ) : null}
        </div>
      )
    case "video":
      const getYoutubeId = (fullUrl: string) => {
        // given this youtube url https://www.youtube.com/watch?v=UqJJktxCY9U or https://youtu.be/UqJJktxCY9U
        const url = fullUrl.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
        return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]
      }
      return (
        <div className="space-y-2 mb-3">
          {block.video.type === "external" && block.video.external.url.includes("youtube") ? (
            <iframe
              width="672"
              height="379"
              src={`https://www.youtube.com/embed/${getYoutubeId(block.video.external.url)}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video className="bg-gray-950 w-full mb-3 aspect-video" preload="none" controls>
              <source src={block.video.type === "external" ? block.video.external.url : block.video.file.url} type="video/mp4" />
            </video>
          )}
          {block.video.caption && block.video.caption.length > 0 ? (
            <p className="w-full text-center text-sm font-light text-white">
              {block.video.caption.map((richText, i) => (
                <NotionRichText key={i} richText={richText} />
              ))}
            </p>
          ) : null}
        </div>
      )
    case "heading_1":
      if (block.heading_1.rich_text.length === 0) return <br />
      return (
        <h1 className="mb-6 mt-3 text-xl md:text-2xl lg:text-3xl">
          {block.heading_1.rich_text.map((richText, i) => (
            <NotionRichText key={i} richText={richText} />
          ))}
        </h1>
      )
    case "heading_2":
      if (block.heading_2.rich_text.length === 0) return <br />
      return (
        <h1 className="mb-4 mt-2 text-lg md:text-xl ">
          {block.heading_2.rich_text.map((richText, i) => (
            <NotionRichText key={i} richText={richText} />
          ))}
        </h1>
      )
    case "heading_3":
      if (block.heading_3.rich_text.length === 0) return <br />
      return (
        <h1 className="mb-2 mt-1 text-md md:text-lg ">
          {block.heading_3.rich_text.map((richText, i) => (
            <NotionRichText key={i} richText={richText} />
          ))}
        </h1>
      )
    case "divider":
      return <hr className="mb-3 border-gray-600" />
    case "bulleted_list_item":
      if (block.bulleted_list_item.rich_text.length === 0) return <br />
      return (
        <li className="mb-2 pl-2">
          {block.bulleted_list_item.rich_text.map((richText, i) => (
            <NotionRichText key={i} richText={richText} />
          ))}
        </li>
      )
    case "column_list":
      const blockId = block.id
      const response = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 50,
      })
      const columns = response.results
      return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {columns.map(async (column) => {
            const colResponse = await notion.blocks.children.list({
              block_id: column.id,
              page_size: 50,
            })
            const block = colResponse.results[0] as ImageBlockObjectResponse
            const image = block.image

            return (
              <div key={column.id} className="space-y-2 mb-3 self-center">
                <Image
                  src={image.type === "external" ? image.external.url : image.file.url}
                  width={700}
                  height={420}
                  quality={70}
                  className="object-cover !max-h-[600px]"
                  alt={image.caption?.[0]?.plain_text || "No Quarter post image"}
                />
                {/* {image.caption && image.caption.length > 0 ? (
                <p className="w-full text-center text-sm font-light text-white">
                  {image.caption.map((richText, i) => (
                    <NotionRichText key={i} richText={richText} />
                  ))}
                </p>
              ) : null} */}
              </div>
            )
          })}
        </div>
      )
    default:
      return null
  }
}
