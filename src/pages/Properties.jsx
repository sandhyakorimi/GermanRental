// import { useEffect, useMemo, useState } from 'react'
// import { useSearchParams } from 'react-router-dom'
// import {
//   SlidersHorizontal,
//   ArrowUpDown,
//   Grid2x2,
//   LayoutGrid,
//   Search,
//   X,
// } from 'lucide-react'

// import { PropertyCard } from '../components/PropertyCard'
// import { FilterBar } from '../components/FilterBar'
// import {
//   EmptyState,
//   SkeletonCard,
//   DisclaimerBanner,
// } from '../components/ui'
// import { useListings } from '../context/ListingsContext'
// import { classNames } from '../utils/format'

// const SORT_OPTIONS = [
//   { value: 'newest', label: 'Newest first' },
//   { value: 'price-asc', label: 'Price: low to high' },
//   { value: 'price-desc', label: 'Price: high to low' },
//   { value: 'area-desc', label: 'Largest area' },
// ]

// const emptyFilters = {
//   city: '',
//   type: '',
//   maxRent: '',
//   bedrooms: '',
//   furnished: '',
//   amenities: [],
//   q: '',
// }

// export default function Properties() {
//   const { listings } = useListings()
//   const [params, setParams] = useSearchParams()

//   const [loading, setLoading] = useState(true)
//   const [sort, setSort] = useState('newest')
//   const [density, setDensity] = useState('comfortable')
//   const [mobileFilters, setMobileFilters] = useState(false)

//   /*
//    * CITY COMES DIRECTLY FROM THE URL.
//    *
//    * Navbar:
//    * /properties?city=Frankfurt
//    *
//    * Therefore:
//    * city = Frankfurt
//    *
//    * We do NOT use an effect to copy this into state.
//    */
//   const selectedCity = params.get('city') || ''

//   /*
//    * Other filters remain local state.
//    */
//   const [filters, setFilters] = useState(() => ({
//     ...emptyFilters,
//     type: params.get('type') || '',
//     maxRent: params.get('maxRent') || '',
//     q: params.get('q') || '',
//   }))

//   // -------------------------------------------------------
//   // LOADING
//   // -------------------------------------------------------

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false)
//     }, 350)

//     return () => clearTimeout(timer)
//   }, [])

//   // -------------------------------------------------------
//   // UPDATE NON-CITY URL FILTERS
//   //
//   // City is NOT handled here.
//   // City belongs to the URL directly.
//   // -------------------------------------------------------

//   useEffect(() => {
//     const next = new URLSearchParams(params)

//     if (filters.type) {
//       next.set('type', filters.type)
//     } else {
//       next.delete('type')
//     }

//     if (filters.maxRent) {
//       next.set('maxRent', filters.maxRent)
//     } else {
//       next.delete('maxRent')
//     }

//     if (filters.q) {
//       next.set('q', filters.q)
//     } else {
//       next.delete('q')
//     }

//     const current = params.toString()
//     const updated = next.toString()

//     if (current !== updated) {
//       setParams(next, { replace: true })
//     }
//   }, [
//     filters.type,
//     filters.maxRent,
//     filters.q,
//     setParams,
//   ])

//   // -------------------------------------------------------
//   // FILTER PROPERTIES
//   // -------------------------------------------------------

//   const filtered = useMemo(() => {
//     let list = listings.filter(
//       (p) => p.status === 'approved'
//     )

//     /*
//      * CITY FILTER
//      *
//      * This works for EVERY city.
//      *
//      * Berlin     -> Berlin
//      * Frankfurt  -> Frankfurt
//      * Hamburg    -> Hamburg
//      * Munich     -> Munich
//      * etc.
//      */
//     if (selectedCity) {
//       const city = selectedCity
//         .trim()
//         .toLowerCase()

//       list = list.filter((p) => {
//         if (!p.city) return false

//         return (
//           p.city.trim().toLowerCase() === city
//         )
//       })
//     }

//     // PROPERTY TYPE
//     if (filters.type) {
//       list = list.filter(
//         (p) => p.type === filters.type
//       )
//     }

//     // MAX RENT
//     if (filters.maxRent) {
//       list = list.filter(
//         (p) =>
//           p.rent <= Number(filters.maxRent)
//       )
//     }

//     // BEDROOMS
//     if (filters.bedrooms) {
//       list = list.filter(
//         (p) =>
//           p.bedrooms >= Number(filters.bedrooms)
//       )
//     }

