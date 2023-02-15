import { writable } from "svelte/store"

export const filters = writable({
  search: "",
  tags: [] as string[],
  showLiked: false,
})
