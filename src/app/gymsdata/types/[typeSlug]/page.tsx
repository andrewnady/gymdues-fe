import { redirect } from 'next/navigation'
import { toUrlSegment } from '@/lib/gymsdata-utils'

type Props = { params: Promise<{ typeSlug: string }> }

/** Legacy route: /gymsdata/types/{typeSlug} → redirect to canonical /gymsdata/{typeSlug} */
export default async function GymsdataTypeRedirectPage({ params }: Props) {
  const { typeSlug } = await params
  const segment = toUrlSegment((typeSlug ?? '').trim())
  if (!segment) redirect('/gymsdata/')
  redirect(`/gymsdata/${encodeURIComponent(segment)}`)
}
