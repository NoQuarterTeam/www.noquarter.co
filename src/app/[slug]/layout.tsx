import Link from "next/link"

export default async function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 md:p-10 pb-52 bg-neutral-900 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-pink-900/10">
      <div className="flex flex-col flex-wrap justify-between gap-8 md:flex-row">
        <div>
          <Link
            className="w-48 rounded-md border border-neutral-600 px-3 py-1 transition-colors hover:bg-white/5 md:px-4 md:py-2"
            href="/"
          >
            <svg className="inline-block h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" fill="currentColor">
              <path d="M10.707 3.293a1 1 0 010 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"></path>
            </svg>
            Back
          </Link>
        </div>
        <div className="hidden w-48 md:block"></div>
      </div>
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  )
}
