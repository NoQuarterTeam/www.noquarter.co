import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import Image from "next/image"
import { NotionRichText } from "./NotionRichText"

interface Props {
  block: BlockObjectResponse
}

export function NotionBlock({ block }: Props) {
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
            className="object-cover !max-h-[600px]"
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
        <h1 className="mb-6 mt-3 text-3xl md:text-4xl lg:text-5xl uppercase">
          {block.heading_1.rich_text.map((richText, i) => (
            <NotionRichText key={i} richText={richText} />
          ))}
        </h1>
      )
    case "heading_2":
      if (block.heading_2.rich_text.length === 0) return <br />
      return (
        <h1 className="mb-4 mt-2 text-2xl md:text-3xl uppercase">
          {block.heading_2.rich_text.map((richText, i) => (
            <NotionRichText key={i} richText={richText} />
          ))}
        </h1>
      )
    case "heading_3":
      if (block.heading_3.rich_text.length === 0) return <br />
      return (
        <h1 className="mb-2 mt-1 text-lg md:text-xl uppercase">
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
    default:
      return null
  }
}
