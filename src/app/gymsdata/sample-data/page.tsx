import { redirect } from 'next/navigation'

/**
 * Sample data is also available under /gymsdata for consistent navigation.
 */
export default function GymsdataSampleDataRedirect() {
  redirect('/sample-data')
}
