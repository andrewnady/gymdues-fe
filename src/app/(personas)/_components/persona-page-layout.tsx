import { AppLink } from '@/components/app-link'
import { ArrowRightCircle, Download } from 'lucide-react'
import { DownloadSampleButton } from '@/components/download-sample-button'

interface UseCase {
  title: string
  description: string
}

interface PersonaPageLayoutProps {
  /** Page title (H1) */
  title: string
  /** Subtitle / value prop under H1 */
  subtitle: string
  /** Breadcrumb label (e.g. "For Marketing Agencies") */
  breadcrumbLabel: string
  /** Short badge text above H1 (e.g. "Advanced use case") */
  badge?: string
  /** Use case cards */
  useCases: UseCase[]
  /** Optional section heading + React node (testimonials, guides, etc.) */
  extraSection?: { heading: string; children: React.ReactNode }
  /** Optional CTA text for primary button (default: Download Free Sample) */
  ctaPrimaryText?: string
  /** Optional secondary CTA label (default: "Browse full gym database") */
  ctaSecondaryLabel?: string
  /** Optional intro paragraph under subtitle */
  intro?: string
  children?: React.ReactNode
}

export function PersonaPageLayout({
  title,
  subtitle,
  breadcrumbLabel,
  badge = 'Advanced use case',
  useCases,
  extraSection,
  ctaPrimaryText = 'Download Free Sample',
  ctaSecondaryLabel = 'Browse full data',
  intro,
  children,
}: PersonaPageLayoutProps) {
  return (
    <main className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-12 lg:py-16'>
        <nav className='max-w-4xl mx-auto mb-6 text-sm text-muted-foreground' aria-label='Breadcrumb'>
          <ol className='flex flex-wrap items-center gap-1'>
            <li><AppLink href='/' className='hover:text-primary'>Home</AppLink></li>
            <li aria-hidden>/</li>
            <li><AppLink href='/gymsdata' className='hover:text-primary'>List of Fitness, Gym, and Health Services in United States</AppLink></li>
            <li aria-hidden>/</li>
            <li className='text-foreground font-medium'>{breadcrumbLabel}</li>
          </ol>
        </nav>

        <header className='max-w-4xl mx-auto text-center mb-12'>
          {badge && (
            <p className='text-xs font-medium uppercase tracking-[0.2em] text-primary/90 mb-4'>{badge}</p>
          )}
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4'>
            {title}
          </h1>
          <p className='text-lg md:text-xl text-muted-foreground mb-4'>
            {subtitle}
          </p>
          {intro && <p className='text-muted-foreground max-w-2xl mx-auto mb-8'>{intro}</p>}
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <DownloadSampleButton variant='primary' className='rounded-xl px-6 py-3.5 shadow-md'>
              <Download className='h-4 w-4' aria-hidden />
              {ctaPrimaryText}
            </DownloadSampleButton>
            <AppLink
              href='/gymsdata'
              className='inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-primary/10 px-6 py-3.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-all'
            >
              {ctaSecondaryLabel}
              <ArrowRightCircle className='h-4 w-4' />
            </AppLink>
          </div>
        </header>

        <section className='max-w-4xl mx-auto mb-16' aria-labelledby='use-cases-heading'>
          <h2 id='use-cases-heading' className='text-2xl font-semibold mb-6 text-center'>
            Use cases
          </h2>
          <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {useCases.map((uc, i) => (
              <li
                key={i}
                className='rounded-xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-shadow'
              >
                <h3 className='font-semibold text-foreground mb-2'>{uc.title}</h3>
                <p className='text-sm text-muted-foreground'>{uc.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {extraSection && (
          <section className='max-w-4xl mx-auto mb-16' aria-labelledby='extra-heading'>
            <h2 id='extra-heading' className='text-2xl font-semibold mb-6 text-center'>
              {extraSection.heading}
            </h2>
            <div className='rounded-xl border border-border/80 bg-card p-6 shadow-sm'>
              {extraSection.children}
            </div>
          </section>
        )}

        {children}

        <section className='max-w-4xl mx-auto pt-8 pb-16 text-center'>
          <p className='text-muted-foreground mb-4'>Get started with verified gym contacts.</p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <DownloadSampleButton variant='primary' className='rounded-xl px-6 py-3.5'>
              <Download className='h-4 w-4' aria-hidden />
              Download Free Sample
            </DownloadSampleButton>
            <AppLink
              href='/gymsdata'
              className='inline-flex items-center gap-2 rounded-xl border-2 border-input bg-background px-6 py-3.5 text-sm font-semibold hover:bg-muted'
            >
              View full database
              <ArrowRightCircle className='h-4 w-4' />
            </AppLink>
          </div>
        </section>
      </div>
    </main>
  )
}
