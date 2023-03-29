import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { join } from "../lib/tailwind"

export function NotionRichText({ richText }: { richText: RichTextItemResponse }) {
  if (richText.type !== "text") return null
  if (richText.text.link) {
    return (
      <a
        href={richText.text.link.url}
        className={join("leading-relaxed inline-block underline hover:opacity-75", richText.annotations.bold && "font-bold")}
      >
        {richText.text.content}
      </a>
    )
  } else {
    return <span className={join("leading-relaxed", richText.annotations.bold && "font-bold")}>{richText.text.content}</span>
  }
}
