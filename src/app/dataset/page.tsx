import { redirect } from 'next/navigation'

/**
 * /dataset is now under /gymsdata. Redirect so old links and bookmarks still work.
 */
export default function DatasetRedirect() {
  redirect('/gymsdata/dataset')
}
