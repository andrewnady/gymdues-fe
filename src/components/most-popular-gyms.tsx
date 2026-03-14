import Link from 'next/link'
import { Gym } from '@/types/gym'
import { ReadMoreText } from '@/components/read-more-text'

interface MostPopularGymsProps {
  gyms: Gym[]
}

export function MostPopularGyms({ gyms }: MostPopularGymsProps) {
  return (
    <div className='text-white/90 mb-4'>
      <h2 className='text-3xl md:text-4xl font-bold mb-2'>Most Popular Gyms and Prices</h2>
      <ReadMoreText className='text-muted-background text-lg max-w-4xl mx-auto mb-4'>
        <p>
          Under Most Popular Gyms and Prices, we break down the real-world costs people search for
          most—so you can compare memberships across major chains and premium clubs without
          guesswork. Explore pricing topics like <strong>la fitness prices</strong> and{' '}
          <strong>la fitness membership cost</strong>, along with{' '}
          <strong>anytime fitness prices</strong> and <strong>anytime fitness membership cost</strong>
          , plus <strong>24 hour fitness prices</strong> and{' '}
          <strong>24 hour fitness membership cost</strong>. If you&apos;re researching higher-end
          options, we also cover <strong>lifetime gym membership cost</strong> and{' '}
          <strong>bay club membership cost</strong>, and for big-city memberships you&apos;ll find
          guides for <strong>nysc membership cost</strong> and{' '}
          <strong>new york sports club membership cost</strong>. For boutique and studio-style
          training, compare <strong>pure barre membership cost</strong> and{' '}
          <strong>pure barre prices</strong>, <strong>orangetheory membership cost</strong>, and
          combat-focused options like <strong>ufc gym prices</strong>,{' '}
          <strong>ufc gym membership cost</strong>, and <strong>title boxing club prices</strong>.
        </p>
        <p>
          Because gym pricing isn&apos;t just &quot;one monthly number,&quot; we also highlight what
          affects your total—plan tiers, access levels, enrollment fees, and annual fees—using the
          same high-demand comparisons people make, such as <strong>xsport membership cost</strong>
          , <strong>xsport fitness membership cost</strong>,{' '}
          <strong>xsport fitness price per month</strong>, <strong>xsport membership plans</strong>,
          and regional favorites like <strong>princeton club membership cost</strong> and{' '}
          <strong>newtown athletic club membership cost</strong> (including{' '}
          <strong>newtown athletic club pricing</strong> and <strong>nac membership cost</strong>).
          The result is a faster, clearer way to benchmark popular gyms and choose the best-value
          membership for your city and training style.
        </p>
      </ReadMoreText>
      <div className='flex flex-wrap justify-center gap-3'>
        {gyms.length > 0 ? (
          gyms.map((gym) => {
            const lowestPrice =
              gym.pricing && gym.pricing.length > 0
                ? Math.min(...gym.pricing.map((plan) => plan.price || 0))
                : null
            return (
              <Link
                key={gym.id}
                href={`/gyms/${gym.slug}`}
                className='bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 h-12 px-6 rounded-full flex items-center gap-2 transition-colors'
              >
                <span className='font-medium'>{gym.name}</span>
                {lowestPrice !== null && (
                  <span className='text-white/80 text-sm'>
                    ${lowestPrice.toFixed(0)}/mo
                  </span>
                )}
              </Link>
            )
          })
        ) : (
          <>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='bg-white/10 backdrop-blur-sm border border-white/20 h-12 px-6 rounded-full flex items-center gap-2 animate-pulse'
              >
                <div className='h-4 w-32 bg-white/20 rounded' />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

