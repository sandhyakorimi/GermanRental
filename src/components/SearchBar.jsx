

// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Search, MapPin, Home, Euro } from 'lucide-react'
// import { GERMAN_CITIES, PROPERTY_TYPES } from '../data/cities'
// import { classNames } from '../utils/format'

// export function SearchBar({ variant = 'hero', className = '', defaultValues = {} }) {
//   const [city, setCity] = useState(defaultValues.city || '')
//   const [type, setType] = useState(defaultValues.type || '')
//   const [maxRent, setMaxRent] = useState(defaultValues.maxRent || '')
//   const navigate = useNavigate()

//   const submit = (e) => {
//     e.preventDefault()
//     const params = new URLSearchParams()
//     if (city) params.set('city', city)
//     if (type) params.set('type', type)
//     if (maxRent) params.set('maxRent', maxRent)
//     navigate(`/properties?${params.toString()}`)
//   }

//   const isHero = variant === 'hero'

//   return (
//     <form
//       onSubmit={submit}
//       className={classNames(
//         // Compact, subtle glass shell. Keeps the existing form/navigation behavior.
//         'w-full overflow-hidden rounded-[20px] border border-white/55 bg-white/25 p-1.5 shadow-[0_8px_28px_rgba(6,75,122,0.12)] backdrop-blur-xl transition-all duration-300',
//         'hover:bg-white/30 hover:shadow-[0_10px_32px_rgba(6,75,122,0.15)]',
//         isHero && 'sm:rounded-full',
//         className,
//       )}
//     >
//       <div
//         className="
//           flex w-full min-w-0 items-stretch
//           rounded-[15px]
//           bg-white/15
//           backdrop-blur-md
//           sm:rounded-full
//         "
//       >
//         {/* CITY */}
//         <Field
//           icon={<MapPin className="h-4 w-4 text-[#064B7A] sm:h-[18px] sm:w-[18px]" />}
//           label="City"
//         >
//           <select
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//             aria-label="City"
//             className="
//               w-full min-w-0 appearance-none
//               cursor-pointer bg-transparent
//               text-[11px] font-semibold text-[#102A43]
//               outline-none
//               focus:outline-none
//               sm:text-sm
//             "
//           >
//             <option value="">Any city</option>
//             {GERMAN_CITIES.map((c) => (
//               <option key={c.name} value={c.name}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </Field>

//         {/* PROPERTY TYPE */}
//         <Field
//           icon={<Home className="h-4 w-4 text-[#064B7A] sm:h-[18px] sm:w-[18px]" />}
//           label="Type"
//         >
//           <select
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             aria-label="Property type"
//             className="
//               w-full min-w-0 appearance-none
//               cursor-pointer bg-transparent
//               text-[11px] font-semibold text-[#102A43]
//               outline-none
//               focus:outline-none
//               sm:text-sm
//             "
//           >
//             <option value="">Any type</option>
//             {PROPERTY_TYPES.map((t) => (
//               <option key={t} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>
//         </Field>

//         {/* MAX RENT */}
//         <Field
//           icon={<Euro className="h-4 w-4 text-[#064B7A] sm:h-[18px] sm:w-[18px]" />}
//           label="Max rent"
//           grow
//         >
//           <input
//             type="number"
//             min="0"
//             step="50"
//             value={maxRent}
//             onChange={(e) => setMaxRent(e.target.value)}
//             placeholder="Any"
//             aria-label="Maximum rent"
//             className="
//               w-full min-w-0 bg-transparent
//               text-[11px] font-semibold text-[#102A43]
//               placeholder:text-[#064B7A]/45
//               outline-none
//               focus:outline-none
//               sm:text-sm
//             "
//           />
//         </Field>

//         {/* SEARCH */}
//         <button
//           type="submit"
//           aria-label="Search"
//           className={classNames(
//             'my-1 mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#064B7A] to-[#003B63] text-white shadow-[0_5px_15px_rgba(6,75,122,0.24)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_7px_19px_rgba(6,75,122,0.30)] active:scale-95 sm:my-1.5 sm:mr-1.5 sm:h-11 sm:w-auto sm:min-w-[118px] sm:rounded-full sm:px-5',
//             isHero && 'sm:rounded-full',
//           )}
//         >
//           <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
//           <span className="ml-1.5 hidden text-sm font-semibold sm:inline">
//             Search
//           </span>
//         </button>
//       </div>
//     </form>
//   )
// }

// function Field({ icon, label, children, grow = false }) {
//   return (
//     <label
//       className={classNames(
//         // All fields remain in one row on small screens.
//         'group flex h-12 min-w-0 flex-1 items-center gap-1.5 overflow-hidden border-r border-white/35 px-2 transition-all duration-200 last:border-r-0',
//         'hover:bg-white/40',
//         'sm:h-14 sm:gap-2 sm:px-3',
//         grow ? 'flex-[1.05]' : 'flex-1',
//       )}
//     >
//       {/* Icons stay visible on mobile; this keeps each field recognizable. */}
//       <span className="flex shrink-0">
//         {icon}
//       </span>

//       <span className="flex min-w-0 flex-1 flex-col justify-center">
//         <span className="truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-[#064B7A]/55 sm:text-[10px]">
//           {label}
//         </span>

//         <span className="mt-0.5 min-w-0 truncate text-[#102A43]">
//           {children}
//         </span>
//       </span>
//     </label>
//   )
// }




import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Home, Euro, ChevronDown, Check } from 'lucide-react'
import { GERMAN_CITIES, PROPERTY_TYPES } from '../data/cities'
import { classNames } from '../utils/format'

