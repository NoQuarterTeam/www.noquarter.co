import Link, { type LinkProps } from "next/link"

export function MaybeLink({
  href,
  ...props
}: { href: string | undefined | null; children: React.ReactNode } & Omit<LinkProps, "href"> & {}) {
  if (!href) return <>{props.children}</>
  if (href.startsWith("http"))
    return (
      <a {...props} href={href} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    )
  return (
    <Link href={href} {...props}>
      {props.children}
    </Link>
  )
}
