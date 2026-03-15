'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getGymsdataBasePath } from '../_lib/get-gymsdata-base-path'

const ORDER_COOKIE = 'gymdues_order'

/** Server action: set order from form (no-JS fallback) and redirect to checkout. */
export async function submitOrderFromForm(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const company = (formData.get('company') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  const base = await getGymsdataBasePath()
  const checkoutPath = base === '' ? '/checkout' : `${base}/checkout`

  if (!name || !email || !company) {
    redirect(`${checkoutPath}?error=missing`)
  }

  const order = JSON.stringify({ name, email, company, message: message || undefined })
  const cookieStore = await cookies()
  cookieStore.set(ORDER_COOKIE, order, {
    path: '/',
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax',
    httpOnly: false, // so client can clear after read if desired
  })

  redirect(checkoutPath)
}
