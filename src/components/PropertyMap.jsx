import { useEffect, useRef } from 'react'

const GERMANY_CENTER = { lat: 51.1657, lng: 10.4515 }
const DEFAULT_ZOOM = 6
const NEARBY_RADIUS_METERS = 2000

let googleMapsPromise = null

function loadGoogleMaps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return Promise.reject(
      new Error(
        'VITE_GOOGLE_MAPS_API_KEY is missing from the .env file.',
      ),
    )
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps)
  }

  if (googleMapsPromise) {
    return googleMapsPromise
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[data-german-mitra-google-maps="true"]',
    )

    if (existingScript) {
      existingScript.addEventListener('load', () =>
        resolve(window.google.maps),
      )

      existingScript.addEventListener('error', () =>
        reject(
          new Error('Google Maps failed to load.'),
        ),
      )

      return
    }

    const script = document.createElement('script')

    script.src =
      `https://maps.googleapis.com/maps/api/js` +
      `?key=${encodeURIComponent(apiKey)}` +
      `&v=weekly` +
      `&libraries=places`

    script.async = true
    script.defer = true
    script.dataset.germanMitraGoogleMaps = 'true'

    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps)
      } else {
        reject(
          new Error('Google Maps loaded without the Maps API.'),
        )
      }
    }

    script.onerror = () => {
      reject(
        new Error(
          'Unable to load Google Maps. Check your API key and enabled APIs.',
        ),
      )
    }

    document.head.appendChild(script)
  })

  return googleMapsPromise
}

function escapeSvgText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function propertyMarkerIcon(selected = false) {
  const background = selected ? '#F59E0B' : '#003B73'
  const houseColor = selected ? '#003B73' : '#F59E0B'
  const size = selected ? 46 : 42

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 ${size} ${size}"
    >
      <g transform="rotate(-45 ${size / 2} ${size / 2})">
        <rect
          x="1.5"
          y="1.5"
          width="${size - 3}"
          height="${size - 3}"
          rx="${size / 2}"
          fill="${background}"
          stroke="${selected ? '#003B73' : '#FFFFFF'}"
          stroke-width="3"
        />

        <g transform="rotate(45 ${size / 2} ${size / 2})">
          <path
            d="M${size * 0.27} ${size * 0.25}
               L${size * 0.5} ${size * 0.08}
               L${size * 0.73} ${size * 0.25}
               V${size * 0.7}
               H${size * 0.58}
               V${size * 0.5}
               H${size * 0.42}
               V${size * 0.7}
               H${size * 0.27}
               Z"
            fill="${houseColor}"
            stroke="#FFFFFF"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </g>
      </g>
    </svg>
  `

  return {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(size, size),
    anchor: new window.google.maps.Point(
      size / 2,
      size,
    ),
  }
}

function nearbyIcon(type) {
  const isRestaurant = type === 'restaurant'
  const background = isRestaurant
    ? '#E11D48'
    : '#15803D'

  const symbol = isRestaurant ? 'R' : 'P'

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="white"
        stroke="${background}"
        stroke-width="3"
      />
      <text
        x="16"
        y="21"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="15"
        font-weight="700"
        fill="${background}"
      >
        ${symbol}
      </text>
    </svg>
  `

  return {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(32, 32),
    anchor: new window.google.maps.Point(16, 16),
  }
}

function getValidProperties(properties) {
  return properties
    .map((property) => {
      if (!property.coordinates) {
        return null
      }

      const lat = Number(property.coordinates.lat)
      const lng = Number(property.coordinates.lng)

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return null
      }

      return {
        ...property,
        lat,
        lng,
      }
    })
    .filter(Boolean)
}

