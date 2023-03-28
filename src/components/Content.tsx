"use client"

import { Page } from "~/lib/content"
import { Card } from "./Card"
import { useFilters } from "~/lib/stores"
import { matchSorter } from "match-sorter"
import { Contact } from "./Contact"

export function Content({ content }: { content: Page[] }) {
  const { filters } = useFilters()

  const shouldShowContact =
    filters.tags.length === 0 &&
    !filters.showLiked &&
    matchSorter([{ title: "Contact", meta: "get in contact with us" }], filters.search, {
      keys: ["title", "meta"],
    }).length > 0

  let filteredContent = content

  if (filters.search) {
    filteredContent = matchSorter(content, filters.search, { keys: ["title", "description", "tags", "meta"] })
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

  return (
    <div className="w-full grid gap-6 grid-cols-1 lg:grid-cols-3">
      <div className="space-y-6">
        {chunks[0].map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
      <div className="space-y-6">
        {chunks[1].map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
      <div className="space-y-6">
        {chunks[2].map((item) => (
          <Card key={item.id} item={item} />
        ))}
        {shouldShowContact && <Contact />}
      </div>
    </div>
  )
}