//     // FURNISHED
//     if (filters.furnished === 'yes') {
//       list = list.filter(
//         (p) => p.furnished
//       )
//     }

//     if (filters.furnished === 'no') {
//       list = list.filter(
//         (p) => !p.furnished
//       )
//     }

//     // AMENITIES
//     if (filters.amenities.length) {
//       list = list.filter(
//         (p) =>
//           p.amenities &&
//           filters.amenities.every((a) =>
//             p.amenities.includes(a)
//           )
//       )
//     }

//     // SEARCH
//     if (filters.q) {
//       const q = filters.q
//         .trim()
//         .toLowerCase()

//       list = list.filter((p) => {
//         const title =
//           p.title?.toLowerCase() || ''

//         const city =
//           p.city?.toLowerCase() || ''

//         const district =
//           p.district?.toLowerCase() || ''

//         const type =
//           p.type?.toLowerCase() || ''

//         return (
//           title.includes(q) ||
//           city.includes(q) ||
//           district.includes(q) ||
//           type.includes(q)
//         )
//       })
//     }

//     // SORT
//     switch (sort) {
//       case 'price-asc':
//         return [...list].sort(
//           (a, b) => a.rent - b.rent
//         )

//       case 'price-desc':
//         return [...list].sort(
//           (a, b) => b.rent - a.rent
//         )

//       case 'area-desc':
//         return [...list].sort(
//           (a, b) => b.area - a.area
//         )

//       case 'newest':
//       default:
//         return [...list].sort(
//           (a, b) =>
//             new Date(b.createdAt) -
//             new Date(a.createdAt)
//         )
//     }
//   }, [
//     listings,
//     selectedCity,
//     filters,
//     sort,
//   ])

//   // -------------------------------------------------------
//   // ACTIVE FILTER COUNT
//   // -------------------------------------------------------

//   const activeCount = [
//     selectedCity,
//     filters.type,
//     filters.bedrooms,
//     filters.furnished,
//     filters.q,
//     filters.maxRent ? 'rent' : '',
//     filters.amenities.length
//       ? 'amenities'
//       : '',
//   ].filter(Boolean).length

//   // -------------------------------------------------------
//   // RESET FILTERS
//   // -------------------------------------------------------

//   const resetFilters = () => {
//     setFilters({
//       ...emptyFilters,
//     })

//     // Remove city and other URL filters
//     setParams({}, { replace: true })
//   }

//   // -------------------------------------------------------
//   // FILTER PANEL CHANGE
//   // -------------------------------------------------------

//   const handleFilterChange = (nextFilters) => {
//     /*
//      * If the CITY dropdown inside FilterPanel changes,
//      * update the URL directly.
//      */

//     if (nextFilters.city !== selectedCity) {
//       const nextParams = new URLSearchParams(params)

//       if (nextFilters.city) {
//         nextParams.set(
//           'city',
//           nextFilters.city
//         )
//       } else {
//         nextParams.delete('city')
//       }

//       setParams(nextParams, {
//         replace: true,
//       })
//     }

//     /*
//      * Keep all the other existing filters.
//      *
//      * We don't store city in local state because
//      * selectedCity comes directly from the URL.
//      */
//     setFilters({
//       ...nextFilters,
//       city: selectedCity,
//     })
//   }

//   return (
//     <div className="container-page py-8 lg:py-10">

//       {/* HEADER */}

//       <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
//             Browse properties
//           </h1>

//           <p className="mt-2 text-sm text-ink-600">
//             {filtered.length}{' '}
//             {filtered.length === 1
//               ? 'home'
//               : 'homes'}{' '}
//             across Germany

//             {selectedCity && (
//               <>
//                 {' '}in{' '}
//                 <strong>
//                   {selectedCity}
//                 </strong>
//               </>
//             )}
//           </p>
//         </div>

//         <div className="flex items-center gap-2">

//           {/* DESKTOP SEARCH */}

//           <div className="relative hidden sm:block">

//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

//             <input
//               value={filters.q}
//               onChange={(e) =>
//                 setFilters((f) => ({
//                   ...f,
//                   q: e.target.value,
//                 }))
//               }
//               placeholder="Search title, city, district…"
//               className="input pl-9"
//             />

//           </div>

//           {/* MOBILE FILTER BUTTON */}

//           <button
//             onClick={() =>
//               setMobileFilters(true)
//             }
//             className="btn-secondary lg:hidden"
//           >
//             <SlidersHorizontal className="h-4 w-4" />

