"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const hasMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

  if (!hasMounted) return fallback ?? null

  return children
}
