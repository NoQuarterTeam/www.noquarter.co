import { Suspense } from "react"
import { List } from "./list"
import { ProjectFilter } from "./project-filter"

export default function Page({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  return (
    <div className="group container relative mx-auto p-4 space-y-8 md:space-y-12 pt-16">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold block">Updates</h1>

        <ProjectFilter />
      </div>

      <hr />

      <div className="space-y-12 group-has-data-pending:animate-pulse">
        <Suspense>
          <List searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