//             Filters

//             {activeCount > 0 && (
//               <span className="ml-1 rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white">
//                 {activeCount}
//               </span>
//             )}
//           </button>

//         </div>
//       </div>

//       {/* MOBILE SEARCH */}

//       <div className="relative mt-4 sm:hidden">

//         <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

//         <input
//           value={filters.q}
//           onChange={(e) =>
//             setFilters((f) => ({
//               ...f,
//               q: e.target.value,
//             }))
//           }
//           placeholder="Search title, city, district…"
//           className="input pl-9"
//         />

//       </div>

//       {/* MAIN */}

//       <div className="mt-6 flex gap-8">

//         {/* FILTER PANEL */}

//         <FilterPanel
//           filters={{
//             ...filters,
//             city: selectedCity,
//           }}
//           onChange={handleFilterChange}
//           onReset={resetFilters}
//           resultCount={filtered.length}
//           mobileOpen={mobileFilters}
//           onMobileClose={() =>
//             setMobileFilters(false)
//           }
//         />

//         {/* RESULTS */}

//         <div className="min-w-0 flex-1">

//           {/* TOP BAR */}

//           <div className="mb-4 flex items-center justify-between gap-3">

//             <div className="flex flex-wrap items-center gap-2">

//               {activeCount > 0 && (
//                 <button
//                   onClick={resetFilters}
//                   className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600 transition hover:bg-ink-200"
//                 >
//                   Clear all

//                   <X className="h-3 w-3" />
//                 </button>
//               )}

//               {/* CITY PILL */}

//               {selectedCity && (
//                 <Pill
//                   label={selectedCity}
//                   onClear={() => {
//                     const nextParams =
//                       new URLSearchParams(
//                         params
//                       )

//                     nextParams.delete('city')

//                     setParams(
//                       nextParams,
//                       { replace: true }
//                     )
//                   }}
//                 />
//               )}

//               {/* TYPE PILL */}

//               {filters.type && (
//                 <Pill
//                   label={filters.type}
//                   onClear={() =>
//                     setFilters((f) => ({
//                       ...f,
//                       type: '',
//                     }))
//                   }
//                 />
//               )}

//               {/* FURNISHED PILL */}

//               {filters.furnished === 'yes' && (
//                 <Pill
//                   label="Furnished"
//                   onClear={() =>
//                     setFilters((f) => ({
//                       ...f,
//                       furnished: '',
//                     }))
//                   }
//                 />
//               )}

//               {filters.furnished === 'no' && (
//                 <Pill
//                   label="Unfurnished"
//                   onClear={() =>
//                     setFilters((f) => ({
//                       ...f,
//                       furnished: '',
//                     }))
//                   }
//                 />
//               )}

//             </div>

//             {/* SORT */}

//             <div className="flex items-center gap-2">

//               {/* DENSITY */}

//               <div className="hidden items-center gap-1 rounded-xl ring-1 ring-ink-200 sm:flex">

//                 <button
//                   onClick={() =>
//                     setDensity(
//                       'comfortable'
//                     )
//                   }
//                   className={classNames(
//                     'rounded-lg p-2 transition',
//                     density === 'comfortable'
//                       ? 'bg-ink-100 text-ink-900'
//                       : 'text-ink-400 hover:text-ink-700'
//                   )}
//                   aria-label="Comfortable grid"
//                 >
//                   <Grid2x2 className="h-4 w-4" />
//                 </button>

//                 <button
//                   onClick={() =>
//                     setDensity('compact')
//                   }
//                   className={classNames(
//                     'rounded-lg p-2 transition',
//                     density === 'compact'
//                       ? 'bg-ink-100 text-ink-900'
//                       : 'text-ink-400 hover:text-ink-700'
//                   )}
//                   aria-label="Compact grid"
//                 >
//                   <LayoutGrid className="h-4 w-4" />
//                 </button>

//               </div>

//               {/* SORT */}

//               <label className="relative">

//                 <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />

//                 <select
//                   value={sort}
//                   onChange={(e) =>
//                     setSort(e.target.value)
//                   }
//                   className="input appearance-none pl-9 pr-8"
//                 >
//                   {SORT_OPTIONS.map((o) => (
//                     <option
//                       key={o.value}
//                       value={o.value}
//                     >
//                       {o.label}
//                     </option>
//                   ))}
//                 </select>

//               </label>

//             </div>
//           </div>

//           {/* RESULTS */}

