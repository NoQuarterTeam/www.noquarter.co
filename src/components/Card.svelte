<script lang="ts">
  import { tilt } from "../lib/tilt"
  export let title: string
  export let desciption: string
  export let tags: string[]
</script>

<div
  class="p-8 space-y-3 bg-neutral-800 backdrop-blur-lg bg-gradient-to-bl from-purple-900/10 to-pink-900/5 shadow-2xl border border-neutral-700 rounded-3xl"
  use:tilt={{ scale: 1 }}
>
  <p class="text-3xl">{title}</p>
  <p class="opacity-70">{desciption}</p>
  <div class="flex space-x-2">
    {#each tags as tag}
      <span class="px-3 py-1 text-sm text-neutral-100 bg-neutral-700 rounded-xl">
        {tag}
      </span>
    {/each}
  </div>
</div>
