"use client"
import { useState } from "react"
import { Card } from "./Card"

export function Contact() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    setIsLoading(true)
    fetch("/api/contact", { method: "post", body: JSON.stringify(data) })
      .then(() => {
        e.target.reset()
        setIsSubmitted(true)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoading(true)
      })
  }
  return (
    <Card
      item={{
        title: "Contact us",
        tags: [],
        description: [],
        image: null,
        slug: null,
        id: "contact",
        meta: "contact",
        isLikeable: false,
      }}
    >
      <form onSubmit={handleSubmit}>
        {isSubmitted ? (
          <div className="text-center py-9 space-y-2">
            <p className="text-2xl">Thank you for your message!</p>
            <p className="text-lg">We will get back to you as soon as possible.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="name" className="block w-full">
              <span className="w-32">Name</span>
              <input
                id="name"
                name="name"
                required
                minLength={2}
                className="relative w-full rounded-sm border border-gray-700 bg-gray-800/50 px-2 py-2 md:py-3 md:px-5 font-mono shadow-2xl transition-colors placeholder:text-gray-400 hover:border-gray-600"
              />
            </label>
            <label htmlFor="email" className="block w-full">
              <span className="w-32">Email</span>
              <input
                id="email"
                required
                name="email"
                type="email"
                className="relative w-full rounded-sm border border-gray-700 bg-gray-800/50 px-2 py-2 md:py-3 md:px-5 font-mono shadow-2xl transition-colors placeholder:text-gray-400 hover:border-gray-600"
              />
            </label>
            <label htmlFor="message" className="block w-full">
              <span className="w-32">Message</span>
              <textarea
                rows={5}
                required
                id="message"
                name="message"
                minLength={100}
                className="resize-none relative w-full rounded-sm border border-gray-700 bg-gray-800/50 px-2 py-2 md:py-3 md:px-5 font-mono shadow-2xl transition-colors placeholder:text-gray-400 hover:border-gray-600"
              />
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-sm bg-gray-700 px-3 py-2 md:py-3 md:px-8 transition-colors hover:bg-gray-600"
            >
              {isLoading ? "Sending..." : "Send it"}
            </button>
          </div>
        )}
      </form>
    </Card>
  )
}
