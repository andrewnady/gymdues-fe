import { redirect } from 'next/navigation'

/**
 * /gymsdata/dataset redirects to checkout so all "Buy data" flows go direct to checkout.
 */
export default function GymsdataDatasetPage() {
  redirect('/gymsdata/checkout')
}
