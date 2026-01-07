import { Gym } from '@/types/gym'
import { GymAutocompleteSearch } from '@/components/gym-autocomplete-search'
import { MostPopularGyms } from '@/components/most-popular-gyms'
import { ReadMoreText } from '@/components/read-more-text'

interface HeroSectionProps {
  popularGyms: Gym[]
}

export function HeroSection({ popularGyms }: HeroSectionProps) {
  return (
    <section
      className='relative pt-32 pb-24 md:pt-48 md:pb-40 bg-cover bg-center bg-no-repeat min-h-[600px] md:min-h-[700px] flex items-center -mt-16'
      style={{
        backgroundImage: 'url(/images/bg-header.jpg)',
      }}
    >
      <div className='absolute inset-0 bg-black/50' />
      <div className='container mx-auto px-4 relative z-10 w-full pt-16'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white'>
            Best Gyms in the World
          </h1>
          <ReadMoreText className='text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto'>
            <p>
              Access the latest membership pricing insights for the world&apos;s most searched gyms
              and studios—like <strong>la fitness membership cost</strong>,{' '}
              <strong>anytime fitness membership cost</strong>,{' '}
              <strong>24 hour fitness membership cost</strong>,{' '}
              <strong>lifetime gym membership cost</strong>, <strong>equinox membership cost</strong>,
              and <strong>gold&apos;s gym membership cost</strong>. We also cover high-demand regional
              and specialty brands people compare every day, including{' '}
              <strong>xsport membership cost</strong>, <strong>xsport fitness membership cost</strong>
              , <strong>xsport fitness price per month</strong>,{' '}
              <strong>princeton club membership cost</strong>,{' '}
              <strong>princeton club membership cost new berlin</strong>,{' '}
              <strong>newtown athletic club membership cost</strong>,{' '}
              <strong>newtown athletic club pricing</strong>, and <strong>nac membership cost</strong>
              . Go beyond basic &quot;starting at&quot; numbers to understand plan differences,
              compare cost ranges by location, and spot common fees—so you can choose the
              best-value gym confidently.
            </p>
            <p>
              Why do gym prices feel inconsistent from one place to another? Because membership cost
              is shaped by plan tiers, access level, contract length, and add-ons like initiation
              and annual fees—especially for popular searches like <strong>xsport membership plans</strong>
              , <strong>ufc gym prices</strong>, <strong>ufc gym membership cost</strong>,{' '}
              <strong>ufc gym membership plans</strong>,{' '}
              <strong>fit body boot camp cost per month</strong>,{' '}
              <strong>fit body boot camp price per month</strong>,{' '}
              <strong>pure barre membership cost</strong>, <strong>pure barre prices</strong>,{' '}
              <strong>orangetheory membership cost</strong>, <strong>nysc membership cost</strong>,{' '}
              <strong>bay club membership cost</strong>,{' '}
              <strong>fitness connection membership prices</strong>,{' '}
              <strong>fitness 19 membership cost</strong>,{' '}
              <strong>blink fitness gray membership cost</strong>, <strong>jetts membership cost</strong>
              , and <strong>crunch fitness annual fee</strong>. With clear comparisons and pricing
              context, you can benchmark gyms worldwide and pick the right membership without
              surprises.
            </p>
          </ReadMoreText>

          {/* Search Bar */}
          <div className='max-w-4xl mx-auto mb-8'>
            <GymAutocompleteSearch />
          </div>

          {/* Most Popular Gyms and Prices */}
          <MostPopularGyms gyms={popularGyms} />
        </div>
      </div>
    </section>
  )
}

