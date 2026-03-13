import { headers } from 'next/headers'

/**
 * When the site is served on the gymsdata subdomain (e.g. gymsdata.gymdues.com),
 * returns '' so links can be built without /gymsdata/ (e.g. /california/, /trends/).
 * On the main domain returns '/gymsdata' so links are /gymsdata/california/, etc.
 * Call only from Server Components or route handlers.
 */
export async function getGymsdataBasePath(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  return host.startsWith('gymsdata.') ? '' : '/gymsdata'
}