function GooglePropertyMap({
  properties,
  onLocationSelect,
  onViewportChange,
  selectedLocation,
  radiusKm,
}) {
  const mapElementRef = useRef(null)
  const mapRef = useRef(null)

  const propertyMarkersRef = useRef([])
  const nearbyMarkersRef = useRef([])
  const infoWindowRef = useRef(null)
  const selectedCircleRef = useRef(null)

  const userInteractionRef = useRef(false)
  const programmaticMoveRef = useRef(false)
  const initialFitDoneRef = useRef(false)

  const propertiesRef = useRef(properties)
  const selectedLocationRef = useRef(
    selectedLocation,
  )

  useEffect(() => {
    propertiesRef.current = properties
  }, [properties])

  useEffect(() => {
    selectedLocationRef.current = selectedLocation
  }, [selectedLocation])

  function clearPropertyMarkers() {
    propertyMarkersRef.current.forEach((marker) => {
      marker.setMap(null)
    })

    propertyMarkersRef.current = []
  }

  function clearNearbyMarkers() {
    nearbyMarkersRef.current.forEach((marker) => {
      marker.setMap(null)
    })

    nearbyMarkersRef.current = []
  }

  function clearCircle() {
    if (selectedCircleRef.current) {
      selectedCircleRef.current.setMap(null)
      selectedCircleRef.current = null
    }
  }

  async function searchNearbyPlaces() {
    const map = mapRef.current

    if (!map || !window.google?.maps) {
      return
    }

    const { Place, SearchNearbyRankPreference } =
      await window.google.maps.importLibrary(
        'places',
      )

    const center = map.getCenter()

    if (!center) {
      return
    }

    const searches = [
      {
        type: 'restaurant',
        label: 'Restaurants',
      },
      {
        type: 'park',
        label: 'Parks',
      },
    ]

    clearNearbyMarkers()

    for (const search of searches) {
      try {
        const request = {
          fields: [
            'displayName',
            'location',
            'formattedAddress',
            'googleMapsURI',
          ],
          locationRestriction: {
            center,
            radius: NEARBY_RADIUS_METERS,
          },
          includedPrimaryTypes: [search.type],
          maxResultCount: 12,
          rankPreference:
            SearchNearbyRankPreference.DISTANCE,
        }

        const response =
          await Place.searchNearby(request)

        const places = response?.places || []

        places.forEach((place) => {
          if (!place.location) {
            return
          }

          const marker =
            new window.google.maps.Marker({
              map,
              position: place.location,
              title:
                place.displayName || search.label,
              icon: nearbyIcon(search.type),
              zIndex: 50,
            })

          marker.addListener('click', () => {
            if (!infoWindowRef.current) {
              infoWindowRef.current =
                new window.google.maps.InfoWindow()
            }

            const name = escapeSvgText(
              place.displayName ||
                search.label,
            )

            const address = escapeSvgText(
              place.formattedAddress || '',
            )

            const mapsLink =
              place.googleMapsURI
                ? `
                  <a
                    href="${place.googleMapsURI}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="
                      display:inline-block;
                      margin-top:8px;
                      color:#003B73;
                      font-weight:600;
                      text-decoration:none;
                    "
                  >
                    View in Google Maps
                  </a>
                `
                : ''

            infoWindowRef.current.setContent(`
              <div style="min-width:180px;padding:4px;">
                <div
                  style="
                    font-weight:700;
                    color:#111827;
                    margin-bottom:5px;
                  "
                >
                  ${name}
                </div>

                <div
                  style="
                    font-size:12px;
                    color:#6B7280;
                    line-height:1.4;
                  "
                >
                  ${address}
                </div>

                ${mapsLink}
              </div>
            `)

            infoWindowRef.current.open({
              map,
              anchor: marker,
            })
          })

          nearbyMarkersRef.current.push(marker)
        })
      } catch (error) {
        console.error(
          `Nearby ${search.label} search failed:`,
          error,
        )
      }
    }
  }

  function fitMapToProperties() {
    const map = mapRef.current

    if (!map) {
      return
    }

    const validProperties =
      getValidProperties(propertiesRef.current)

    programmaticMoveRef.current = true

    if (!validProperties.length) {
      map.setCenter(GERMANY_CENTER)
      map.setZoom(DEFAULT_ZOOM)

      window.google.maps.event.addListenerOnce(
        map,
        'idle',
        () => {
          programmaticMoveRef.current = false
        },
      )

      return
    }

    if (validProperties.length === 1) {
      const property = validProperties[0]

      map.setCenter({
        lat: property.lat,
        lng: property.lng,
      })

      map.setZoom(14)

      window.google.maps.event.addListenerOnce(
        map,
        'idle',
        () => {
          programmaticMoveRef.current = false
        },
      )

      return
    }

    const bounds =
      new window.google.maps.LatLngBounds()

    validProperties.forEach((property) => {
      bounds.extend({
        lat: property.lat,
        lng: property.lng,
      })
    })

    map.fitBounds(bounds, 60)

    window.google.maps.event.addListenerOnce(
      map,
      'idle',
      () => {
        programmaticMoveRef.current = false
      },
    )
  }

  function renderPropertyMarkers() {
    const map = mapRef.current

    if (!map) {
      return
    }

    clearPropertyMarkers()

    const validProperties =
      getValidProperties(propertiesRef.current)

    validProperties.forEach((property) => {
      const marker =
        new window.google.maps.Marker({
          map,
          position: {
            lat: property.lat,
            lng: property.lng,
          },
          icon: propertyMarkerIcon(
            selectedLocationRef.current
              ?.propertyId === property.id,
          ),
          title: property.title,
          zIndex: 100,
        })

      marker.addListener('click', () => {
        if (onLocationSelect) {
          onLocationSelect({
            lat: property.lat,
            lng: property.lng,
            propertyId: property.id,
          })
        }

        if (!infoWindowRef.current) {
          infoWindowRef.current =
            new window.google.maps.InfoWindow()
        }

        infoWindowRef.current.setContent(`
          <div style="min-width:220px;padding:4px;">
            <div
              style="
                font-weight:700;
                color:#111827;
              "
            >
              ${escapeSvgText(property.title)}
            </div>

            <div
              style="
                margin-top:4px;
                font-size:13px;
                color:#4B5563;
              "
            >
              ${escapeSvgText(
                `${property.district}, ${property.city}`,
              )}
            </div>

            <div
              style="
                margin-top:8px;
                font-weight:700;
                color:#003B73;
              "
            >
              €${escapeSvgText(property.rent)}
              <span
                style="
                  font-weight:400;
                  color:#6B7280;
                "
              >
                /month
              </span>
            </div>
          </div>
        `)

        infoWindowRef.current.open({
          map,
          anchor: marker,
        })
      })

      propertyMarkersRef.current.push(marker)
    })
  }

  function renderSelectedCircle() {
    const map = mapRef.current

    if (!map) {
      return
    }

    clearCircle()

    const selected =
      selectedLocationRef.current

    if (!selected?.propertyId) {
      return
    }

    selectedCircleRef.current =
      new window.google.maps.Circle({
        map,
        center: {
          lat: selected.lat,
          lng: selected.lng,
        },
        radius:
          radiusKm * 1000,
        strokeColor: '#003B73',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#F59E0B',
        fillOpacity: 0.12,
        clickable: false,
      })
  }

  useEffect(() => {
    let cancelled = false

    loadGoogleMaps()
      .then(() => {
        if (
          cancelled ||
          !mapElementRef.current ||
          mapRef.current
        ) {
          return
        }

        const map =
          new window.google.maps.Map(
            mapElementRef.current,
            {
              center: GERMANY_CENTER,
              zoom: DEFAULT_ZOOM,
              mapTypeId: 'terrain',
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
              gestureHandling: 'greedy',
            },
          )

        mapRef.current = map

        infoWindowRef.current =
          new window.google.maps.InfoWindow()

        map.addListener('dragstart', () => {
          userInteractionRef.current = true
        })

        map.addListener('zoom_changed', () => {
          if (!programmaticMoveRef.current) {
            userInteractionRef.current = true
          }
        })

        map.addListener('click', (event) => {
          if (
            !event.latLng ||
            !onLocationSelect
          ) {
            return
          }

          onLocationSelect({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            propertyId: null,
          })
        })

        map.addListener('idle', () => {
          if (
            !programmaticMoveRef.current &&
            userInteractionRef.current
          ) {
            userInteractionRef.current = false

            const center = map.getCenter()

            if (
              center &&
              onViewportChange
            ) {
              onViewportChange({
                lat: center.lat(),
                lng: center.lng(),
              })
            }

            searchNearbyPlaces()
          }

          if (!initialFitDoneRef.current) {
            initialFitDoneRef.current = true

            fitMapToProperties()
            renderPropertyMarkers()
            renderSelectedCircle()

            window.setTimeout(() => {
              searchNearbyPlaces()
            }, 300)
          }
        })

        window.addEventListener(
          'resize',
          () => {
            window.google.maps.event.trigger(
              map,
              'resize',
            )
          },
        )

        fitMapToProperties()
        renderPropertyMarkers()
        renderSelectedCircle()
      })
      .catch((error) => {
        console.error(
          'Google Maps initialization failed:',
          error,
        )
      })

    return () => {
      cancelled = true

      clearPropertyMarkers()
      clearNearbyMarkers()
      clearCircle()

      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    renderPropertyMarkers()
    renderSelectedCircle()
  }, [
    properties,
    selectedLocation,
    radiusKm,
  ])

  return (
    <div
      ref={mapElementRef}
      className="h-full min-h-0 w-full"
    />
  )
}

export function PropertyMap({
  properties = [],
  onLocationSelect,
  onViewportChange,
  selectedLocation,
  radiusKm = 2,
}) {
  return (
    <div
      className="relative z-0 h-full min-h-0 overflow-hidden rounded-2xl border border-ink-200 bg-ink-100 shadow-card"
      style={{
        overscrollBehavior: 'contain',
      }}
    >
      <GooglePropertyMap
        properties={properties}
        onLocationSelect={onLocationSelect}
        onViewportChange={onViewportChange}
        selectedLocation={selectedLocation}
        radiusKm={radiusKm}
      />
    </div>
  )
}

export default PropertyMap