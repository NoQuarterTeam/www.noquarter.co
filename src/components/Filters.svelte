<script lang="ts">
  import { filters } from "../lib/stores"
  import { join } from "../lib/tailwind"

  function toggleTag(tag: string) {
    filters.update((current) => {
      const tags = current.tags
      const index = tags.indexOf(tag)
      if (index === -1) {
        tags.push(tag)
      } else {
        tags.splice(index, 1)
      }
      return { ...current, tags }
    })
  }
</script>

<div class="space-y-4">
  <div class="flex space-x-2">
    <input
      bind:value={$filters.search}
      class="w-full rounded-lg border border-neutral-700 bg-neutral-800 py-3 px-6 font-mono shadow-2xl transition-colors placeholder:text-neutral-400 hover:bg-neutral-700/70 focus:bg-neutral-700"
      placeholder="What do they do?"
    />
    <button class="rounded-lg bg-neutral-700 py-3 px-8 transition-colors hover:bg-neutral-600">Search</button>
  </div>
  <div class="flex space-x-2 font-mono">
    <button
      on:click={() => toggleTag("About")}
      class={join(
        "rounded-full border border-yellow-600 px-4 py-2 hover:opacity-90 transition-colors",
        $filters.tags.includes("About") ? "bg-yellow-500/60" : "hover:bg-yellow-400/5",
      )}>About</button
    >
    <button
      on:click={() => toggleTag("Projects")}
      class={join(
        "rounded-full border border-teal-700 px-4 py-2 hover:opacity-90 transition-colors",
        $filters.tags.includes("Projects") ? "bg-teal-500/60" : "hover:bg-teal-400/5",
      )}>Projects</button
    >
    <button
      on:click={() => toggleTag("Team")}
      class={join(
        "rounded-full border border-purple-700 px-4 py-2 hover:opacity-90 transition-colors",
        $filters.tags.includes("Team") ? "bg-purple-500/60" : "hover:bg-purple-400/5",
      )}>Team</button
    >
    <button
      on:click={() => toggleTag("Stuff")}
      class={join(
        "rounded-full border border-pink-700 px-4 py-2 hover:opacity-90 transition-colors",
        $filters.tags.includes("Stuff") ? "bg-pink-500/60" : "hover:bg-pink-400/5",
      )}>Stuff</button
    >
  </div>
</div>
