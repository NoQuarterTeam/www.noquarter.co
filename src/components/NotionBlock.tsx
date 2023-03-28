import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"

import { NotionRichText } from "./NotionRichText"
import Image from "next/image"

interface Props {
  block: BlockObjectResponse
}

export function NotionBlock({ block }: Props) {
  const renderBlock = () => {
    switch (block.type) {
      case "paragraph":
        if (block.paragraph.rich_text.length === 0) return <br />
        return (
          <p className="mb-2">
            {block.paragraph.rich_text.map((richText, i) => (
              <NotionRichText key={i} richText={richText} />
            ))}
          </p>
        )
      case "image":
        return (
          <div className="relative mb-2">
            <Image
              src={block.image.type === "external" ? block.image.external.url : block.image.file.url}
              width={700}
              height={420}
              // aspectRatio={5 / 3}
              quality={90}
              // position="north"
              className="object-cover"
              // fit="cover"
              alt={block.image.caption?.[0]?.plain_text}
            />
            {block.image.caption && block.image.caption.length > 0 ? (
              <p className="absolute bottom-0 left-0 w-full bg-black/50 p-2 text-center text-xs text-white">
                {block.image.caption.map((richText, i) => (
                  <NotionRichText key={i} richText={richText} />
                ))}
              </p>
            ) : null}
          </div>
        )
      case "heading_1":
        if (block.heading_1.rich_text.length === 0) return <br />
        return (
          <h1 className="mb-2 text-4xl font-bold">
            {block.heading_1.rich_text.map((richText, i) => (
              <NotionRichText key={i} richText={richText} />
            ))}
          </h1>
        )
      case "heading_2":
        if (block.heading_2.rich_text.length === 0) return <br />
        return (
          <h1 className="mb-2 text-4xl font-bold">
            {block.heading_2.rich_text.map((richText, i) => (
              <NotionRichText key={i} richText={richText} />
            ))}
          </h1>
        )
      case "heading_3":
        if (block.heading_3.rich_text.length === 0) return <br />
        return (
          <h1 className="mb-2 text-4xl font-bold">
            {block.heading_3.rich_text.map((richText, i) => (
              <NotionRichText key={i} richText={richText} />
            ))}
          </h1>
        )
      case "divider":
        return <hr className="mb-2 border-neutral-600" />
      default:
        return null
    }
  }
  return <>{renderBlock()}</>
}
