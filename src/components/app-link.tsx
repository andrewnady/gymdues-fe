'use client'

import { useRouter } from 'next/navigation'

export interface AppLinkProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  href: string
  children: React.ReactNode
  className?: string
  /** If true or href is external, opens in new tab */
  target?: '_blank' | string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Renders a button that navigates on click (router.push or location) instead of using href.
 * Use for all in-app and external links so navigation is via onClick.
 */
export function AppLink({
  href,
  children,
  className = '',
  target,
  onClick,
  ...rest
}: AppLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (target === '_blank') {
      window.open(href, '_blank')
      return
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:')) {
      window.location.href = href
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      window.location.href = href
    } else {
      router.push(href)
    }
  }

  return (
    <button
      type="button"
      className={`inline-block cursor-pointer border-none bg-transparent p-0 font-inherit text-inherit text-left ${className}`.trim()}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  )
}
