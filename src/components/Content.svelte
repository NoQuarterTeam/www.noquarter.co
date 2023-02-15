<script lang="ts">
  import autoAnimate from "@formkit/auto-animate"
  import { onDestroy } from "svelte"
  import { matchSorter } from "match-sorter"
  import Card from "./Card.svelte"
  import { filters } from "../lib/stores"
  import { CONTENT } from "../lib/content"
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

  $: shouldShowContact =
    $filters.tags.length === 0 &&
    !$filters.showLiked &&
    matchSorter([{ title: "Contact", meta: "get in contact with us" }], $filters.search, {
      keys: ["title", "meta"],
    }).length > 0

  onDestroy(unsubscribe)
</script>

<div use:autoAnimate class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {#each content as { meta, ...item } (item.link)}
    <Card {...item} />
  {/each}
  {#if shouldShowContact}
    <Contact />
  {/if}
</div>
