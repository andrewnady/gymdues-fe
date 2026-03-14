import { AppLink } from '@/components/app-link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center py-12'>
      <Card className='max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-4xl mb-2'>404</CardTitle>
          <CardDescription className='text-lg'>Gym not found</CardDescription>
        </CardHeader>
        <CardContent className='text-center space-y-4'>
          <p className='text-muted-foreground'>
            The gym you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className='flex gap-4 justify-center'>
            <Button asChild>
              <AppLink href='/gymsdata' className='inline-flex'>Browse All Gyms</AppLink>
            </Button>
            <Button variant='outline' asChild>
              <AppLink href='/' className='inline-flex'>Go Home</AppLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
