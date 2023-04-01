import { twMerge, twJoin } from "tailwind-merge"
import type { ClassNameValue } from "tailwind-merge/dist/lib/tw-join"

export const merge = (...args: ClassNameValue[]) => twMerge(args)
export const join = (...args: ClassNameValue[]) => twJoin(args)
