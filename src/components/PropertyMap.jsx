import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

const GERMANY_CENTER = [51.1657, 10.4515]
const DEFAULT_ZOOM = 6

/*
 * Handles clicks on empty map areas.
 *
 * Clicking a property marker is handled separately and
 * should NOT select a nearby map location.
 */
function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      })
    },
  })

  return null
}

/*
 * Fit the map around the properties currently shown
 * on the map.
 */
function FitMapToProperties({ properties }) {
  const map = useMap()

  useEffect(() => {
    const validProperties = properties.filter(
      (property) => {
        const coordinates = property.coordinates

        if (!coordinates) {
          return false
        }

        const lat = Number(coordinates.lat)
        const lng = Number(coordinates.lng)

        return (
          Number.isFinite(lat) &&
          Number.isFinite(lng)
        )
      },
    )

    /*
     * No valid properties:
     * show Germany.
     */
    if (validProperties.length === 0) {
      map.setView(
        GERMANY_CENTER,
        DEFAULT_ZOOM,
      )
      return
    }

    /*
     * Only one property.
     */
    if (validProperties.length === 1) {
      const property = validProperties[0]

      map.setView(
        [
          Number(property.coordinates.lat),
          Number(property.coordinates.lng),
        ],
        13,
      )

      return
    }

    /*
     * Multiple properties:
     * fit all markers.
     */
    const bounds = L.latLngBounds(
      validProperties.map((property) => [
        Number(property.coordinates.lat),
        Number(property.coordinates.lng),
      ]),
    )

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 13,
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
    <div
      className="
        h-full
        min-h-[500px]
        overflow-hidden
        rounded-2xl
        border
        border-ink-200
        bg-ink-100
        shadow-soft
      "
    >
      <MapContainer
        center={GERMANY_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="h-full min-h-[500px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit map around current properties */}
        <FitMapToProperties
          properties={properties}
        />

        {/* Empty map click handler */}
        <MapEvents
          onLocationSelect={
            onLocationSelect
          }
        />

        {/* =================================================
            PROPERTY MARKERS
        ================================================== */}

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

          return (
            <CircleMarker
              key={property.id}
              center={[lat, lng]}
              radius={8}
              pathOptions={{
                color: '#003B73',
                fillColor: '#F59E0B',
                fillOpacity: 1,
                weight: 3,
              }}
              eventHandlers={{
                click: (event) => {
                  /*
                   * Prevent the marker click from
                   * becoming a map-location click.
                   */
                  event.originalEvent.stopPropagation()
                },
              }}
            >
              <Popup>
                <div className="min-w-[190px]">
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
            </CircleMarker>
          )
        })}

        {/* =================================================
            SELECTED MAP LOCATION
        ================================================== */}

        {selectedLocation && (
          <>
            {/* Selected point */}
            <CircleMarker
              center={[
                selectedLocation.lat,
                selectedLocation.lng,
              ]}
              radius={7}
              pathOptions={{
                color: '#003B73',
                fillColor: '#003B73',
                fillOpacity: 1,
                weight: 3,
              }}
            />

            {/* Radius */}
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
          </>
        )}
      </MapContainer>
    </div>
  )
}