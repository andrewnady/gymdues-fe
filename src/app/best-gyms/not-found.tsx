import { redirect } from 'next/navigation'

export default function BestGymsNotFound() {
  const baseUrl = process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL
  if (baseUrl) {
    redirect(baseUrl)
  }
  redirect('/')
}
