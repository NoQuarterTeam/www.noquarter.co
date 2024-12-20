import { useActionState } from "react"
import { submitContact } from "~/app/actions"
import { Card } from "~/components/card"

const inputClassName =
  "relative w-full rounded-sm border border-gray-700 bg-gray-800/50 px-2 py-2 font-mono shadow-2xl transition-colors hover:border-gray-600 md:px-5 md:py-3 placeholder:text-gray-400"

export function Contact() {
  const [state, action, isLoading] = useActionState(submitContact, undefined)

  return (
    <Card
      item={{
        title: "Contact us",
        tags: ["Contact"],
        description: null,
        image: null,
        slug: null,
        id: "contact",
        meta: "contact",
        isLikeable: false,
        externalLink: null,
      }}
    >
      <form action={action}>
        {state?.success ? (
          <div className="space-y-2 py-9 text-center">
            <p className="text-2xl">Thank you for your message!</p>
            <p className="text-lg">We will get back to you as soon as possible.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="name" className="block">
              <span className="w-32">Name</span>
              <input id="name" name="name" required minLength={2} className={inputClassName} />
              {state?.fieldErrors?.name?.map((error) => (
                <p key={error} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}
            </label>
            <label htmlFor="email" className="block">
              <span className="w-32">Email</span>
              <input id="email" required name="email" type="email" className={inputClassName} />
              {state?.fieldErrors?.email?.map((error) => (
                <p key={error} className="text-red-500 text-sm">
                  {error}
                </p>
              ))}
            </label>
            <label htmlFor="message" className="block">
              <span className="w-32">
                Message <span className="text-xs opacity-50">(Min 50 chars)</span>
              </span>
              <textarea rows={5} required id="message" name="message" minLength={50} className={inputClassName} />
              {state?.fieldErrors?.message?.map((error) => (
                <p key={error} className="-mt-1.5 text-red-500 text-sm">
                  {error}
                </p>
              ))}
            </label>
            <div className="opacity-0 h-0">
              <label htmlFor="phone">Phone Number (Required)</label>
              <input id="phone" name="phone" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-sm bg-gray-700 px-3 py-2 transition-colors hover:bg-gray-600 md:px-8 md:py-3"
            >
              {isLoading ? "Sending..." : "Send it"}
            </button>
          </div>
        )}
      </form>
    </Card>
  )
}
