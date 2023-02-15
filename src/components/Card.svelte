<script lang="ts">
  import { join } from "../lib/tailwind"
  import { tilt } from "../lib/tilt"

  export let title: string
  export let description: string
  export let tags: string[]
  export let link: string
</script>

<a href={link} use:tilt>
  <div
    class="relative p-8 flex flex-col justify-between space-y-3 bg-neutral-700/30 bg-gradient-to-bl from-purple-900/10 to-pink-900/5 shadow-2xl border border-neutral-600/60 rounded-3xl hover:border-neutral-500/60 transition-colors"
  >
    <div>
      <p class="text-3xl">{title}</p>
      <p class="opacity-70 h-28">{description}</p>
    </div>
    <div class="flex space-x-2">
      {#each tags as tag}
        <span
          class={join(
            "px-3 py-1 text-sm text-neutral-100 rounded-full",
            tag === "About" && "bg-yellow-500/60",
            tag === "Projects" && "bg-teal-500/60",
            tag === "Internals" && "bg-purple-500/60",
            tag === "Inspiration" && "bg-pink-500/60",
          )}
        >
          {tag}
        </span>
      {/each}
    </div>
  </div>
</a>
