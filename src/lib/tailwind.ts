import { type ClassNameValue, twJoin, twMerge } from "tailwind-merge"

export const merge = (...args: ClassNameValue[]) => twMerge(args)
export const join = (...args: ClassNameValue[]) => twJoin(args)
