<script lang="ts">
  import { onDestroy } from "svelte"
  import autoAnimate from "@formkit/auto-animate"
  import { CONTENT, type Content } from "../lib/content"
  import Card from "./Card.svelte"
  import { matchSorter } from "match-sorter"
  import { filters } from "../lib/stores"
  import Contact from "./Contact.svelte"

  let content = CONTENT
  const unsubscribe = filters.subscribe(({ search, tags, showLiked }) => {
    let filtered = CONTENT
    if (search) {
      filtered = matchSorter(CONTENT, search, { keys: ["title", "description", "tags", "meta"] })
    }
    if (tags.length > 0) {
      filtered = filtered.filter((item) => item.tags.find((tag) => tags.includes(tag)))
    }
    if (showLiked) {
      const storage = localStorage.getItem("nq.likes")
      const likes: string[] = storage ? JSON.parse(storage) : []
      filtered = filtered.filter((item) => likes.includes(item.title))
    }
    content = filtered
  })

  onDestroy(unsubscribe)

  $: shouldShowContact =
    $filters.tags.length === 0 &&
    !$filters.showLiked &&
    matchSorter([{ title: "Contact", meta: "get in contact with us" }], $filters.search, {
      keys: ["title", "meta"],
    }).length > 0

  $: chunks = content.reduce(
    (acc, item, index) => {
      const chunkIndex = (index % 3) as 0 | 1 | 2
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = []
      }
      acc[chunkIndex].push(item)
      return acc
    },
    { 0: [], 1: [], 2: [] } as { 0: Content[]; 1: Content[]; 2: Content[] },
  )
</script>

<div class="w-full grid gap-6 grid-cols-1 lg:grid-cols-3">
  {#if chunks[0].length > 0}
    <div class="space-y-6" use:autoAnimate>
      {#each chunks[0] as { meta, ...item } (item.title)}
        <Card {...item} />
      {/each}
    </div>
  {/if}
  {#if chunks[1].length > 0}
    <div class="space-y-6" use:autoAnimate>
      {#each chunks[1] as { meta, ...item } (item.title)}
        <Card {...item} />
      {/each}
    </div>
  {/if}
  {#if chunks[2].length > 0}
    <div class="space-y-6" use:autoAnimate>
      {#each chunks[2] as { meta, ...item } (item.title)}
        <Card {...item} />
      {/each}
      {#if shouldShowContact}
        <Contact />
      {/if}
    </div>
  {/if}
</div>
