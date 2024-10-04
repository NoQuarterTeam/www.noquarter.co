import { create } from "zustand"

type Filter = {
  search: string
  tags: string[]
  showLiked: boolean
}
export const useFilters = create<{
  filters: Filter
  setSearch: (search: string) => void
  toggleTag: (tag: string) => void
  toggleShowLiked: () => void
}>((set) => ({
  filters: {
    search: "",
    tags: [],
    showLiked: false,
  },
  setSearch: (search) => set((existing) => ({ ...existing, filters: { ...existing.filters, search } })),
  toggleTag: (tag) =>
    set((existing) => ({
      ...existing,
      filters: {
        ...existing.filters,
        tags: existing.filters.tags.includes(tag)
          ? existing.filters.tags.filter((t) => t !== tag)
          : [...existing.filters.tags, tag],
      },
    })),
  toggleShowLiked: () =>
    set((existing) => ({ ...existing, filters: { ...existing.filters, showLiked: !existing.filters.showLiked } })),
}))
