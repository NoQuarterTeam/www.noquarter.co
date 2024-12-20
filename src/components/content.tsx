"use client"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { matchSorter } from "match-sorter"
import type { Page } from "~/lib/content"
import { useFilters } from "~/lib/stores"
import { Contact } from "../app/contact"
import { Card } from "./card"

export function Content({ content }: { content: Page[] }) {
  const { filters } = useFilters()

  const shouldShowContact =
    matchSorter([{ title: "Contact", meta: "get in contact with us contact us" }], filters.search, {
      keys: ["title", "meta"],
      threshold: matchSorter.rankings.ACRONYM,
    }).length > 0 || filters.tags.includes("Contact")

  let filteredContent = content
  let contactColumn = 1

  if (filters.search) {
    filteredContent = matchSorter(content, filters.search, {
      keys: [
        { key: "title", threshold: matchSorter.rankings.CONTAINS },
        { key: "description", threshold: matchSorter.rankings.CONTAINS },
        { key: "tags", threshold: matchSorter.rankings.CONTAINS },
        { key: "meta", threshold: matchSorter.rankings.CONTAINS },
      ],
      threshold: matchSorter.rankings.NO_MATCH,
    })
  }
  if (filters.tags.length > 0) {
    filteredContent = filteredContent.filter((item) => item.tags.find((tag) => filters.tags.includes(tag)))
  }
  if (filters.showLiked) {
    const storage = localStorage.getItem("nq.likes")
    const likes: string[] = storage ? JSON.parse(storage) : []
    filteredContent = filteredContent.filter((item) => likes.includes(item.title))
  }

  const chunks = filteredContent.reduce(
    (acc, item, index) => {
      const chunkIndex = (index % 3) as 0 | 1 | 2
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = []
      }
      acc[chunkIndex].push(item)
      return acc
    },
    { 0: [], 1: [], 2: [] } as { 0: Page[]; 1: Page[]; 2: Page[] },
  )

  const [parent] = useAutoAnimate()

  if (filteredContent.length % 3 === 2) {
    contactColumn = 3
  } else if (filteredContent.length % 3 === 1) {
    contactColumn = 2
  } else if (filteredContent.length % 3 === 0) {
    contactColumn = 1
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6" ref={parent}>
        {chunks[0].map((item) => (
          <Card key={item.id} item={item} />
        ))}
        {contactColumn === 1 && shouldShowContact && <Contact />}
      </div>
      <div className="space-y-6" ref={parent}>
        {chunks[1].map((item) => (
          <Card key={item.id} item={item} />
        ))}
        {contactColumn === 2 && shouldShowContact && <Contact />}
      </div>
      <div className="space-y-6" ref={parent}>
        {chunks[2].map((item) => (
          <Card key={item.id} item={item} />
        ))}
        {contactColumn === 3 && shouldShowContact && <Contact />}
      </div>
    </div>
  )
}
