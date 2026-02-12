'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import L from 'leaflet'
import { RotateCcw } from 'lucide-react'
import type { GymAddress } from '@/types/gym'
import { MAP_MARKER_ICON_OPTIONS } from '@/lib/map-marker-icon'
import 'leaflet/dist/leaflet.css'

const DEFAULT_ICON = L.icon(MAP_MARKER_ICON_OPTIONS)

interface GymLocationsMapViewProps {
  addresses: GymAddress[]
  currentAddressId: string | null
  onAddressSelect?: (addressId: number | string) => void
}

export function GymLocationsMapView({ addresses, currentAddressId, onAddressSelect }: GymLocationsMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  const withCoords = useMemo(
    () =>
      addresses.filter(
        (a) =>
          a.latitude != null &&
          a.longitude != null &&
          Number(a.latitude) !== 0 &&
          Number(a.longitude) !== 0
      ),
    [addresses]
  )

  const center = useMemo((): [number, number] => {
    if (withCoords.length === 0) return [39.8283, -98.5795]
    const selected = currentAddressId
      ? withCoords.find((a) => String(a.id) === String(currentAddressId))
      : null
    if (selected) {
      return [Number(selected.latitude), Number(selected.longitude)]
    }
    const first = withCoords[0]
    return [Number(first.latitude), Number(first.longitude)]
  }, [withCoords, currentAddressId])

  // Create map once when we have coordinates; destroy on unmount or when coords become empty
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    if (withCoords.length === 0) {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = []
        el.innerHTML = ''
      }
      return
    }

    if (mapRef.current) return // already created

    // Use a fresh child div so Leaflet always gets a clean container (avoids "already initialized")
    const mapEl = document.createElement('div')
    mapEl.style.height = '100%'
    mapEl.style.minHeight = '300px'
    mapEl.style.width = '100%'
    el.innerHTML = ''
    el.appendChild(mapEl)

    const map = L.map(mapEl, {
      center,
      zoom: 13,
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
  }, [withCoords.length])

  // Update view and markers when addresses or selection change
  useEffect(() => {
    const map = mapRef.current
    if (!map || withCoords.length === 0) return

    const selected = currentAddressId
      ? withCoords.find((a) => String(a.id) === String(currentAddressId))
      : null
    if (selected) {
      map.flyTo(
        [Number(selected.latitude), Number(selected.longitude)],
        18,
        { duration: 0.8 }
      )
    } else {
      const bounds = L.latLngBounds(
        withCoords.map((a) => [Number(a.latitude), Number(a.longitude)] as L.LatLngTuple)
      )
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 })
    }

    // Clear old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    withCoords.forEach((addr) => {
      const marker = L.marker([Number(addr.latitude), Number(addr.longitude)], {
        icon: DEFAULT_ICON,
      })
      const label =
        addr.full_address ||
        [addr.street, addr.city, addr.state].filter(Boolean).join(', ') ||
        `Address #${addr.id}`
      marker.bindPopup(`<span class="font-medium">${escapeHtml(label)}</span>`)
      if (onAddressSelect) {
        marker.on('click', () => onAddressSelect(addr.id))
      }
      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }, [withCoords, currentAddressId, onAddressSelect])

  const handleResetView = useCallback(() => {
    const map = mapRef.current
    if (!map || withCoords.length === 0) return
    const bounds = L.latLngBounds(
      withCoords.map((a) => [Number(a.latitude), Number(a.longitude)] as L.LatLngTuple)
    )
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 })
  }, [withCoords])

  if (withCoords.length === 0) {
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center bg-muted rounded-md text-muted-foreground">
        No map coordinates for this page
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[300px] w-full rounded-md overflow-hidden z-10">
      <div
        ref={containerRef}
        className="absolute inset-0 h-full min-h-[300px] w-full z-10"
        aria-label="Locations map"
        style={{ minHeight: 300 }}
      />
      <button
        type="button"
        onClick={handleResetView}
        className="absolute top-2 right-2 z-[1000] flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/90 shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Reset map view to show all locations"
      >
        <RotateCcw className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  )
}

function escapeHtml(text: string): string {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null
  if (div) {
    div.textContent = text
    return div.innerHTML
  }
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
