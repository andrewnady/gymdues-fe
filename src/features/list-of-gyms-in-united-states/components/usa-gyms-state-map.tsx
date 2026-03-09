'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Dumbbell, DollarSign, Clock, Star } from 'lucide-react'
import type { StateWithCount } from '@/types/gym'
import type { MapLayer } from '@/usa-list/lib/map-layers'
import { getStatesForLayer, getLayerLabel, toStateCode } from '@/usa-list/lib/map-layers'

const USAMap = dynamic(() => import('react-usa-map'), { ssr: false })

export type { MapLayer }

export const LAYERS: { id: MapLayer; label: string; icon: typeof DollarSign }[] = [
  { id: 'all', label: 'All Gyms', icon: MapPin },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: '24hour', label: '24-Hour', icon: Clock },
  { id: 'highRated', label: 'High-Rated', icon: Star },
]

/** All state codes for default fill; labels are hidden on map, shown on hover only. */
const STATE_CENTROIDS: Record<string, { x: number; y: number }> = {
  AL: { x: 0, y: 0 }, AK: { x: 0, y: 0 }, AZ: { x: 0, y: 0 }, AR: { x: 0, y: 0 },
  CA: { x: 0, y: 0 }, CO: { x: 0, y: 0 }, CT: { x: 0, y: 0 }, DE: { x: 0, y: 0 },
  FL: { x: 0, y: 0 }, GA: { x: 0, y: 0 }, HI: { x: 0, y: 0 }, ID: { x: 0, y: 0 },
  IL: { x: 0, y: 0 }, IN: { x: 0, y: 0 }, IA: { x: 0, y: 0 }, KS: { x: 0, y: 0 },
  KY: { x: 0, y: 0 }, LA: { x: 0, y: 0 }, ME: { x: 0, y: 0 }, MD: { x: 0, y: 0 },
  MA: { x: 0, y: 0 }, MI: { x: 0, y: 0 }, MN: { x: 0, y: 0 }, MS: { x: 0, y: 0 },
  MO: { x: 0, y: 0 }, MT: { x: 0, y: 0 }, NE: { x: 0, y: 0 }, NV: { x: 0, y: 0 },
  NH: { x: 0, y: 0 }, NJ: { x: 0, y: 0 }, NM: { x: 0, y: 0 }, NY: { x: 0, y: 0 },
  NC: { x: 0, y: 0 }, ND: { x: 0, y: 0 }, OH: { x: 0, y: 0 }, OK: { x: 0, y: 0 },
  OR: { x: 0, y: 0 }, PA: { x: 0, y: 0 }, RI: { x: 0, y: 0 }, SC: { x: 0, y: 0 },
  SD: { x: 0, y: 0 }, TN: { x: 0, y: 0 }, TX: { x: 0, y: 0 }, UT: { x: 0, y: 0 },
  VT: { x: 0, y: 0 }, VA: { x: 0, y: 0 }, WA: { x: 0, y: 0 }, WV: { x: 0, y: 0 },
  WI: { x: 0, y: 0 }, WY: { x: 0, y: 0 }, DC: { x: 0, y: 0 },
}

interface UsaGymsStateMapProps {
  states: StateWithCount[]
  /** When provided, layer is controlled by parent (e.g. shared with table); map does not render its own layer toggle. */
  layer?: MapLayer
  /** Compact layout: no heading, smaller padding, minimal legend. For use in gymsdata state/city pages. */
  compact?: boolean
}

/** 6-step color scale: light → primary green (site brand, choropleth). */
const COLOR_STOPS: string[] = [
  '#ecfdf5', // emerald-50 – lowest
  '#d1fae5', // emerald-100
  '#a7f3d0', // emerald-200
  '#6ee7b7', // emerald-300
  '#34d399', // emerald-400
  'hsl(var(--primary))', // site primary – highest
]
const DEFAULT_FILL = '#ecfdf5'

function getColorScale(count: number, max: number): string {
  if (!max || max <= 0) return COLOR_STOPS[0]
  const ratio = Math.max(0, Math.min(1, count / max))
  const index = ratio < 1 ? Math.floor(ratio * COLOR_STOPS.length) : COLOR_STOPS.length - 1
  const i = Math.min(index, COLOR_STOPS.length - 1)
  return COLOR_STOPS[i]
}

import type { StateWithLayerCount } from '@/usa-list/lib/map-layers'

