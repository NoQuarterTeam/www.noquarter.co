<script lang="ts">
  import { filters } from "../lib/stores"
  import { join } from "../lib/tailwind"

  const toggleTag = (tag: string) => {
    filters.update((current) => {
      const tags = current.tags.includes(tag) ? current.tags.filter((t) => t !== tag) : [...current.tags, tag]
      return { ...current, tags }
    })
  }
</script>

<div class="space-y-4">
  <div class="flex space-x-2">
    <input
      bind:value={$filters.search}
      class="relative w-full rounded-lg border border-neutral-700 bg-neutral-800/50 py-2 px-6 md:py-3 md:px-8 font-mono shadow-2xl transition-colors placeholder:text-neutral-400 hover:border-neutral-600"
      placeholder="What do they do?"
    />
    <button class="rounded-lg bg-neutral-700 py-2 px-6 md:py-3 md:px-8 transition-colors hover:bg-neutral-600"
      >Search</button
    >
  </div>
  <div class="scroll flex space-x-2 font-mono w-full overflow-x-auto">
    <button
      on:click={() => toggleTag("About")}
      class={join(
        "rounded-full text-center border border-yellow-600 px-3 py-1 md:px-4 md:py-2 hover:opacity-90 transition-colors",
        $filters.tags.includes("About") ? "bg-yellow-500/60" : "hover:bg-yellow-400/5",
      )}>About</button
    >
    <button
      on:click={() => toggleTag("Projects")}
      class={join(
        "rounded-full text-center border border-teal-700 px-3 py-1 md:px-4 md:py-2 hover:opacity-90 transition-colors",
        $filters.tags.includes("Projects") ? "bg-teal-500/60" : "hover:bg-teal-400/5",
      )}>Projects</button
    >
    <button
      on:click={() => toggleTag("Internals")}
      class={join(
        "rounded-full text-center border border-purple-700 px-3 py-1 md:px-4 md:py-2 hover:opacity-90 transition-colors",
        $filters.tags.includes("Internals") ? "bg-purple-500/60" : "hover:bg-purple-400/5",
      )}>Internals</button
    >
    <button
      on:click={() => toggleTag("Inspiration")}
      class={join(
        "rounded-full text-center border border-pink-700 px-3 py-1 md:px-4 md:py-2 hover:opacity-90 transition-colors",
        $filters.tags.includes("Inspiration") ? "bg-pink-500/60" : "hover:bg-pink-400/5",
      )}>Inspiration</button
    >
  </div>
</div>

<style>
  .scroll::-webkit-scrollbar {
    display: none;
  }
</style>
