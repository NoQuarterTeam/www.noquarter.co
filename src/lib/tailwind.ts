import { twMerge, twJoin, type ClassNameValue } from "tailwind-merge"

export const merge = (...args: ClassNameValue[]) => twMerge(args)
export const join = (...args: ClassNameValue[]) => twJoin(args)
