'use client'

import { useState } from 'react'

const WORKOUTS = [
  { id: 'run', emoji: '🏃', label: 'run', description: 'I ran (voluntarily)', met: 9.8 },
  { id: 'lift', emoji: '🏋', label: 'lift', description: 'I lifted heavy things and put them down', met: 6.0 },
  { id: 'yoga', emoji: '🧘', label: 'yoga', description: 'I did yoga and pretended it was easy', met: 3.0 },
  { id: 'cycle', emoji: '🚴', label: 'cycle', description: 'I spun on a bike that goes nowhere', met: 8.5 },
  { id: 'box', emoji: '🥊', label: 'box', description: 'I punched things (legally)', met: 10.0 },
  { id: 'swim', emoji: '🏊', label: 'swim', description: 'I swam laps like an adult', met: 8.0 },
  { id: 'group', emoji: '🤸', label: 'group', description: 'I did a group class and tried not to die', met: 7.0 },
  { id: 'row', emoji: '🚣', label: 'row', description: 'I rowed like my ex was chasing me', met: 9.5 },
  { id: 'crossfit', emoji: '🧱', label: 'crossfit', description: "CrossFit — I don't want to talk about it", met: 11.0 },
  { id: 'walk', emoji: '🚶', label: 'walk', description: 'I walked (it still counts)', met: 3.5 },
  { id: 'clean', emoji: '🧹', label: 'clean', description: 'I cleaned my apartment aggressively', met: 3.3 },
]

const COUCH = {
  id: 'couch',
  emoji: '🛋️',
  label: 'couch',
  description: 'Sitting on the couch',
  met: 1.0,
}

const BURN_WORKOUTS = [...WORKOUTS, COUCH]

const EARNED_FOODS = [
  { emoji: '🍕', label: 'Pizza slices', calories: 285, unit: 'slices' },
  { emoji: '🍩', label: 'Donuts', calories: 300, unit: 'donuts' },
  { emoji: '🌮', label: 'Chipotle burritos', calories: 1200, unit: 'burritos' },
  { emoji: '☕', label: 'Frappuccinos', calories: 470, unit: 'Frappuccinos' },
  { emoji: '🥑', label: 'Avocado toasts', calories: 350, unit: 'toasts' },
  { emoji: '🍫', label: 'Chocolate bars', calories: 250, unit: 'bars' },
  { emoji: '🍺', label: 'Beers', calories: 150, unit: 'beers' },
  { emoji: '🍎', label: 'Apples', calories: 80, unit: 'apples' },
]

const SELECTABLE_FOODS = [
  { id: 'pizza-slice', emoji: '🍕', label: 'A slice of pizza', calories: 285 },
  { id: 'whole-pizza', emoji: '🍕🍕🍕', label: 'Okay, the whole pizza', calories: 2280 },
  { id: 'big-mac', emoji: '🍔', label: 'Big Mac + fries', calories: 1080 },
  { id: 'chipotle', emoji: '🌮', label: 'Chipotle burrito with guac', calories: 1200 },
  { id: 'donut', emoji: '🍩', label: 'One donut', calories: 300 },
  { id: 'donut-box', emoji: '🍩🍩🍩', label: "The box. Don't judge me.", calories: 2400 },
  { id: 'frappuccino', emoji: '☕', label: 'Starbucks Venti Frappuccino', calories: 470 },
  { id: 'salad', emoji: '🥗', label: 'A salad (with ranch, croutons, bacon, cheese...)', calories: 750 },
  { id: 'pasta', emoji: '🍝', label: "Mom's pasta", calories: 850 },
  { id: 'birthday-cake', emoji: '🎂', label: 'Birthday cake slice', calories: 400 },
  { id: 'stress-choc', emoji: '🍫', label: 'Stress chocolate at 11 PM', calories: 540 },
  { id: 'popcorn', emoji: '🍿', label: 'Movie theater popcorn (large)', calories: 1090 },
  { id: 'avocado-toast', emoji: '🥑', label: '$18 avocado toast', calories: 350 },
  { id: 'fries', emoji: '🍟', label: 'Just the fries. Just. The. Fries.', calories: 480 },
]

