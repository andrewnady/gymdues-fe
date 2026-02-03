'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import { RotateCcw } from 'lucide-react'
import type { Gym, GymPrimaryAddress } from '@/types/gym'
import 'leaflet/dist/leaflet.css'

const DEFAULT_ICON = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function hasValidCoords(addr: string | GymPrimaryAddress | undefined): addr is GymPrimaryAddress {
  if (!addr || typeof addr === 'string') return false
  const lat = Number(addr.latitude)
  const lng = Number(addr.longitude)
  return (
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    lat !== 0 &&
    lng !== 0
  )
}

interface GymsDiscoveryMapProps {
  gyms: Gym[]
  selectedGymId: string | null
  onGymSelect?: (gymId: string) => void
}

export function GymsDiscoveryMap({ gyms, selectedGymId, onGymSelect }: GymsDiscoveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  const gymsWithCoords = useMemo(() => {
    return gyms.filter((g) => hasValidCoords(g.address)) as (Gym & { address: GymPrimaryAddress })[]
  }, [gyms])

  const center = useMemo((): [number, number] => {
    if (gymsWithCoords.length === 0) return [40.7128, -74.006]
    const selected = selectedGymId
      ? gymsWithCoords.find((g) => String(g.id) === String(selectedGymId))
      : null
    if (selected?.address) {
      return [Number(selected.address.latitude), Number(selected.address.longitude)]
    }
    const first = gymsWithCoords[0]
    return [Number(first.address.latitude), Number(first.address.longitude)]
  }, [gymsWithCoords, selectedGymId])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (gymsWithCoords.length === 0) {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = []
        el.innerHTML = ''
      }
      return
    }

    if (mapRef.current) return

    const mapEl = document.createElement('div')
    mapEl.style.height = '100%'
    mapEl.style.minHeight = '300px'
    mapEl.style.width = '100%'
    el.innerHTML = ''
    el.appendChild(mapEl)

    const map = L.map(mapEl, {
      center,
      zoom: 12,
      scrollWheelZoom: true,
    })
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = []
    }
  }, [gymsWithCoords.length])

  useEffect(() => {
    const map = mapRef.current
    if (!map || gymsWithCoords.length === 0) return

    const selected = selectedGymId
      ? gymsWithCoords.find((g) => String(g.id) === String(selectedGymId))
      : null
    if (selected?.address) {
      map.flyTo(
        [Number(selected.address.latitude), Number(selected.address.longitude)],
        15,
        { duration: 0.6 }
      )
    } else {
      const bounds = L.latLngBounds(
        gymsWithCoords.map((g) => [
          Number(g.address.latitude),
          Number(g.address.longitude),
        ] as L.LatLngTuple)
      )
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 })
    }

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const markerGymIds: string[] = []
    gymsWithCoords.forEach((gym) => {
      const lat = Number(gym.address.latitude)
      const lng = Number(gym.address.longitude)
      const marker = L.marker([lat, lng], { icon: DEFAULT_ICON })
      const label = gym.name
      const slug = gym.slug
      const popupHtml = `<a href="/gyms/${escapeHtml(slug)}" class="font-medium hover:underline">${escapeHtml(label)}</a>`
      marker.bindPopup(popupHtml)
      if (onGymSelect) {
        marker.on('click', () => onGymSelect(String(gym.id)))
      }
      marker.addTo(map)
      markersRef.current.push(marker)
      markerGymIds.push(String(gym.id))
    })

    // Apply selected style (white + scale 1.2) to the selected marker
    const getMarkerEl = (m: L.Marker) => (m as L.Marker & { _icon?: HTMLElement })._icon?.parentElement
    markersRef.current.forEach((marker, i) => {
      const el = getMarkerEl(marker)
      if (el) {
        if (markerGymIds[i] === selectedGymId) {
          el.classList.add('gym-marker-selected')
        } else {
          el.classList.remove('gym-marker-selected')
        }
      }
    })
  }, [gymsWithCoords, selectedGymId, onGymSelect])

  const handleResetView = useCallback(() => {
    const map = mapRef.current
    if (!map || gymsWithCoords.length === 0) return
    const bounds = L.latLngBounds(
      gymsWithCoords.map((g) => [
        Number(g.address.latitude),
        Number(g.address.longitude),
      ] as L.LatLngTuple)
    )
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 })
  }, [gymsWithCoords])

  if (gymsWithCoords.length === 0) {
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center bg-muted rounded-md text-muted-foreground">
        No map coordinates for these gyms
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[300px] w-full rounded-md overflow-hidden">
      <div
        ref={containerRef}
        className="absolute inset-0 h-full min-h-[300px] w-full"
        aria-label="Gyms map"
        style={{ minHeight: 300 }}
      />
      <button
        type="button"
        onClick={handleResetView}
        className="absolute top-2 right-2 z-[1000] flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/90 shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Reset map view to show all gyms"
      >
        <RotateCcw className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  )
}

function escapeHtml(text: string): string {
  if (typeof document === 'undefined') {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
