import {
  Circle,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
  Marker,
} from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

const GERMANY_CENTER = [51.1657, 10.4515]
const DEFAULT_ZOOM = 6

const HOME_ICON = L.divIcon({
  className: 'property-home-marker',
  html: `
    <div
      style="
        width: 42px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #003B73;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.22);
      "
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="transform: rotate(45deg)"
      >
        <path
          d="M3 10.5L12 3L21 10.5V21H15V15H9V21H3V10.5Z"
          fill="#F59E0B"
          stroke="white"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
})

const SELECTED_ICON = L.divIcon({
  className: 'selected-home-marker',
  html: `
    <div
      style="
        width: 46px;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #F59E0B;
        border: 3px solid #003B73;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 5px 14px rgba(0,59,115,0.3);
      "
    >
      <svg
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="transform: rotate(45deg)"
      >
        <path
          d="M3 10.5L12 3L21 10.5V21H15V15H9V21H3V10.5Z"
          fill="#003B73"
          stroke="white"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 46],
  popupAnchor: [0, -46],
})

function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        propertyId: null,
      })
    },
  })

  return null
}

function FitMapToProperties({ properties }) {
  const map = useMap()

  useEffect(() => {
    const validProperties = properties.filter((property) => {
      if (!property.coordinates) return false

      const lat = Number(property.coordinates.lat)
      const lng = Number(property.coordinates.lng)

      return (
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      )
    })

    if (!validProperties.length) {
      map.setView(
        GERMANY_CENTER,
        DEFAULT_ZOOM,
      )
      return
    }

    if (validProperties.length === 1) {
      const property = validProperties[0]

      map.setView(
        [
          Number(property.coordinates.lat),
          Number(property.coordinates.lng),
        ],
        14,
        {
          animate: true,
        },
      )

      return
    }

    const bounds = L.latLngBounds(
      validProperties.map((property) => [
        Number(property.coordinates.lat),
        Number(property.coordinates.lng),
      ]),
    )

    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 14,
      animate: true,
    })
  }, [map, properties])

  return null
}

export function PropertyMap({
  properties = [],
  onLocationSelect,
  selectedLocation,
  radiusKm = 2,
}) {
  return (
    <div className="h-full min-h-[560px] overflow-hidden rounded-2xl border border-ink-200 bg-ink-100 shadow-card">
      <MapContainer
        center={GERMANY_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        zoomControl={true}
        className="h-full min-h-[560px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMapToProperties
          properties={properties}
        />

        <MapEvents
          onLocationSelect={onLocationSelect}
        />

        {/* PROPERTY HOME MARKERS */}

        {properties.map((property) => {
          if (!property.coordinates) {
            return null
          }

          const lat = Number(
            property.coordinates.lat,
          )

          const lng = Number(
            property.coordinates.lng,
          )

          if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
          ) {
            return null
          }

          const isSelected =
            selectedLocation?.propertyId === property.id

          return (
            <Marker
              key={property.id}
              position={[lat, lng]}
              icon={
                isSelected
                  ? SELECTED_ICON
                  : HOME_ICON
              }
              eventHandlers={{
                click: (event) => {
                  event.originalEvent.stopPropagation()

                  onLocationSelect({
                    lat,
                    lng,
                    propertyId: property.id,
                  })
                },
              }}
            >
              <Popup>
                <div className="min-w-[220px]">
                  <p className="font-bold text-ink-900">
                    {property.title}
                  </p>

                  <p className="mt-1 text-sm text-ink-600">
                    {property.district},{' '}
                    {property.city}
                  </p>

                  <p className="mt-2 font-bold text-brand-700">
                    €{property.rent}
                    <span className="font-normal text-ink-500">
                      {' '}/month
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* SELECTED PROPERTY RADIUS */}

        {selectedLocation?.propertyId && (
          <Circle
            center={[
              selectedLocation.lat,
              selectedLocation.lng,
            ]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#003B73',
              fillColor: '#F59E0B',
              fillOpacity: 0.12,
              weight: 2,
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}
