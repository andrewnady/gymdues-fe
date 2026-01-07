import { Dumbbell, TrendingUp, Users } from 'lucide-react'
import { ReadMoreText } from '@/components/read-more-text'

export function WhyChooseSection() {
  return (
    <section className='py-20 bg-background'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-2'>Why Choose GymDues</h2>
          <ReadMoreText className='text-muted-foreground text-lg max-w-4xl mx-auto'>
            <p>
              For Why Choose GymDues, we make it easy to find the right gym and understand the real
              cost before you commit. Instead of jumping between dozens of sites, GymDues brings
              together pricing-focused pages for the memberships people search for most—like{' '}
              <strong>la fitness membership cost</strong>, <strong>anytime fitness membership cost</strong>
              , <strong>24 hour fitness membership cost</strong>,{' '}
              <strong>lifetime gym membership cost</strong>, <strong>bay club membership cost</strong>,
              and <strong>nysc membership cost</strong>—so you can compare value quickly and
              confidently. You&apos;ll also find detailed breakdowns for popular regional and specialty
              gyms, including <strong>xsport membership cost</strong>,{' '}
              <strong>xsport fitness membership cost</strong>,{' '}
              <strong>princeton club membership cost</strong>,{' '}
              <strong>newtown athletic club membership cost</strong>, and training-focused options
              like <strong>ufc gym prices</strong>, <strong>ufc gym membership cost</strong>, and{' '}
              <strong>title boxing club prices</strong>.
            </p>
            <p>
              GymDues goes beyond a simple &quot;monthly price&quot; by helping you compare plans and
              spot common add-ons (enrollment, annual fees, tiers, and perks) across brands—so
              searches like <strong>xsport membership plans</strong>,{' '}
              <strong>fitness connection membership prices</strong>,{' '}
              <strong>fitness 19 membership cost</strong>, <strong>pure barre membership cost</strong>,
              and <strong>orangetheory membership cost</strong> don&apos;t turn into surprises at
              checkout. And with real reviews and clear comparisons, you can choose the best gym for
              your location, goals, and budget—without wasting time or overpaying.
            </p>
          </ReadMoreText>
        </div>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
              <Dumbbell className='h-8 w-8 text-primary' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Comprehensive Listings</h3>
            <p className='text-muted-foreground'>
              Browse hundreds of gyms with detailed information about facilities, plans, and
              amenities.
            </p>
          </div>
          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
              <TrendingUp className='h-8 w-8 text-primary' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Compare Plans</h3>
            <p className='text-muted-foreground'>
              Easily compare membership plans, prices, and features to find the best fit for your
              budget.
            </p>
          </div>
          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
              <Users className='h-8 w-8 text-primary' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Real Reviews</h3>
            <p className='text-muted-foreground'>
              Read authentic reviews from members to make informed decisions about your fitness
              journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

