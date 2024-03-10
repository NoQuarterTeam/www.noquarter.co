"use client"
import { useFilters } from "~/lib/stores"
import { join } from "~/lib/tailwind"

export function Filters() {
  const { filters, setSearch, toggleShowLiked, toggleTag } = useFilters()

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          onChange={(e) => setSearch(e.target.value)}
          className="relative w-full rounded-sm border border-gray-700 bg-gray-800/50 px-2 py-2 text-sm shadow-2xl transition-colors hover:border-gray-600 focus:bg-white/5 hover:bg-white/5 md:px-8 md:py-3 md:text-base placeholder:text-gray-400"
          placeholder="What would you like to know?"
        />
      </div>
      <div className="flex w-full flex-wrap gap-2">
        <button
          type="button"
          aria-label="filter content by about"
          onClick={() => toggleTag("About")}
          className={join(
            "rounded-sm border border-yellow-600 px-3 py-1 text-center font-light text-yellow-100 transition-colors md:px-4 md:py-2 hover:opacity-90",
            filters.tags.includes("About") ? "bg-yellow-500/60" : "hover:bg-yellow-400/5",
          )}
        >
          About
        </button>
        <button
          type="button"
          aria-label="filter content by work"
          onClick={() => toggleTag("Work")}
          className={join(
            "rounded-sm border border-teal-700 px-3 py-1 text-center font-light text-teal-100 transition-colors md:px-4 md:py-2 hover:opacity-90",
            filters.tags.includes("Work") ? "bg-teal-500/60" : "hover:bg-teal-400/5",
          )}
        >
          Work
        </button>
        <button
          type="button"
          aria-label="filter content by internals"
          onClick={() => toggleTag("Projects")}
          className={join(
            "rounded-sm border border-purple-700 px-3 py-1 text-center font-light text-purple-100 transition-colors md:px-4 md:py-2 hover:opacity-90",
            filters.tags.includes("Projects") ? "bg-purple-500/60" : "hover:bg-purple-400/5",
          )}
        >
          Projects
        </button>
        <button
          type="button"
          aria-label="filter content by challenges"
          onClick={() => toggleTag("Challenges")}
          className={join(
            "rounded-sm border border-blue-700 px-3 py-1 text-center font-light text-blue-100 transition-colors md:px-4 md:py-2 hover:opacity-90",
            filters.tags.includes("Challenges") ? "bg-blue-500/60" : "hover:bg-blue-400/5",
          )}
        >
          Challenges
        </button>
        <button
          type="button"
          aria-label="filter content by inspiration"
          onClick={() => toggleTag("Inspiration")}
          className={join(
            "rounded-sm border border-pink-700 px-3 py-1 text-center font-light text-pink-100 transition-colors md:px-4 md:py-2 hover:opacity-90",
            filters.tags.includes("Inspiration") ? "bg-pink-500/60" : "hover:bg-pink-400/5",
          )}
        >
          Inspiration
        </button>
        <button
          type="button"
          aria-label="filter content by contact"
          onClick={() => toggleTag("Contact")}
          className={join(
            "rounded-sm border border-orange-600 px-3 py-1 text-center font-light text-orange-100 transition-colors md:px-4 md:py-2 hover:opacity-90",
            filters.tags.includes("Contact") ? "bg-orange-500/60" : "hover:bg-orange-400/5",
          )}
        >
          Contact
        </button>
        <button type="button" aria-label="filter content by likes" className="px-2" onClick={toggleShowLiked}>
          <svg
            aria-hidden="true"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            className="size-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            {filters.showLiked ? (
              <path d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z" />
            ) : (
              <path d="M349.6 64c-36.4 0-70.7 16.7-93.6 43.9C233.1 80.7 198.8 64 162.4 64 97.9 64 48 114.2 48 179.1c0 79.5 70.7 143.3 177.8 241.7L256 448l30.2-27.2C393.3 322.4 464 258.6 464 179.1 464 114.2 414.1 64 349.6 64zm-80.8 329.3l-4.2 3.9-8.6 7.8-8.6-7.8-4.2-3.9c-50.4-46.3-94-86.3-122.7-122-28-34.7-40.4-63.1-40.4-92.2 0-22.9 8.4-43.9 23.7-59.3 15.2-15.4 36-23.8 58.6-23.8 26.1 0 52 12.2 69.1 32.5l24.5 29.1 24.5-29.1c17.1-20.4 43-32.5 69.1-32.5 22.6 0 43.4 8.4 58.7 23.8 15.3 15.4 23.7 36.5 23.7 59.3 0 29-12.5 57.5-40.4 92.2-28.8 35.7-72.3 75.7-122.8 122z" />
            )}
          </svg>
        </button>
      </div>
    </div>
  )
}
