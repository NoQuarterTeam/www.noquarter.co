<script lang="ts">
  import { onDestroy } from "svelte"
  import { matchSorter } from "match-sorter"
  import Card from "./Card.svelte"
  import { filters } from "../lib/stores"
  import { CONTENT } from "../lib/content"

  let content = CONTENT
  const unsubscribe = filters.subscribe(({ search, tags }) => {
    let filtered = CONTENT
    filtered = matchSorter(CONTENT, search, { keys: ["title", "description", "tags"] })
    if (tags.length > 0) {
      filtered = filtered.filter((item) => item.tags.find((tag) => tags.includes(tag)))
    }
    content = filtered
  })

  onDestroy(unsubscribe)
</script>

<div class="grid grid-cols-3 gap-4">
  {#each content as item}
    <Card {...item} />
  {/each}
</div>
