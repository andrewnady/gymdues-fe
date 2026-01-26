import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm text-muted-foreground', className)}
    >
      <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li
              key={item.href}
              className="flex items-center space-x-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index === 0 ? (
                <Link
                  href={item.href}
                  className={cn("flex items-center hover:text-foreground transition-colors", className)}
                  itemProp="item"
                >
                  <Home className="h-4 w-4" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              ) : (
                <>
                  <ChevronRight className={cn("h-4 w-4 text-muted-foreground/50", className)} />
                  {isLast ? (
                    <span className={cn("text-foreground font-bold", className)} itemProp="name">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn("hover:text-foreground transition-colors", className)}
                      itemProp="item"
                    >
                      <span itemProp="name">{item.label}</span>
                    </Link>
                  )}
                </>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

