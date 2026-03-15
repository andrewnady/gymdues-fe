import Link from 'next/link'

interface AppLinkProps extends React.ComponentProps<typeof Link> {
  href: string
  children?: React.ReactNode
}

/**
 * App-level link component. Wraps Next.js Link for consistent usage
 * (e.g. gymsdata base path, styling) across the app.
 */
export function AppLink({ href, className, children, ...props }: AppLinkProps) {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  )
}