//           {loading ? (
//             <div
//               className={classNames(
//                 'grid gap-6',
//                 density === 'compact'
//                   ? 'sm:grid-cols-2 lg:grid-cols-4'
//                   : 'sm:grid-cols-2 lg:grid-cols-3'
//               )}
//             >
//               {Array.from({
//                 length: 6,
//               }).map((_, i) => (
//                 <SkeletonCard key={i} />
//               ))}
//             </div>
//           ) : filtered.length === 0 ? (
//             <EmptyState
//               icon={
//                 <Search className="h-7 w-7" />
//               }
//               title="No properties match your filters"
//               description="Try widening your search — remove a filter or increase the maximum rent."
//               action={
//                 <button
//                   onClick={resetFilters}
//                   className="btn-primary"
//                 >
//                   Reset filters
//                 </button>
//               }
//             />
//           ) : (
//             <div
//               className={classNames(
//                 'grid gap-6',
//                 density === 'compact'
//                   ? 'sm:grid-cols-2 lg:grid-cols-4'
//                   : 'sm:grid-cols-2 lg:grid-cols-3'
//               )}
//             >
//               {filtered.map((p, i) => (
//                 <PropertyCard
//                   key={p.id}
//                   property={p}
//                   index={i}
//                 />
//               ))}
//             </div>
//           )}

//           <div className="mt-8">
//             <DisclaimerBanner />
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// function Pill({ label, onClear }) {
//   return (
//     <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
//       {label}

//       <button
//         onClick={onClear}
//         className="rounded-full hover:text-brand-900"
//         aria-label={`Remove ${label}`}
//       >
//         <X className="h-3 w-3" />
//       </button>

//     </span>
//   )
// }






import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowUpDown,
  Grid2x2,
  LayoutGrid,
  Search,
  X,
  Map as MapIcon,
  List as ListIcon,
  MapPin,
} from 'lucide-react'

import { PropertyCard } from '../components/PropertyCard'
import { FilterBar } from '../components/FilterBar'
import { PropertyMap } from '../components/PropertyMap'

import {
  EmptyState,
  SkeletonCard,
  DisclaimerBanner,
} from '../components/ui'

import { useListings } from '../context/ListingsContext'
import { classNames } from '../utils/format'

const SORT_OPTIONS = [
  {
    value: 'newest',
    label: 'Newest first',
  },
  {
    value: 'price-asc',
    label: 'Price: low to high',
  },
  {
    value: 'price-desc',
    label: 'Price: high to low',
  },
  {
    value: 'area-desc',
    label: 'Largest area',
  },
]

const emptyFilters = {
  city: '',
  type: '',
  maxRent: '',
  bedrooms: '',
  furnished: '',
  amenities: [],
  q: '',
}

const MAP_RADIUS_KM = 2

