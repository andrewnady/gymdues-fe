'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateGymPage(slug: string) {
  revalidatePath(`/gyms/${slug}`)
}
