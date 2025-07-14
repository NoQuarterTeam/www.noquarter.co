import dayjs from "dayjs"
import { NotionBlock } from "~/components/notion-block"
import { getUpdates, type Update } from "./data"

export async function List({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const initialUpdates = await getUpdates(undefined, searchParams)
  // const [updates, setUpdates] = useState(initialUpdates)

  // useEffect(() => {
  //   const fetchUpdates = async () => {
  //     const updates = await getUpdates()
  //   }
  // }, [])

  const groupedByDate = initialUpdates.reduce(
    (acc, post) => {
      const date = post.date
      if (!date) return acc
      if (!acc[date]) acc[date] = []
      acc[date].push(post)
      return acc
    },
    {} as Record<string, Update[]>,
  )

  return (
    <>
      {Object.entries(groupedByDate).map(([date, posts]) => (
        <div key={date} className="flex flex-col md:flex-row gap-4">
          <div className="w-sm">
            <div className="md:sticky md:top-4">
              <h2 className="text-2xl font-semibold mb-2">
                {dayjs(date).isSame(dayjs(), "day")
                  ? "Today"
                  : dayjs(date).isSame(dayjs().subtract(1, "day"), "day")
                    ? "Yesterday"
                    : dayjs(date).format("ddd, DD MMM")}
              </h2>
            </div>
          </div>
          <div className="space-y-4 w-full">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-xs w-full">
                <div className="flex font-mono text-sm justify-between border-b bg-muted">
                  <div className="px-6 py-4 flex-1 border-r">
                    <p>{post.project}</p>
                  </div>
                  <div className="px-6 py-4 flex-1 border-r">
                    <p>{post.phase}</p>
                  </div>
                  <div className="px-6 py-4 text-center">
                    <p className="text-muted-foreground whitespace-nowrap">NQ-{post.uniqueId}</p>
                  </div>
                </div>
                <div className="px-6 pt-4">
                  <h3 className="text-3xl font-bold">{post.title?.toString().trim() || post.phase}</h3>
                </div>
                <div className="px-6 pb-4">
                  {post.content.map((block) => (
                    <NotionBlock key={block.id} block={block} />
                  ))}
                </div>
                {/* <Link
								href={`/updates/${post.uniqueId}`}
								className="inline-block mt-2 text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors duration-300"
							>
								Read more &rarr;
							</Link> */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
