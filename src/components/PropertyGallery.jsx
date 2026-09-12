import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function PropertyGallery({ images = [], alt = 'Property' }) {
  const validImages = Array.isArray(images) ? images.filter(Boolean) : []
  const [activeIndex, setActiveIndex] = useState(0)
  const galleryRef = useRef(null)

  const goTo = (index, behavior = 'smooth') => {
    if (!galleryRef.current || !validImages.length) return

    const nextIndex = Math.max(
      0,
      Math.min(index, validImages.length - 1),
    )

    galleryRef.current.scrollTo({
      left: galleryRef.current.clientWidth * nextIndex,
      behavior,
    })

    setActiveIndex(nextIndex)
  }

  const handlePrevious = () => goTo(activeIndex - 1)
  const handleNext = () => goTo(activeIndex + 1)

  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery || validImages.length <= 1) return

    let frameId

    const handleScroll = () => {
      cancelAnimationFrame(frameId)

      frameId = requestAnimationFrame(() => {
        const width = gallery.clientWidth
        if (!width) return

        const index = Math.round(gallery.scrollLeft / width)
        const safeIndex = Math.max(
          0,
          Math.min(index, validImages.length - 1),
        )

        setActiveIndex((current) =>
          current === safeIndex ? current : safeIndex,
        )
      })
    }

    gallery.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      gallery.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frameId)
    }
  }, [validImages.length])

  useEffect(() => {
    const handleResize = () => {
      if (!galleryRef.current) return

      galleryRef.current.scrollTo({
        left: galleryRef.current.clientWidth * activeIndex,
        behavior: 'auto',
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex >= validImages.length) {
      setActiveIndex(Math.max(0, validImages.length - 1))
    }
  }, [activeIndex, validImages.length])

  if (!validImages.length) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-3xl bg-ink-100 text-sm text-ink-500">
        No property photos available
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-ink-100 shadow-card">
        <div
          ref={galleryRef}
          className="
            flex
            w-full
            overflow-x-auto
            snap-x
            snap-mandatory
            scroll-smooth
            touch-pan-x
            overscroll-x-contain
            scrollbar-none
            [-ms-overflow-style:none]
            [scrollbar-width:none]
          "
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          aria-label="Property photos"
        >
          {validImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="min-w-full shrink-0 snap-center aspect-[16/10]"
            >
              <img
                src={image}
                alt={`${alt} photo ${index + 1}`}
                className="h-full w-full select-none object-cover"
                draggable="false"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={activeIndex === 0}
              aria-label="Previous photo"
              className="
                absolute left-3 top-1/2 z-10
                flex h-10 w-10 -translate-y-1/2
                items-center justify-center
                rounded-full bg-white/90 text-ink-800
                shadow-lg transition hover:bg-white
                disabled:pointer-events-none disabled:opacity-35
                sm:left-4 sm:h-11 sm:w-11
              "
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={activeIndex === validImages.length - 1}
              aria-label="Next photo"
              className="
                absolute right-3 top-1/2 z-10
                flex h-10 w-10 -translate-y-1/2
                items-center justify-center
                rounded-full bg-white/90 text-ink-800
                shadow-lg transition hover:bg-white
                disabled:pointer-events-none disabled:opacity-35
                sm:right-4 sm:h-11 sm:w-11
              "
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={activeIndex === index ? 'true' : 'false'}
              className={`
                rounded-full transition-all duration-200
                ${
                  activeIndex === index
                    ? 'h-1.5 w-6 bg-brand-600'
                    : 'h-1.5 w-1.5 bg-ink-300 hover:bg-ink-400'
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertyGallery
