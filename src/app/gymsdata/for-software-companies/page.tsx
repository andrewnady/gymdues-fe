import { redirect } from 'next/navigation'

/**
 * Guide lives at site root; redirect so /gymsdata-prefixed links work.
 */
export default function GymsdataForSoftwareCompaniesRedirect() {
  redirect('/for-software-companies')
}
