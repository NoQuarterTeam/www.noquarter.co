"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import Tilt from "react-parallax-tilt"
import type { Page } from "~/lib/content"
import { cn } from "~/lib/utils"
import { MaybeLink } from "./MaybeLink"

export function Card({ item, children }: { item: Page; children?: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  useEffect(() => {
    if (item.isLikeable) {
      const storage = localStorage.getItem("nq.likes")
      const likes: string[] = storage ? JSON.parse(storage) : []
      const isLiked = likes.includes(item.title)
      setIsLiked(isLiked)
      setIsLoaded(true)
    }
  }, [item])

  const toggleSave = () => {
    const storage = localStorage.getItem("nq.likes")
    const likes: string[] = storage ? JSON.parse(storage) : []
    if (isLiked) {
      localStorage.setItem("nq.likes", JSON.stringify(likes.filter((likedItem) => likedItem !== item.title)))
      setIsLiked(false)
    } else {
      localStorage.setItem("nq.likes", JSON.stringify([...likes, item.title]))
      setIsLiked(true)
    }
  }

  return (
    <Tilt
      tiltReverse={true}
      glareMaxOpacity={0.1}
      glareBorderRadius="2px"
      glarePosition="all"
      tiltMaxAngleX={2}
      tiltMaxAngleY={2}
      glareEnable={true}
    >
      <div className="relative">
        <MaybeLink href={item.externalLink ?? item.slug}>
          <div className="flex flex-col justify-between space-y-3 border-2 border-white/30 p-5 shadow-2xl transition-colors hover:border-white/50 md:p-8">
            <div className="space-y-3">
              <p className="text-2xl md:text-3xl">{item.title}</p>
              {item.description && item.description.length > 0 && (
                <p className="font-light opacity-70">
                  {item.description.map((richText, i) => {
                    if (richText.type !== "text") return null
                    if (richText.text.link)
                      return (
                        <a
                          key={i}
                          href={richText.text.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`external link for ${item.title}`}
                          className={cn("inline-block underline hover:opacity-75", richText.annotations.bold && "font-bold")}
                        >
                          {richText.text.content}
                        </a>
                      )
                    return (
                      <span key={i} className={cn(richText.annotations.bold && "font-bold")}>
                        {richText.text.content}
                      </span>
                    )
                  })}
                </p>
              )}

              {item.image && (
                <div className="pt-6">
                  <Image
                    height={400}
                    width={600}
                    quality={30}
                    priority={true}
                    alt={item.title}
                    src={item.image}
                    className="w-full rounded-sm bg-transparent object-contain shadow-xl"
                  />
                </div>
              )}
              {children}
            </div>
            {item.tags.length > 0 && (
              <div className="flex space-x-2 pt-4">
                {item.tags
                  .filter((tag) => tag !== "Contact")
                  .map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-none px-3 py-1 text-gray-100 text-sm",
                        tag === "About" && "bg-yellow-500/60",
                        tag === "Work" && "bg-teal-500/60",
                        tag === "Projects" && "bg-purple-500/60",
                        tag === "Inspiration" && "bg-pink-700/60",
                        tag === "Challenges" && "bg-blue-700/60",
                      )}
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </MaybeLink>
        {item.isLikeable && (
          <button
            type="button"
            aria-label="like content"
            className={cn(
              "absolute top-2 right-2 scale-0 p-4 opacity-80 transition-transform delay-200 hover:scale-110",
              isLoaded && "scale-100",
            )}
            onClick={toggleSave}
          >
            <svg
              aria-hidden="true"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="size-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isLiked ? (
                <path d="M256 448l-30.164-27.211C118.718 322.442 48 258.61 48 179.095 48 114.221 97.918 64 162.4 64c36.399 0 70.717 16.742 93.6 43.947C278.882 80.742 313.199 64 349.6 64 414.082 64 464 114.221 464 179.095c0 79.516-70.719 143.348-177.836 241.694L256 448z" />
              ) : (
                <path d="M349.6 64c-36.4 0-70.7 16.7-93.6 43.9C233.1 80.7 198.8 64 162.4 64 97.9 64 48 114.2 48 179.1c0 79.5 70.7 143.3 177.8 241.7L256 448l30.2-27.2C393.3 322.4 464 258.6 464 179.1 464 114.2 414.1 64 349.6 64zm-80.8 329.3l-4.2 3.9-8.6 7.8-8.6-7.8-4.2-3.9c-50.4-46.3-94-86.3-122.7-122-28-34.7-40.4-63.1-40.4-92.2 0-22.9 8.4-43.9 23.7-59.3 15.2-15.4 36-23.8 58.6-23.8 26.1 0 52 12.2 69.1 32.5l24.5 29.1 24.5-29.1c17.1-20.4 43-32.5 69.1-32.5 22.6 0 43.4 8.4 58.7 23.8 15.3 15.4 23.7 36.5 23.7 59.3 0 29-12.5 57.5-40.4 92.2-28.8 35.7-72.3 75.7-122.8 122z" />
              )}
            </svg>
          </button>
        )}
      </div>
    </Tilt>
  )
}