export function UsaGymsStateMap({ states, layer: controlledLayer, compact = false }: UsaGymsStateMapProps) {
  const [internalLayer, setInternalLayer] = useState<MapLayer>('all')
  const layer = controlledLayer ?? internalLayer
  const [hoverCode, setHoverCode] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null)
  const [wrapperWidth, setWrapperWidth] = useState(0)
  const mapWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Remove default (native) tooltips from state paths so only our custom tooltip shows
  useEffect(() => {
    if (!mounted) return
    const remove = () => mapWrapperRef.current?.querySelectorAll('title').forEach((el) => el.remove())
    const id = requestAnimationFrame(remove)
    const t = setTimeout(remove, 150)
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(t)
    }
  }, [mounted])

  /** States with layerCount = current layer for coloring and tooltips. */
  const statesForLayer = useMemo(
    () => getStatesForLayer(states, layer),
    [states, layer],
  )

  /** When compact + single state: zoom SVG viewBox to that state only. */
  const singleStateCode = statesForLayer.length === 1 ? toStateCode(statesForLayer[0]) : null
  useEffect(() => {
    if (!compact || !singleStateCode || !mounted) return
    const wrapper = mapWrapperRef.current
    if (!wrapper) return
    const run = () => {
      const svg = wrapper.querySelector('svg')
      const path = wrapper.querySelector(`path[data-name="${singleStateCode}"]`) as SVGPathElement | null
      if (!svg || !path) return
      try {
        const bbox = path.getBBox()
        const pad = Math.max(bbox.width, bbox.height) * 0.12
        const x = Math.max(0, bbox.x - pad)
        const y = Math.max(0, bbox.y - pad)
        const w = bbox.width + 2 * pad
        const h = bbox.height + 2 * pad
        svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`)
        svg.style.maxHeight = 'none'
      } catch {
        // ignore getBBox errors
      }
    }
    const t = setTimeout(run, 350)
    return () => clearTimeout(t)
  }, [mounted, compact, singleStateCode])

  const maxCount = useMemo(
    () =>
      statesForLayer.length > 0
        ? Math.max(...statesForLayer.map((s) => s.layerCount))
        : 0,
    [statesForLayer],
  )

  /** Map by 2-letter code; store layer count for tooltip. */
  const stateByCode = useMemo(() => {
    const map = new Map<string, StateWithLayerCount>()
    statesForLayer.forEach((s) => map.set(toStateCode(s), s))
    return map
  }, [statesForLayer])

  /** Colors keyed by 2-letter code; defaultFill for states not in our data. */
  const customize = useMemo(() => {
    const cfg: Record<string, { fill: string }> = {}
    statesForLayer.forEach((s) => {
      const code = toStateCode(s)
      cfg[code] = { fill: getColorScale(s.layerCount, maxCount) }
    })
    Object.keys(STATE_CENTROIDS).forEach((code) => {
      if (!(code in cfg)) cfg[code] = { fill: DEFAULT_FILL }
    })
    return cfg
  }, [statesForLayer, maxCount])

  const legendStops = useMemo(() => {
    return [0, 0.2, 0.4, 0.6, 0.8, 1].map((r) => Math.round(maxCount * r))
  }, [maxCount])

  const hoverState = hoverCode ? stateByCode.get(hoverCode) ?? null : null
  const layerLabel = getLayerLabel(layer)

  return (
    <section className={compact ? 'max-w-sm mx-auto' : 'max-w-6xl mx-auto mb-16'}>
      {!compact && (
        <div className='flex flex-col items-center mb-4'>
          <div className='inline-flex items-center gap-2 mb-1'>
            <MapPin className='h-5 w-5 text-primary' />
            <h2 className='text-2xl md:text-3xl font-semibold'>
            Fitness, Gym, and Health Services coverage by U.S. state
            </h2>
          </div>
          <p className='text-sm md:text-base text-muted-foreground'>
            Hover over a state to see Fitness, Gym, and Health Services count and click to browse Fitness, Gym, and Health Services there.
          </p>
        </div>
      )}

      {/* Toggle layers only when map is used standalone (no controlled layer from parent) */}
      {!compact && controlledLayer === undefined && (
        <div
          className='flex flex-wrap items-center justify-center gap-2 mb-4'
          role='tablist'
          aria-label='Map layers'
        >
          {LAYERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type='button'
              role='tab'
              aria-selected={layer === id}
              onClick={() => setInternalLayer(id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                layer === id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className='h-4 w-4 shrink-0' />
              {label}
            </button>
          ))}
        </div>
      )}

      <div
        className={`rounded-3xl border border-border/70 bg-card/80 backdrop-blur-sm shadow-lg transition-all duration-700 ease-out ${
          compact ? 'px-2 py-3' : 'px-3 py-5 md:px-6 md:py-7'
        } ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className={`w-full ${compact ? 'overflow-visible' : 'overflow-x-auto'}`}>
          <div
            ref={mapWrapperRef}
            className={`usa-gyms-map-wrapper mx-auto relative ${compact ? 'max-w-[420px] min-h-[260px] [&_svg]:w-full [&_svg]:h-auto [&_svg]:min-h-[240px]' : 'max-w-5xl'}`}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              const x = event.clientX - rect.left
              const y = event.clientY - rect.top

              setWrapperWidth(rect.width)
              setHoverPoint({ x, y })

              // Detect which state the cursor is over by reading the underlying SVG path
              const target = event.target as HTMLElement
              const path = target.closest?.('path[data-name]') as SVGPathElement | null
              const code = path?.getAttribute('data-name') ?? null
              setHoverCode(code)
            }}
            onMouseLeave={() => {
              setHoverPoint(null)
              setHoverCode(null)
            }}
          >
            <USAMap
              customize={customize}
              defaultFill={DEFAULT_FILL}
              onClick={() => {
                // intentionally noop – map is for exploration, not navigation
              }}
            />

            {/* Floating tooltip near cursor: state name + count (desktop) */}
            {hoverState && hoverPoint && (
              <div
                className={`hidden md:flex absolute z-20 ${
                  compact && wrapperWidth > 0 && hoverPoint.x > wrapperWidth * 0.55
                    ? '-translate-y-full -translate-x-full -translate-x-2'
                    : '-translate-y-full translate-x-3'
                }`}
                style={{
                  left: hoverPoint.x,
                  top: hoverPoint.y,
                }}
              >
                <div className='rounded-xl bg-popover/95 shadow-xl border border-border/80 px-3 py-2 flex flex-col gap-1 text-xs text-foreground'>
                  <div className='flex items-center gap-1 text-[11px] text-muted-foreground'>
                    <span className='inline-flex h-1.5 w-1.5 rounded-full bg-primary mr-1' />
                    Fitness, Gym, and Health Services in
                  </div>
                  <div className='text-sm font-semibold'>
                    {hoverState.stateName}
                  </div>
                  <div className='flex items-baseline gap-1'>
                    <span className='text-lg font-bold tabular-nums'>
                      {hoverState.layerCount.toLocaleString('en-US')}
                    </span>
                    <span className='text-[11px] text-muted-foreground'>
                      {layerLabel}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend: 6-step gradient matching map colors (hidden in compact mode) */}
        {!compact && (
        <div className='mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='flex-1 min-w-[180px] max-w-[280px]'>
              <p className='text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5'>
                {layer === 'all' ? 'Fitness, Gym, and Health Services per state' : `${LAYERS.find((l) => l.id === layer)?.label ?? 'Fitness, Gym, and Health Services'} per state`}
              </p>
              <div
                className='relative h-4 w-full rounded-full overflow-visible flex'
                role='img'
                aria-label='Color scale from fewer to more Fitness, Gym, and Health Services'
              >
                <div className='flex-1 flex rounded-full overflow-hidden h-full'>
                  {COLOR_STOPS.map((c, i) => (
                    <div
                      key={i}
                      className='flex-1 transition-opacity duration-300'
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                {hoverState && maxCount > 0 && (
                  <div
                    className='absolute bottom-0 z-10 flex flex-col items-center pointer-events-none'
                    style={{
                      left: `${Math.min(
                        100,
                        Math.max(0, (hoverState.layerCount / maxCount) * 100),
                      )}%`,
                      transform: 'translate(-50%, 0)',
                    }}
                  >
                    <div
                      className='w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-amber-700 drop-shadow-sm'
                      aria-hidden
                    />
                    <div
                      className='w-2 h-5 -mt-px rounded-full min-h-[16px] bg-amber-700 ring-2 ring-white shadow-md'
                    />
                  </div>
                )}
              </div>
              <div className='mt-1 flex justify-between text-[10px] text-muted-foreground'>
                {legendStops.map((val, i) => (
                  <span key={`legend-${i}-${val}`}>{val.toLocaleString('en-US')}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Hover card below map: state name + big count */}
          <div className='min-h-[72px] flex items-center'>
            {hoverState ? (
              <div
                key={hoverState.state}
                className='usa-gyms-hover-card rounded-xl border bg-card px-4 py-3 shadow-md flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'
              >
                <div className='flex items-center gap-2'>
                  <Dumbbell className='h-4 w-4 text-primary shrink-0' />
                  <div>
                    <p className='font-semibold text-foreground'>{hoverState.stateName}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <p className='text-2xl font-bold tabular-nums text-primary'>
                    {hoverState.layerCount.toLocaleString('en-US')}
                  </p>
                  <p className='text-sm text-muted-foreground'>{layerLabel}</p>
                </div>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                Move your cursor over a state to see count and details.
              </p>
            )}
          </div>
        </div>
        )}
      </div>
    </section>
  )
}

