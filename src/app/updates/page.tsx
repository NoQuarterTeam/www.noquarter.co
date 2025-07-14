import { getUpdates } from "./data"
import { List } from "./list"
import { ProjectFilter } from "./project-filter"

export default async function Page({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const { project } = await searchParams
  const initialUpdates = await getUpdates(undefined, project)

  return (
    <div className="group container relative mx-auto p-4 space-y-8 md:space-y-12 pt-16">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold block">Updates</h1>

        <ProjectFilter />
      </div>

      <hr />

      <div className="space-y-12 group-has-data-pending:animate-pulse">
        <List initialUpdates={initialUpdates} />
      </div>
    </div>
  )
}