function getDurationLabel(minutes: number): string {
  if (minutes <= 10) return 'Just getting started'
  if (minutes <= 15) return 'A quick sweat'
  if (minutes <= 20) return 'Better than nothing'
  if (minutes <= 25) return 'Warming up'
  if (minutes <= 30) return 'Half hour hero'
  if (minutes <= 40) return 'Getting into it'
  if (minutes <= 45) return 'Getting serious'
  if (minutes <= 55) return 'More than average'
  if (minutes <= 60) return 'One hour strong'
  if (minutes <= 75) return 'Impressive'
  if (minutes <= 90) return 'All in'
  if (minutes <= 105) return 'Committed'
  return 'Legend status 👑'
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`
}

function getEarnCommentary(calories: number): string {
  if (calories < 100) return "So you... stretched? That's cool. Every journey starts somewhere. 🐢"
  if (calories < 200) return 'You earned a snack. A small one. Like 3 almonds. Okay maybe 5.'
  if (calories < 400) return "Respectable. You've unlocked a guilt-free cookie. 🍪"
  if (calories < 600) return "Now we're talking. Treat yourself. You've earned real food."
  if (calories < 800) return "Beast mode. Go eat whatever you want. You're an athlete now. 🏆"
  return 'You burned more calories than some people eat for breakfast. Are you okay? Do you need water? 💀'
}

function getBurnCommentary(workoutId: string, minutes: number): string {
  if (workoutId === 'couch') return 'Technically your body is always burning calories. Technically.'
  if (minutes < 30) return 'Honestly? Worth it. Go enjoy your life. 🎉'
  if (minutes > 180)
    return "Maybe split this across two gym sessions. Or two days. Or just... don't think about it."
  if (workoutId === 'yoga' && minutes > 120) return 'Namaste on the mat for a while.'
  if (workoutId === 'walk' && minutes > 150) return 'Just walk to the restaurant. And back. Twice.'
  if (workoutId === 'run' && minutes > 60)
    return "Hope you like podcasts, because you'll finish two."
  if (workoutId === 'lift' && minutes > 90)
    return "That's both arms, both legs, and probably abs you forgot you had."
  return 'Your gym membership is officially paying for itself. 💪'
}

export function CalorieCalculatorSection() {
  const [mode, setMode] = useState<'earn' | 'burn'>('earn')
  const [step, setStep] = useState(1)
  const [showResults, setShowResults] = useState(false)

  // Earn mode state
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null)
  const [duration, setDuration] = useState(45)
  const [weight, setWeight] = useState(70)
  const [weightExpanded, setWeightExpanded] = useState(false)

  // Burn mode state
  const [selectedFood, setSelectedFood] = useState<string | null>(null)
  const [selectedBurnWorkout, setSelectedBurnWorkout] = useState<string | null>(null)

  function switchMode(newMode: 'earn' | 'burn') {
    setMode(newMode)
    setStep(1)
    setShowResults(false)
    setSelectedWorkout(null)
    setSelectedFood(null)
    setSelectedBurnWorkout(null)
    setDuration(45)
    setWeight(70)
    setWeightExpanded(false)
  }

  function resetEarn() {
    setStep(1)
    setShowResults(false)
    setSelectedWorkout(null)
    setDuration(45)
    setWeight(70)
    setWeightExpanded(false)
  }

  function resetBurn() {
    setStep(1)
    setShowResults(false)
    setSelectedFood(null)
    setSelectedBurnWorkout(null)
    setWeight(70)
    setWeightExpanded(false)
  }

  // Earn calculations
  const earnWorkout = WORKOUTS.find((w) => w.id === selectedWorkout)
  const earnCalories = earnWorkout ? Math.round(earnWorkout.met * weight * (duration / 60)) : 0

  // Burn calculations
  const burnFood = SELECTABLE_FOODS.find((f) => f.id === selectedFood)
  const burnResults = BURN_WORKOUTS.map((workout) => {
    const minutes = Math.round(((burnFood?.calories ?? 0) * 60) / (workout.met * weight))
    return { ...workout, minutes }
  })
  const maxBurnMinutes = Math.max(...burnResults.map((r) => r.minutes))
  const selectedBurnResult = burnResults.find((r) => r.id === selectedBurnWorkout)
  const burnCommentary =
    selectedBurnResult && selectedBurnWorkout
      ? getBurnCommentary(selectedBurnWorkout, selectedBurnResult.minutes)
      : ''

  return (
    <section className='py-20 bg-muted/30' aria-labelledby='calorie-calc-heading'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h2
              id='calorie-calc-heading'
              className='text-3xl md:text-4xl font-bold mb-3'
            >
              How Many Calories Did You Burn Today?
            </h2>
            <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
              Enter your workout type and duration to calculate calories burned then see exactly
              what that means in pizza, burritos, or donuts. Because sometimes that&apos;s the only
              motivation that works.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className='flex justify-center gap-3 mb-8'>
            <button
              onClick={() => switchMode('earn')}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                mode === 'earn'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              🔥 What did I earn?
            </button>
            <button
              onClick={() => switchMode('burn')}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                mode === 'burn'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background border border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              🍔 How long do I owe?
            </button>
          </div>

          {/* Widget Card */}
          <div className='bg-background rounded-2xl border border-border shadow-sm p-6 md:p-8'>
            {/* ── EARN MODE ── */}
            {mode === 'earn' && !showResults && (
              <>
                {step === 1 && (
                  <div>
                    <p className='text-sm font-medium text-muted-foreground mb-4'>
                      Step 1 of 2 — Choose your workout
                    </p>
                    <div className='overflow-y-auto max-h-80 space-y-2 pr-1'>
                      {WORKOUTS.map((workout) => (
                        <button
                          key={workout.id}
                          onClick={() => setSelectedWorkout(workout.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                            selectedWorkout === workout.id
                              ? 'border-primary bg-primary/5 text-primary font-medium'
                              : 'border-border hover:border-primary/40 hover:bg-muted/50'
                          }`}
                        >
                          <span className='mr-2'>{workout.emoji}</span>
                          {workout.description}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedWorkout}
                      className='mt-6 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors'
                    >
                      Next →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <button
                      onClick={() => setStep(1)}
                      className='text-sm text-muted-foreground hover:text-primary mb-5 flex items-center gap-1 transition-colors'
                    >
                      ← Back
                    </button>
                    <p className='text-sm font-medium text-muted-foreground mb-6'>
                      Step 2 of 2 — Set your workout duration
                    </p>

                    {/* Duration Slider */}
                    <div className='mb-8'>
                      <div className='flex justify-between items-baseline mb-3'>
                        <span className='text-2xl font-bold'>{duration} min</span>
                        <span className='text-muted-foreground text-sm'>
                          {getDurationLabel(duration)}
                        </span>
                      </div>
                      <input
                        type='range'
                        min={10}
                        max={120}
                        step={5}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className='w-full accent-primary cursor-pointer'
                      />
                      <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                        <span>10 min</span>
                        <span>120 min</span>
                      </div>
                    </div>

                    {/* Weight Accordion */}
                    <div className='border border-border rounded-xl mb-6 overflow-hidden'>
                      <button
                        onClick={() => setWeightExpanded(!weightExpanded)}
                        className='w-full px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-muted/50 transition-colors'
                      >
                        <span>
                          Add your weight for accuracy{' '}
                          <span className='text-muted-foreground font-normal'>
                            (optional — default 70 kg)
                          </span>
                        </span>
                        <span className='text-muted-foreground text-xs'>
                          {weightExpanded ? '▲' : '▼'}
                        </span>
                      </button>
                      {weightExpanded && (
                        <div className='px-4 pb-4 border-t border-border pt-4'>
                          <div className='flex justify-between items-baseline mb-3'>
                            <span className='text-xl font-bold'>{weight} kg</span>
                          </div>
                          <input
                            type='range'
                            min={40}
                            max={150}
                            step={1}
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className='w-full accent-primary cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                            <span>40 kg</span>
                            <span>150 kg</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowResults(true)}
                      className='w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors'
                    >
                      Show what I earned 🔥
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── EARN MODE RESULTS ── */}
            {mode === 'earn' && showResults && (
              <div>
                <div className='text-center mb-8'>
                  <p className='text-muted-foreground text-sm'>
                    {earnWorkout?.emoji} {earnWorkout?.description} · {duration} min ·{' '}
                    {weight} kg
                  </p>
                  <div className='text-7xl font-extrabold text-primary my-4 tabular-nums'>
                    {earnCalories.toLocaleString()}
                  </div>
                  <p className='text-lg text-muted-foreground'>calories burned</p>
                  <p className='mt-4 text-base italic text-muted-foreground'>
                    {getEarnCommentary(earnCalories)}
                  </p>
                </div>

                <p className='font-semibold mb-4 text-center text-sm text-muted-foreground uppercase tracking-wide'>
                  You earned:
                </p>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8'>
                  {EARNED_FOODS.map((food) => {
                    const amount = (earnCalories / food.calories).toFixed(1)
                    return (
                      <div
                        key={food.label}
                        className='bg-muted/40 rounded-xl p-3 text-center border border-border/50'
                      >
                        <div className='text-3xl mb-1'>{food.emoji}</div>
                        <div className='text-xl font-bold tabular-nums'>{amount}</div>
                        <div className='text-xs text-muted-foreground mt-0.5'>{food.unit}</div>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={resetEarn}
                  className='w-full py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors'
                >
                  Try another workout →
                </button>
              </div>
            )}

            {/* ── BURN MODE ── */}
            {mode === 'burn' && !showResults && (
              <>
                {step === 1 && (
                  <div>
                    <p className='text-sm font-medium text-muted-foreground mb-4'>
                      Step 1 of 2 — Pick what you ate
                    </p>
                    <div className='overflow-y-auto max-h-80 space-y-2 pr-1'>
                      {SELECTABLE_FOODS.map((food) => (
                        <button
                          key={food.id}
                          onClick={() => setSelectedFood(food.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                            selectedFood === food.id
                              ? 'border-primary bg-primary/5 text-primary font-medium'
                              : 'border-border hover:border-primary/40 hover:bg-muted/50'
                          }`}
                        >
                          <span>
                            <span className='mr-2'>{food.emoji}</span>
                            {food.label}
                          </span>
                          <span className='text-muted-foreground font-normal text-sm whitespace-nowrap'>
                            {food.calories.toLocaleString()} cal
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedFood}
                      className='mt-6 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors'
                    >
                      Next →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <button
                      onClick={() => setStep(1)}
                      className='text-sm text-muted-foreground hover:text-primary mb-5 flex items-center gap-1 transition-colors'
                    >
                      ← Back
                    </button>
                    <p className='text-sm font-medium text-muted-foreground mb-4'>
                      Step 2 of 2 — Choose your workout
                    </p>

                    <div className='grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6'>
                      {BURN_WORKOUTS.map((workout) => (
                        <button
                          key={workout.id}
                          onClick={() => setSelectedBurnWorkout(workout.id)}
                          className={`px-2 py-3 rounded-xl border text-sm transition-all text-center ${
                            selectedBurnWorkout === workout.id
                              ? 'border-primary bg-primary/5 text-primary font-medium'
                              : 'border-border hover:border-primary/40 hover:bg-muted/50'
                          }`}
                        >
                          <span className='block text-2xl mb-1'>{workout.emoji}</span>
                          <span className='text-xs'>{workout.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Weight Accordion */}
                    <div className='border border-border rounded-xl mb-6 overflow-hidden'>
                      <button
                        onClick={() => setWeightExpanded(!weightExpanded)}
                        className='w-full px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-muted/50 transition-colors'
                      >
                        <span>
                          Add your weight for accuracy{' '}
                          <span className='text-muted-foreground font-normal'>
                            (optional — default 70 kg)
                          </span>
                        </span>
                        <span className='text-muted-foreground text-xs'>
                          {weightExpanded ? '▲' : '▼'}
                        </span>
                      </button>
                      {weightExpanded && (
                        <div className='px-4 pb-4 border-t border-border pt-4'>
                          <div className='flex justify-between items-baseline mb-3'>
                            <span className='text-xl font-bold'>{weight} kg</span>
                          </div>
                          <input
                            type='range'
                            min={40}
                            max={150}
                            step={1}
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className='w-full accent-primary cursor-pointer'
                          />
                          <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                            <span>40 kg</span>
                            <span>150 kg</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowResults(true)}
                      disabled={!selectedBurnWorkout}
                      className='w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors'
                    >
                      Show my debt 😅
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── BURN MODE RESULTS ── */}
            {mode === 'burn' && showResults && (
              <div>
                <div className='text-center mb-6'>
                  <p className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
                    To burn off
                  </p>
                  <p className='text-xl font-bold'>
                    {burnFood?.emoji} {burnFood?.label}
                  </p>
                  <p className='text-muted-foreground text-sm mt-0.5'>
                    {burnFood?.calories.toLocaleString()} calories
                  </p>
                  <p className='mt-4 text-base italic text-muted-foreground'>{burnCommentary}</p>
                </div>

                <div className='space-y-2.5 mb-8'>
                  {burnResults.map((result) => {
                    const isSelected = result.id === selectedBurnWorkout
                    const percentage = Math.round((result.minutes / maxBurnMinutes) * 100)
                    const durationStr = formatDuration(result.minutes)
                    const timeLabel =
                      result.id === 'couch'
                        ? `${durationStr} (a full Netflix binge)`
                        : durationStr

                    return (
                      <div
                        key={result.id}
                        className={`rounded-xl p-3 ${
                          isSelected
                            ? 'bg-primary/10 border border-primary'
                            : 'bg-muted/30 border border-transparent'
                        }`}
                      >
                        <div className='flex justify-between items-center mb-2 gap-2'>
                          <span
                            className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : ''}`}
                          >
                            {result.emoji} {result.description}
                          </span>
                          <span
                            className={`text-sm font-semibold whitespace-nowrap ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                          >
                            {timeLabel}
                          </span>
                        </div>
                        <div className='h-2 bg-muted rounded-full overflow-hidden'>
                          <div
                            className={`h-full rounded-full transition-all ${isSelected ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={resetBurn}
                  className='w-full py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors'
                >
                  Try another meal →
                </button>
              </div>
            )}
          </div>

          {/* Footer Disclaimer */}
          <p className='text-center text-xs text-muted-foreground mt-4'>
            * Estimates based on MET values. For entertainment purposes.
          </p>
        </div>
      </div>
    </section>
  )
}
