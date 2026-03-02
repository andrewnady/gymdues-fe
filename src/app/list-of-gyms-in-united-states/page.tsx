import { redirect } from 'next/navigation'

/** Redirect legacy URL to main gyms data page. */
export default function ListOfGymsRedirect() {
  redirect('/gymsdata')
}
