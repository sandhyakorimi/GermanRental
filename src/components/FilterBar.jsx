import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  MapPin,
  Home,
  Euro,
  BedDouble,
  Sofa,
  SlidersHorizontal,
  Check,
} from 'lucide-react'

import {
  GERMAN_CITIES,
  PROPERTY_TYPES,
  AMENITY_LIST,
} from '../data/cities'

import { classNames } from '../utils/format'

export function FilterBar({
  filters,
  onChange,
  resultCount,
}) {
  const [open, setOpen] = useState(null)

  const update = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
    })
  }

  const toggleAmenity = (amenity) => {
    const current = filters.amenities || []

    const exists = current.includes(amenity)

    const next = exists
      ? current.filter((a) => a !== amenity)
      : [...current, amenity]

    update('amenities', next)
  }

  return (
    <div className="relative z-30">
      {/* =====================================================
          HORIZONTAL FILTER ROW
      ====================================================== */}

      <div
        className="
          no-scrollbar
          flex
          gap-2
          overflow-x-auto
          pb-2
        "
        onScroll={() => {
          // Close dropdown while horizontally scrolling
          if (open) setOpen(null)
        }}
      >

        {/* CITY */}

        <FilterDropdown
          id="city"
          open={open === 'city'}
          setOpen={setOpen}
          label={filters.city || 'Any city'}
          icon={<MapPin className="h-4 w-4" />}
          active={Boolean(filters.city)}
        >
          <div className="max-h-72 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                update('city', '')
                setOpen(null)
              }}
              className={classNames(
                'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm',
                !filters.city
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-700 hover:bg-ink-50',
              )}
            >
              Any city

              {!filters.city && (
                <Check className="h-4 w-4" />
              )}
            </button>

            {GERMAN_CITIES.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  update('city', city.name)
                  setOpen(null)
                }}
                className={classNames(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm',
                  filters.city === city.name
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-700 hover:bg-ink-50',
                )}
              >
                <span>
                  {city.name}
                </span>

                {filters.city === city.name && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </FilterDropdown>

        {/* PROPERTY TYPE */}

        <FilterDropdown
          id="type"
          open={open === 'type'}
          setOpen={setOpen}
          label={filters.type || 'Property type'}
          icon={<Home className="h-4 w-4" />}
          active={Boolean(filters.type)}
        >
          <div className="grid grid-cols-2 gap-2">
            <OptionButton
              active={!filters.type}
              onClick={() => {
                update('type', '')
                setOpen(null)
              }}
            >
              All
            </OptionButton>

            {PROPERTY_TYPES.map((type) => (
              <OptionButton
                key={type}
                active={filters.type === type}
                onClick={() => {
                  update('type', type)
                  setOpen(null)
                }}
              >
                {type}
              </OptionButton>
            ))}
          </div>
        </FilterDropdown>

        {/* MAX RENT */}

        <FilterDropdown
          id="maxRent"
          open={open === 'maxRent'}
          setOpen={setOpen}
          label={
            filters.maxRent
              ? `€${filters.maxRent}`
              : 'Max rent'
          }
          icon={<Euro className="h-4 w-4" />}
          active={Boolean(filters.maxRent)}
        >
          <div className="w-64">
            <p className="mb-3 text-sm font-semibold text-ink-900">
              Maximum monthly rent
            </p>

            <input
              type="range"
              min="300"
              max="2500"
              step="50"
              value={filters.maxRent || 2500}
              onChange={(e) =>
                update(
                  'maxRent',
                  e.target.value,
                )
              }
              className="w-full accent-brand-600"
            />

            <div className="mt-2 flex justify-between text-xs text-ink-500">
              <span>€300</span>

              <span className="font-semibold text-brand-700">
                €{filters.maxRent || 2500}
              </span>

              <span>€2500+</span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(null)}
              className="btn-primary mt-4 w-full"
            >
              Apply
            </button>
          </div>
        </FilterDropdown>

        {/* BEDROOMS */}

        <FilterDropdown
          id="bedrooms"
          open={open === 'bedrooms'}
          setOpen={setOpen}
          label={
            filters.bedrooms
              ? `${filters.bedrooms}+ bedrooms`
              : 'Bedrooms'
          }
          icon={<BedDouble className="h-4 w-4" />}
          active={Boolean(filters.bedrooms)}
        >
          <div className="flex min-w-[200px] flex-col gap-1.5">
            {['', '1', '2', '3', '4'].map(
              (number) => (
                <button
                  key={number || 'any'}
                  type="button"
                  onClick={() => {
                    update(
                      'bedrooms',
                      number,
                    )
                    setOpen(null)
                  }}
                  className={classNames(
                    'flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm',
                    filters.bedrooms === number
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-700 hover:bg-ink-50',
                  )}
                >
                  {number
                    ? `${number}+ bedrooms`
                    : 'Any bedrooms'}

                  {filters.bedrooms === number && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ),
            )}
          </div>
        </FilterDropdown>

        {/* FURNISHED */}

        <FilterDropdown
          id="furnished"
          open={open === 'furnished'}
          setOpen={setOpen}
          label={
            filters.furnished === 'yes'
              ? 'Furnished'
              : filters.furnished === 'no'
                ? 'Unfurnished'
                : 'Furnished'
          }
          icon={<Sofa className="h-4 w-4" />}
          active={Boolean(filters.furnished)}
        >
          <div className="flex min-w-[190px] flex-col gap-1.5">
            <OptionButton
              active={!filters.furnished}
              onClick={() => {
                update('furnished', '')
                setOpen(null)
              }}
            >
              Any
            </OptionButton>

            <OptionButton
              active={filters.furnished === 'yes'}
              onClick={() => {
                update('furnished', 'yes')
                setOpen(null)
              }}
            >
              Furnished
            </OptionButton>

            <OptionButton
              active={filters.furnished === 'no'}
              onClick={() => {
                update('furnished', 'no')
                setOpen(null)
              }}
            >
              Unfurnished
            </OptionButton>
          </div>
        </FilterDropdown>

        {/* AMENITIES */}

        <FilterDropdown
          id="amenities"
          open={open === 'amenities'}
          setOpen={setOpen}
          label={
            filters.amenities?.length
              ? `${filters.amenities.length} amenities`
              : 'Amenities'
          }
          icon={
            <SlidersHorizontal className="h-4 w-4" />
          }
          active={Boolean(filters.amenities?.length)}
        >
          <div className="w-[280px] max-w-[calc(100vw-2rem)]">
            <div className="max-h-72 overflow-y-auto">
              {AMENITY_LIST.map((amenity) => {
                const active = (
                  filters.amenities || []
                ).includes(amenity)

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() =>
                      toggleAmenity(amenity)
                    }
                    className={classNames(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm',
                      active
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-700 hover:bg-ink-50',
                    )}
                  >
                    <span
                      className={classNames(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                        active
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-ink-300 bg-white',
                      )}
                    >
                      {active && (
                        <Check className="h-3 w-3" />
                      )}
                    </span>

                    {amenity}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setOpen(null)}
              className="btn-primary mt-3 w-full"
            >
              Show {resultCount} results
            </button>
          </div>
        </FilterDropdown>
      </div>
    </div>
  )
}

