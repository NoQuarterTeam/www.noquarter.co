import NextLink, { LinkProps } from "next/link"

export function MaybeLink({
  href,
  ...props
}: { href: string | undefined; children: React.ReactNode } & Omit<LinkProps, "href"> & {}) {
  if (!href) return <>{props.children}</>
  return (
    <NextLink href={href} {...props}>
      {props.children}
    </NextLink>
  )
}
