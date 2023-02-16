<script lang="ts">
  import { onMount } from "svelte"
  import autoAnimate from "@formkit/auto-animate"
  import { join } from "../lib/tailwind"
  import { tilt } from "../lib/tilt"
  import { filters } from "../lib/stores"
  import MaybeLink from "./MaybeLink.svelte"

  export let title: string
  export let description: string | undefined
  export let tags: string[]
  export let images: string[] | undefined
  export let link: string | undefined
  export let isLikeable: boolean

  let isLiked = false
  let isLoaded = false

  onMount(() => {
    if (isLikeable) {
      const storage = localStorage.getItem("nq.likes")
      const likes: string[] = storage ? JSON.parse(storage) : []
      isLiked = likes.includes(title)
    }
    isLoaded = true
  })

  const toggleSave = () => {
    const storage = localStorage.getItem("nq.likes")
    const likes: string[] = storage ? JSON.parse(storage) : []
    if (isLiked) {
      localStorage.setItem("nq.likes", JSON.stringify(likes.filter((item) => item !== title)))
      isLiked = false
    } else {
      localStorage.setItem("nq.likes", JSON.stringify([...likes, title]))
      isLiked = true
    }
    filters.set($filters)
  }
</script>

<div use:tilt class="relative h-min">
  <MaybeLink href={link} rel="prefetch">
    <div
      class="p-5 md:p-8 flex flex-col justify-between space-y-3 bg-neutral-700/30 bg-gradient-to-bl from-purple-900/10 to-pink-900/5 shadow-2xl border border-neutral-600/60 rounded-3xl hover:border-neutral-500/60 transition-colors"
    >
      <div class="space-y-3">
        <p class="text-2xl md:text-3xl">{title}</p>
        {#if description}
          <p class="opacity-70">{description}</p>
        {/if}
        {#if images && images.length > 0}
          {#each images as image}
            <img
              height="400"
              width="400"
              use:tilt={{ max: 3, reverse: true }}
              alt="content"
              src={`/${image}`}
              class="rounded-md shadow-xl"
            />
          {/each}
        {/if}
        <slot />
      </div>
      {#if tags.length > 0}
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
      {/if}
    </div>
  </MaybeLink>
  {#if isLikeable}
    <button
      class={join("absolute top-5 right-5 scale-0 transition-transform delay-200", isLoaded && "scale-100")}
      on:click={toggleSave}
    >
      {#if isLiked}
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          class="w-6 h-6 hover:scale-110 transition-transform opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z"
          /></svg
        >
      {:else}
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          class="w-6 h-6 hover:scale-110 transition-transform opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M349.6 64c-36.4 0-70.7 16.7-93.6 43.9C233.1 80.7 198.8 64 162.4 64 97.9 64 48 114.2 48 179.1c0 79.5 70.7 143.3 177.8 241.7L256 448l30.2-27.2C393.3 322.4 464 258.6 464 179.1 464 114.2 414.1 64 349.6 64zm-80.8 329.3l-4.2 3.9-8.6 7.8-8.6-7.8-4.2-3.9c-50.4-46.3-94-86.3-122.7-122-28-34.7-40.4-63.1-40.4-92.2 0-22.9 8.4-43.9 23.7-59.3 15.2-15.4 36-23.8 58.6-23.8 26.1 0 52 12.2 69.1 32.5l24.5 29.1 24.5-29.1c17.1-20.4 43-32.5 69.1-32.5 22.6 0 43.4 8.4 58.7 23.8 15.3 15.4 23.7 36.5 23.7 59.3 0 29-12.5 57.5-40.4 92.2-28.8 35.7-72.3 75.7-122.8 122z"
          /></svg
        >
      {/if}
    </button>
  {/if}
</div>