/* ============================================================
   DROPDOWN
============================================================ */

function FilterDropdown({
  id,
  open,
  setOpen,
  label,
  icon,
  active,
  children,
}) {
  const wrapperRef = useRef(null)
  const buttonRef = useRef(null)

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  })

  const updatePosition = () => {
    if (!buttonRef.current) return

    const rect =
      buttonRef.current.getBoundingClientRect()

    const estimatedWidth = 300

    const left = Math.max(
      16,
      Math.min(
        rect.left,
        window.innerWidth -
          estimatedWidth -
          16,
      ),
    )

    setPosition({
      top: rect.bottom + 8,
      left,
    })
  }

  useEffect(() => {
    if (!open) return

    updatePosition()

    const onResize = () => updatePosition()

    const onScroll = () => updatePosition()

    const onMouseDown = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target,
        )
      ) {
        setOpen(null)
      }
    }

    window.addEventListener(
      'resize',
      onResize,
    )

    window.addEventListener(
      'scroll',
      onScroll,
      true,
    )

    document.addEventListener(
      'mousedown',
      onMouseDown,
    )

    return () => {
      window.removeEventListener(
        'resize',
        onResize,
      )

      window.removeEventListener(
        'scroll',
        onScroll,
        true,
      )

      document.removeEventListener(
        'mousedown',
        onMouseDown,
      )
    }
  }, [open, setOpen])

  return (
    <div
      ref={wrapperRef}
      className="shrink-0"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen(
            open ? null : id,
          )

          requestAnimationFrame(
            updatePosition,
          )
        }}
        className={classNames(
          'inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition',
          active
            ? 'border-brand-600 bg-brand-50 text-brand-700'
            : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50',
        )}
      >
        {icon}

        {label}

        <ChevronDown
          className={classNames(
            'h-4 w-4 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className="
            fixed
            z-[9999]
            rounded-2xl
            border
            border-ink-200
            bg-white
            p-3
            shadow-cardHover
          "
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   OPTION BUTTON
============================================================ */

function OptionButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'rounded-lg px-3 py-2.5 text-left text-sm transition',
        active
          ? 'bg-brand-50 font-semibold text-brand-700'
          : 'text-ink-700 hover:bg-ink-50',
      )}
    >
      {children}
    </button>
  )
}