export default function Properties() {
  const { listings } = useListings()
  const [params, setParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [density, setDensity] = useState('comfortable')

  // Map state
  const [mapOpen, setMapOpen] = useState(false)
  const [mapLocation, setMapLocation] = useState(null)

  /*
   * =========================================================
   * CITY FROM URL
   *
   * /properties?city=Berlin
   * /properties?city=Frankfurt
   * /properties?city=Munich
   * =========================================================
   */
  const selectedCity = params.get('city') || ''

  /*
   * =========================================================
   * OTHER FILTERS
   * =========================================================
   */
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    type: params.get('type') || '',
    maxRent: params.get('maxRent') || '',
    bedrooms: params.get('bedrooms') || '',
    furnished: params.get('furnished') || '',
    q: params.get('q') || '',
    amenities: params.get('amenities')
      ? params.get('amenities').split(',')
      : [],
  }))

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 350)

    return () => clearTimeout(timer)
  }, [])

  /*
   * =========================================================
   * KEEP FILTERS IN URL
   * =========================================================
   */
  useEffect(() => {
    const next = new URLSearchParams(params)

    if (filters.type) {
      next.set('type', filters.type)
    } else {
      next.delete('type')
    }

    if (filters.maxRent) {
      next.set('maxRent', filters.maxRent)
    } else {
      next.delete('maxRent')
    }

    if (filters.bedrooms) {
      next.set('bedrooms', filters.bedrooms)
    } else {
      next.delete('bedrooms')
    }

    if (filters.furnished) {
      next.set('furnished', filters.furnished)
    } else {
      next.delete('furnished')
    }

    if (filters.q) {
      next.set('q', filters.q)
    } else {
      next.delete('q')
    }

    if (
      filters.amenities &&
      filters.amenities.length > 0
    ) {
      next.set(
        'amenities',
        filters.amenities.join(','),
      )
    } else {
      next.delete('amenities')
    }

    const currentString = params.toString()
    const nextString = next.toString()

    if (currentString !== nextString) {
      setParams(next, {
        replace: true,
      })
    }
  }, [
    filters.type,
    filters.maxRent,
    filters.bedrooms,
    filters.furnished,
    filters.q,
    filters.amenities,
    params,
    setParams,
  ])

  /*
   * =========================================================
   * FILTER BAR CHANGE
   * =========================================================
   */
  const handleFilterChange = (nextFilters) => {
    /*
     * Update city in URL
     */
    if (nextFilters.city !== selectedCity) {
      const nextParams = new URLSearchParams(params)

      if (nextFilters.city) {
        nextParams.set(
          'city',
          nextFilters.city,
        )
      } else {
        nextParams.delete('city')
      }

      setParams(nextParams, {
        replace: true,
      })
    }

    /*
     * Update local filters
     */
    setFilters({
      ...nextFilters,
      city: selectedCity,
    })

    /*
     * Clear map selection when the user
     * changes normal filters.
     *
     * This keeps the behavior predictable.
     */
    setMapLocation(null)
  }

  /*
   * =========================================================
   * BASE FILTERING
   *
   * Everything except map filtering.
   * =========================================================
   */
  const baseFiltered = useMemo(() => {
    let list = listings.filter(
      (p) => p.status === 'approved',
    )

    /*
     * CITY
     */
    if (selectedCity) {
      const city = selectedCity
        .trim()
        .toLowerCase()

      list = list.filter((p) => {
        if (!p.city) return false

        return (
          p.city.trim().toLowerCase() ===
          city
        )
      })
    }

    /*
     * PROPERTY TYPE
     */
    if (filters.type) {
      list = list.filter(
        (p) => p.type === filters.type,
      )
    }

    /*
     * MAX RENT
     */
    if (filters.maxRent) {
      list = list.filter(
        (p) =>
          p.rent <=
          Number(filters.maxRent),
      )
    }

    /*
     * BEDROOMS
     */
    if (filters.bedrooms) {
      list = list.filter(
        (p) =>
          p.bedrooms >=
          Number(filters.bedrooms),
      )
    }

    /*
     * FURNISHED
     */
    if (filters.furnished === 'yes') {
      list = list.filter(
        (p) => p.furnished,
      )
    }

    if (filters.furnished === 'no') {
      list = list.filter(
        (p) => !p.furnished,
      )
    }

    /*
     * AMENITIES
     */
    if (
      filters.amenities &&
      filters.amenities.length > 0
    ) {
      list = list.filter((p) => {
        if (!p.amenities) return false

        return filters.amenities.every(
          (amenity) =>
            p.amenities.includes(
              amenity,
            ),
        )
      })
    }

    /*
     * TEXT SEARCH
     */
    if (filters.q) {
      const q = filters.q
        .trim()
        .toLowerCase()

      list = list.filter((p) => {
        const title =
          p.title?.toLowerCase() || ''

        const city =
          p.city?.toLowerCase() || ''

        const district =
          p.district?.toLowerCase() ||
          ''

        const type =
          p.type?.toLowerCase() || ''

        return (
          title.includes(q) ||
          city.includes(q) ||
          district.includes(q) ||
          type.includes(q)
        )
      })
    }

    return list
  }, [
    listings,
    selectedCity,
    filters,
  ])

  /*
   * =========================================================
   * FINAL FILTERING
   *
   * Adds map radius filtering on top of all
   * the normal filters.
   * =========================================================
   */
  const filtered = useMemo(() => {
    let list = [...baseFiltered]

    /*
     * MAP RADIUS
     */
    if (mapLocation) {
      list = list.filter((property) => {
        if (!property.coordinates) {
          return false
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
          return false
        }

        const distance = distanceInKm(
          mapLocation.lat,
          mapLocation.lng,
          lat,
          lng,
        )

        return (
          distance <= MAP_RADIUS_KM
        )
      })
    }

    /*
     * SORT
     */
    switch (sort) {
      case 'price-asc':
        return list.sort(
          (a, b) => a.rent - b.rent,
        )

      case 'price-desc':
        return list.sort(
          (a, b) => b.rent - a.rent,
        )

      case 'area-desc':
        return list.sort(
          (a, b) => b.area - a.area,
        )

      case 'newest':
      default:
        return list.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt),
        )
    }
  }, [
    baseFiltered,
    mapLocation,
    sort,
  ])

  /*
   * =========================================================
   * ACTIVE FILTER COUNT
   * =========================================================
   */
  const activeCount = [
    selectedCity,
    filters.type,
    filters.bedrooms,
    filters.furnished,
    filters.q,
    filters.maxRent
      ? 'rent'
      : '',
    filters.amenities?.length
      ? 'amenities'
      : '',
  ].filter(Boolean).length

  /*
   * =========================================================
   * RESET FILTERS
   * =========================================================
   */
  const resetFilters = () => {
    setFilters({
      ...emptyFilters,
    })

    setMapLocation(null)

    setParams(
      {},
      {
        replace: true,
      },
    )
  }

  /*
   * =========================================================
   * MAP LOCATION SELECTED
   * =========================================================
   */
  const handleMapLocation = (
    location,
  ) => {
    setMapLocation(location)
  }

  /*
   * =========================================================
   * CLEAR MAP LOCATION
   * =========================================================
   */
  const clearMapLocation = () => {
    setMapLocation(null)
  }

  return (
    <div className="container-page py-6 lg:py-8">

      {/* =====================================================
          TOP FILTER BAR
      ====================================================== */}

      <div className="mb-5">
        <FilterBar
          filters={{
            ...filters,
            city: selectedCity,
          }}
          onChange={
            handleFilterChange
          }
          resultCount={
            filtered.length
          }
        />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Browse properties
          </h1>

          <p className="mt-2 text-sm text-ink-600">
            {filtered.length}{' '}
            {filtered.length === 1
              ? 'home'
              : 'homes'}{' '}
            across Germany

            {selectedCity && (
              <>
                {' '}in{' '}
                <strong>
                  {selectedCity}
                </strong>
              </>
            )}

            {mapLocation && (
              <>
                {' '}near selected map location
              </>
            )}
          </p>
        </div>

        {/* DESKTOP SEARCH */}

        <div className="relative hidden sm:block">

          <Search
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              h-4 w-4
              -translate-y-1/2
              text-ink-400
            "
          />

          <input
            value={filters.q}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                q: e.target.value,
              }))
            }
            placeholder="Search title, city, district…"
            className="input pl-9"
          />

        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH
      ====================================================== */}

      <div className="relative mt-4 sm:hidden">

        <Search
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            h-4 w-4
            -translate-y-1/2
            text-ink-400
          "
        />

        <input
          value={filters.q}
          onChange={(e) =>
            setFilters((current) => ({
              ...current,
              q: e.target.value,
            }))
          }
          placeholder="Search title, city, district…"
          className="input pl-9"
        />

      </div>

      {/* =====================================================
          MAP / LIST BUTTON
      ====================================================== */}

      <div className="mt-5 flex items-center justify-between gap-3">

        {/* MAP LOCATION PILL */}

        <div className="min-w-0 flex-1">

          {mapLocation && (
            <button
              type="button"
              onClick={
                clearMapLocation
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-brand-50
                px-3
                py-1.5
                text-xs
                font-semibold
                text-brand-700
              "
            >
              <MapPin className="h-3.5 w-3.5" />

              Nearby location

              <X className="h-3 w-3" />
            </button>
          )}

        </div>

        {/* DESKTOP MAP BUTTON */}

        <button
          type="button"
          onClick={() =>
            setMapOpen(
              (open) => !open,
            )
          }
          className={classNames(
            'hidden shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition lg:inline-flex',
            mapOpen
              ? 'bg-brand-700 text-white shadow-soft'
              : 'border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50',
          )}
        >
          {mapOpen ? (
            <ListIcon className="h-4 w-4" />
          ) : (
            <MapIcon className="h-4 w-4" />
          )}

          {mapOpen
            ? 'Show list'
            : 'Map'}
        </button>

      </div>

      {/* =====================================================
          ACTIVE FILTER PILLS + SORT
      ====================================================== */}

      <div className="mt-4">

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

          {/* ACTIVE PILLS */}

          <div className="flex min-w-0 flex-wrap items-center gap-2">

            {selectedCity && (
              <Pill
                label={selectedCity}
                onClear={() => {
                  const nextParams =
                    new URLSearchParams(
                      params,
                    )

                  nextParams.delete(
                    'city',
                  )

                  setParams(
                    nextParams,
                    {
                      replace: true,
                    },
                  )
                }}
              />
            )}

            {filters.type && (
              <Pill
                label={filters.type}
                onClear={() =>
                  setFilters(
                    (current) => ({
                      ...current,
                      type: '',
                    }),
                  )
                }
              />
            )}

            {filters.maxRent && (
              <Pill
                label={`Max €${filters.maxRent}`}
                onClear={() =>
                  setFilters(
                    (current) => ({
                      ...current,
                      maxRent: '',
                    }),
                  )
                }
              />
            )}

            {filters.bedrooms && (
              <Pill
                label={`${filters.bedrooms}+ bedrooms`}
                onClear={() =>
                  setFilters(
                    (current) => ({
                      ...current,
                      bedrooms: '',
                    }),
                  )
                }
              />
            )}

            {filters.furnished ===
              'yes' && (
              <Pill
                label="Furnished"
                onClear={() =>
                  setFilters(
                    (current) => ({
                      ...current,
                      furnished: '',
                    }),
                  )
                }
              />
            )}

            {filters.furnished ===
              'no' && (
              <Pill
                label="Unfurnished"
                onClear={() =>
                  setFilters(
                    (current) => ({
                      ...current,
                      furnished: '',
                    }),
                  )
                }
              />
            )}

            {filters.amenities?.map(
              (amenity) => (
                <Pill
                  key={amenity}
                  label={amenity}
                  onClear={() =>
                    setFilters(
                      (current) => ({
                        ...current,
                        amenities:
                          current.amenities.filter(
                            (a) =>
                              a !== amenity,
                          ),
                      }),
                    )
                  }
                />
              ),
            )}

            {filters.q && (
              <Pill
                label={`Search: ${filters.q}`}
                onClear={() =>
                  setFilters(
                    (current) => ({
                      ...current,
                      q: '',
                    }),
                  )
                }
              />
            )}

          </div>

          {/* SORT + DENSITY */}

          <div className="flex shrink-0 items-center gap-2">

            {/* DENSITY */}

            <div className="hidden items-center gap-1 rounded-xl ring-1 ring-ink-200 sm:flex">

              <button
                type="button"
                onClick={() =>
                  setDensity(
                    'comfortable',
                  )
                }
                className={classNames(
                  'rounded-lg p-2 transition',
                  density ===
                    'comfortable'
                    ? 'bg-ink-100 text-ink-900'
                    : 'text-ink-400 hover:text-ink-700',
                )}
                aria-label="Comfortable grid"
              >
                <Grid2x2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setDensity(
                    'compact',
                  )
                }
                className={classNames(
                  'rounded-lg p-2 transition',
                  density ===
                    'compact'
                    ? 'bg-ink-100 text-ink-900'
                    : 'text-ink-400 hover:text-ink-700',
                )}
                aria-label="Compact grid"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>

            </div>

            {/* SORT */}

            <label className="relative">

              <ArrowUpDown
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-ink-400
                "
              />

              <select
                value={sort}
                onChange={(e) =>
                  setSort(
                    e.target.value,
                  )
                }
                className="
                  input
                  appearance-none
                  pl-9
                  pr-8
                "
              >
                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>

            </label>

          </div>
        </div>

      </div>

      {/* =====================================================
          MOBILE MAP
      ====================================================== */}

      {mapOpen && (
        <div className="mb-5 lg:hidden">
          <div className="h-[65vh] min-h-[420px]">
            <PropertyMap
              properties={
                baseFiltered
              }
              selectedLocation={
                mapLocation
              }
              onLocationSelect={
                handleMapLocation
              }
              radiusKm={
                MAP_RADIUS_KM
              }
            />
          </div>

          {mapLocation && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-brand-700">
                  {filtered.length}{' '}
                  {filtered.length === 1
                    ? 'property'
                    : 'properties'}{' '}
                  nearby
                </p>

                <p className="text-xs text-brand-600">
                  Within{' '}
                  {MAP_RADIUS_KM} km
                </p>
              </div>

              <button
                type="button"
                onClick={
                  clearMapLocation
                }
                className="text-xs font-semibold text-brand-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          DESKTOP CONTENT
      ====================================================== */}

      <div
        className={classNames(
          'mt-5',
          mapOpen
            ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-6'
            : 'block',
        )}
      >

        {/* ===================================================
            PROPERTY RESULTS
        ==================================================== */}

        <div className="min-w-0">

          {loading ? (

            <div
              className={classNames(
                'grid gap-6',
                density ===
                  'compact'
                  ? 'sm:grid-cols-2 lg:grid-cols-3'
                  : 'sm:grid-cols-2 lg:grid-cols-3',
              )}
            >
              {Array.from({
                length: 6,
              }).map(
                (_, index) => (
                  <SkeletonCard
                    key={index}
                  />
                ),
              )}
            </div>

          ) : filtered.length === 0 ? (

            <EmptyState
              icon={
                mapLocation ? (
                  <MapIcon className="h-7 w-7" />
                ) : (
                  <Search className="h-7 w-7" />
                )
              }
              title={
                mapLocation
                  ? 'No available apartments here'
                  : selectedCity
                    ? `No available apartments in ${selectedCity}`
                    : 'No properties match your filters'
              }
              description={
                mapLocation
                  ? `No apartments within ${MAP_RADIUS_KM} km of this location match your current filters.`
                  : selectedCity
                    ? 'Try changing the filters or selecting another location.'
                    : 'Try widening your search or changing one of the filters.'
              }
              action={
                mapLocation ? (
                  <button
                    type="button"
                    onClick={
                      clearMapLocation
                    }
                    className="btn-primary"
                  >
                    Clear map location
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      resetFilters
                    }
                    className="btn-primary"
                  >
                    Reset filters
                  </button>
                )
              }
            />

          ) : (

            <div
              className={classNames(
                'grid gap-6',
                density ===
                  'compact'
                  ? 'sm:grid-cols-2 lg:grid-cols-3'
                  : 'sm:grid-cols-2 lg:grid-cols-3',
              )}
            >
              {filtered.map(
                (
                  property,
                  index,
                ) => (
                  <PropertyCard
                    key={
                      property.id
                    }
                    property={
                      property
                    }
                    index={index}
                  />
                ),
              )}
            </div>

          )}

          <div className="mt-8">
            <DisclaimerBanner />
          </div>

        </div>

        {/* ===================================================
            DESKTOP MAP — RIGHT SIDE
        ==================================================== */}

        {mapOpen && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 h-[calc(100vh-120px)]">
              <PropertyMap
                properties={
                  baseFiltered
                }
                selectedLocation={
                  mapLocation
                }
                onLocationSelect={
                  handleMapLocation
                }
                radiusKm={
                  MAP_RADIUS_KM
                }
              />

              {mapLocation && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-700">
                      {filtered.length}{' '}
                      {filtered.length ===
                      1
                        ? 'property'
                        : 'properties'}{' '}
                      nearby
                    </p>

                    <p className="text-xs text-brand-600">
                      Within{' '}
                      {MAP_RADIUS_KM}{' '}
                      km
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      clearMapLocation
                    }
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}

      </div>

      {/* =====================================================
          MOBILE FIXED MAP BUTTON
      ====================================================== */}

      <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 lg:hidden">
        <button
          type="button"
          onClick={() =>
            setMapOpen(
              (open) => !open,
            )
          }
          className="
            inline-flex
            min-w-[120px]
            items-center
            justify-center
            gap-2
            rounded-full
            bg-brand-700
            px-5
            py-3
            text-sm
            font-bold
            text-white
            shadow-cardHover
            transition
            hover:bg-brand-800
            active:scale-95
          "
        >
          {mapOpen ? (
            <ListIcon className="h-4 w-4" />
          ) : (
            <MapIcon className="h-4 w-4" />
          )}

          {mapOpen
            ? 'Show list'
            : 'Map'}
        </button>
      </div>
    </div>
  )
}

/* ============================================================
   HAVERSINE DISTANCE
============================================================ */

function distanceInKm(
  lat1,
  lng1,
  lat2,
  lng2,
) {
  const R = 6371

  const dLat =
    ((lat2 - lat1) * Math.PI) /
    180

  const dLng =
    ((lng2 - lng1) * Math.PI) /
    180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(
      (lat1 * Math.PI) / 180,
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180,
      ) *
      Math.sin(dLng / 2) ** 2

  return (
    2 *
    R *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    )
  )
}

/* ============================================================
   FILTER PILL
============================================================ */

function Pill({
  label,
  onClear,
}) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        bg-brand-50
        px-3
        py-1
        text-xs
        font-medium
        text-brand-700
      "
    >
      {label}

      <button
        type="button"
        onClick={onClear}
        className="rounded-full hover:text-brand-900"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}