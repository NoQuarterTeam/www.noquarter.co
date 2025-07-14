"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useOptimistic, useTransition } from "react"

export function ProjectFilter() {
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [optimisticValue, setOptimisticValue] = useOptimistic(searchParams?.get("project") || "")
  const router = useRouter()
  return (
    <select
      className="border px-4 min-w-[140px] py-2 bg-background hover:opacity-70 focus:border-white ring-0 focus:ring-0"
      value={optimisticValue}
      data-pending={isPending ? "" : undefined}
      onChange={(e) => {
        startTransition(() => {
          setOptimisticValue(e.target.value)
          router.push(`/updates?project=${e.target.value}`)
        })
      }}
    >
      <option value="">All</option>
      <option value="No Quarter">No Quarter</option>
      <option value="Grey Men">Grey Men</option>
    </select>
  )
}