export function SearchBar({ variant = 'hero', className = '', defaultValues = {} }) {
  const [city, setCity] = useState(defaultValues.city || '')
  const [type, setType] = useState(defaultValues.type || '')
  const [maxRent, setMaxRent] = useState(defaultValues.maxRent || '')
  const [openMenu, setOpenMenu] = useState(null)
  const navigate = useNavigate()
  const barRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const submit = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (type) params.set('type', type)
    if (maxRent) params.set('maxRent', maxRent)

    const query = params.toString()
    navigate(query ? `/properties?${query}` : '/properties')
    setOpenMenu(null)
  }

  const isHero = variant === 'hero'

  return (
    <form
      ref={barRef}
      onSubmit={submit}
      className={classNames(
        'relative w-full rounded-[20px] border border-white/55 bg-white/25 p-1.5 shadow-[0_8px_28px_rgba(6,75,122,0.12)] backdrop-blur-xl transition-all duration-300 hover:bg-white/30 hover:shadow-[0_10px_32px_rgba(6,75,122,0.15)]',
        isHero && 'sm:rounded-full',
        className,
      )}
    >
      <div className="flex h-[52px] w-full min-w-0 items-stretch overflow-visible rounded-[15px] bg-white/15 backdrop-blur-md sm:h-14 sm:rounded-full">
        <DropdownField
          icon={<MapPin className="h-4 w-4 shrink-0 text-[#064B7A] sm:h-[18px] sm:w-[18px]" />}
          label="City"
          value={city || 'Any city'}
          open={openMenu === 'city'}
          onToggle={() => setOpenMenu(openMenu === 'city' ? null : 'city')}
          options={GERMAN_CITIES.map((c) => c.name)}
          selected={city}
          onSelect={(value) => {
            setCity(value)
            setOpenMenu(null)
          }}
        />

        <DropdownField
          icon={<Home className="h-4 w-4 shrink-0 text-[#064B7A] sm:h-[18px] sm:w-[18px]" />}
          label="Type"
          value={type || 'Any type'}
          open={openMenu === 'type'}
          onToggle={() => setOpenMenu(openMenu === 'type' ? null : 'type')}
          options={PROPERTY_TYPES}
          selected={type}
          onSelect={(value) => {
            setType(value)
            setOpenMenu(null)
          }}
        />

        <label className="flex min-w-0 flex-1 items-center gap-1.5 border-r border-white/35 px-2 sm:gap-2 sm:px-3">
          <Euro className="h-4 w-4 shrink-0 text-[#064B7A] sm:h-[18px] sm:w-[18px]" />

          <span className="flex min-w-0 flex-1 flex-col justify-center">
            <span className="truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-[#064B7A]/55 sm:text-[10px]">
              Max rent
            </span>

            <input
              type="number"
              min="0"
              step="50"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              onFocus={() => setOpenMenu(null)}
              placeholder="Any"
              aria-label="Maximum rent"
              className="mt-0.5 w-full min-w-0 bg-transparent text-[11px] font-semibold text-[#102A43] placeholder:text-[#064B7A]/45 outline-none sm:text-sm"
            />
          </span>
        </label>

        <button
          type="submit"
          aria-label="Search"
          className="my-1 mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#064B7A] to-[#003B63] text-white shadow-[0_5px_15px_rgba(6,75,122,0.24)] transition-all duration-200 hover:brightness-110 active:scale-95 sm:my-1.5 sm:mr-1.5 sm:h-11 sm:w-auto sm:min-w-[118px] sm:rounded-full sm:px-5"
        >
          <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
          <span className="ml-1.5 hidden text-sm font-semibold sm:inline">Search</span>
        </button>
      </div>
    </form>
  )
}

function DropdownField({
  icon,
  label,
  value,
  open,
  onToggle,
  options,
  selected,
  onSelect,
}) {
  return (
    <div className="relative flex min-w-0 flex-1 border-r border-white/35">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggle}
        className="flex h-full min-w-0 w-full items-center gap-1.5 px-2 text-left transition-colors duration-200 hover:bg-white/40 sm:gap-2 sm:px-3"
      >
        {icon}

        <span className="flex min-w-0 flex-1 flex-col justify-center">
          <span className="truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-[#064B7A]/55 sm:text-[10px]">
            {label}
          </span>

          <span className="mt-0.5 flex min-w-0 items-center gap-1">
            <span className="truncate text-[11px] font-semibold text-[#102A43] sm:text-sm">
              {value}
            </span>
            <ChevronDown
              className={classNames(
                'h-3 w-3 shrink-0 text-[#064B7A]/45 transition-transform duration-200 sm:h-3.5 sm:w-3.5',
                open && 'rotate-180',
              )}
            />
          </span>
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-[100] w-[min(220px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-white/60 bg-white/75 p-1.5 shadow-[0_15px_40px_rgba(6,75,122,0.18)] backdrop-blur-2xl"
        >
          <button
            type="button"
            role="option"
            aria-selected={!selected}
            onClick={() => onSelect('')}
            className={classNames(
              'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#102A43] transition-colors',
              !selected ? 'bg-[#064B7A]/10 text-[#064B7A]' : 'hover:bg-white/65',
            )}
          >
            <span>{label === 'City' ? 'Any city' : 'Any type'}</span>
            {!selected && <Check className="h-4 w-4 text-[#064B7A]" />}
          </button>

          <div className="my-1 h-px bg-[#064B7A]/10" />

          <div className="max-h-56 overflow-y-auto overscroll-contain">
            {options.map((option) => {
              const isSelected = option === selected

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelect(option)}
                  className={classNames(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-[#064B7A]/10 font-semibold text-[#064B7A]'
                      : 'font-medium text-[#102A43] hover:bg-white/65',
                  )}
                >
                  <span className="truncate">{option}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-[#064B7A]" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}