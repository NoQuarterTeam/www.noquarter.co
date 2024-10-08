import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { cn } from "~/lib/utils"

export function NotionRichText({ richText }: { richText: RichTextItemResponse }) {
  if (richText.type !== "text") return null
  if (richText.text.link) {
    return (
      <a
        href={richText.text.link.url}
        className={cn("inline-block underline hover:opacity-75", richText.annotations.bold && "font-bold")}
      >
        {richText.text.content}
      </a>
    )
  }
  return <span className={cn("", richText.annotations.bold && "font-bold")}>{richText.text.content}</span>
}
