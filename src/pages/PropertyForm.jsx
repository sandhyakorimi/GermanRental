import { useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, ImagePlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useListings } from '../context/ListingsContext'
import { useToast } from '../context/ToastContext'
import { GERMAN_CITIES, PROPERTY_TYPES, AMENITY_LIST } from '../data/cities'
import { classNames } from '../utils/format'

const empty = {
  title: '', city: 'Berlin', district: '', address: '', rent: 800, deposit: 1600,
  utilities: 120, type: 'Apartment', bedrooms: 1, bathrooms: 1, area: 45,
  furnished: true, available: '2026-09-01', minimumStay: 12, images: [],
  amenities: ['WiFi', 'Heating', 'Kitchen'], description: '',
  rentalConditions: ['Kaution (deposit): 2 months cold rent', 'Schufa record required'],
  houseRules: ['No smoking indoors', 'Quiet hours 22:00 – 06:00'],
  whatsapp: '',
  contactEmail: '',
}

export default function PropertyForm() {
  const { id } = useParams()
  const { user, isLandlord } = useAuth()
  const { getProperty, addListing, updateListing } = useListings()
  const toast = useToast()
  const navigate = useNavigate()
  const photoInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const editing = Boolean(id)
  const [form, setForm] = useState(() => {
    if (editing) {
      const p = getProperty(id)
      if (p) {
        return {
          ...empty,
          ...p,
          whatsapp: p.landlord?.whatsapp || p.landlord?.phone || '',
          contactEmail: p.landlord?.email || '',
        }
      }
    }
    return { ...empty }
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const addImages = (files) => {
    const selectedFiles = Array.from(files || []).filter((file) =>
      file.type.startsWith('image/'),
    )

    if (selectedFiles.length === 0) return

    const available = Math.max(0, 10 - form.images.length)

    selectedFiles.slice(0, available).forEach((file) => {
      const reader = new FileReader()

      reader.onload = () => {
        if (typeof reader.result !== 'string') return

        setForm((current) => ({
          ...current,
          images: [...current.images, reader.result].slice(0, 10),
        }))
      }

      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    set('images', form.images.filter((_, i) => i !== index))
  }

  const toggleAmenity = (a) => {
    setForm((f) => {
      const s = new Set(f.amenities)
      if (s.has(a)) s.delete(a)
      else s.add(a)
      return { ...f, amenities: [...s] }
    })
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.whatsapp?.trim()) {
      toast.error('Please enter your WhatsApp number.')
      return
    }
    if (!form.contactEmail?.trim()) {
      toast.error('Please enter your email address.')
      return
    }
    if (form.images.length === 0) {
      toast.error('Please add at least one apartment photo.')
      return
    }
    const data = {
      ...form,
      rent: Number(form.rent), deposit: Number(form.deposit), utilities: Number(form.utilities),
      bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), area: Number(form.area),
      minimumStay: Number(form.minimumStay),
      furnished: form.furnished === true || form.furnished === 'true',
      landlord: {
        name: user?.name || 'Herr Lars Becker',
        role: 'Landlord',
        phone: '+49 30 5555 0000',
        whatsapp: form.whatsapp.trim(),
        email: form.contactEmail.trim(),
        avatar: user?.avatar || 'https://i.pravatar.cc/150?img=12',
        rating: 4.5, listings: 1, responseTime: 'Usually replies within 1 day',
        verified: false, since: '2025',
      },
    }
    if (editing) {
      updateListing(id, data)
      toast.success('Listing updated.')
    } else {
      addListing(data)
      toast.success('Listing created. It will appear once approved by an admin.')
    }
    navigate('/dashboard/landlord')
  }

  if (!user) return null

  return (
    <div className="container-page py-8 lg:py-10">
      <Link to="/dashboard/landlord" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">{editing ? 'Edit property' : 'Add a new property'}</h1>
      <p className="mt-2 text-sm text-ink-600">Fill in the details below. New listings are reviewed by an admin before going live.</p>

      <form onSubmit={submit} className="mt-8 space-y-8">
        <FormCard title="Basic information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" full><input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Bright 2-room apartment near the city center" required /></Field>
            <Field label="City"><select className="input" value={form.city} onChange={(e) => set('city', e.target.value)}>{GERMAN_CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}</select></Field>
            <Field label="District"><input className="input" value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="e.g. Mitte" required /></Field>
            <Field label="Address" full><input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street and house number, postcode" required /></Field>
          </div>
        </FormCard>

        <FormCard title="Contact information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp number">
              <input
                type="tel"
                className="input"
                value={form.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value)}
                placeholder="+49 151 23456789"
                required
              />
              <p className="mt-1.5 text-xs text-ink-500">
                Tenants can contact you on WhatsApp.
              </p>
            </Field>

            <Field label="Email address">
              <input
                type="email"
                className="input"
                value={form.contactEmail}
                onChange={(e) => set('contactEmail', e.target.value)}
                placeholder="landlord@example.com"
                required
              />
              <p className="mt-1.5 text-xs text-ink-500">
                Tenants can contact you by email.
              </p>
            </Field>
          </div>
        </FormCard>

        <FormCard title="Property details">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Property type"><select className="input" value={form.type} onChange={(e) => set('type', e.target.value)}>{PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></Field>
            <Field label="Bedrooms"><input type="number" min="0" className="input" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} required /></Field>
            <Field label="Bathrooms"><input type="number" min="0" className="input" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} required /></Field>
            <Field label="Area (m²)"><input type="number" min="1" className="input" value={form.area} onChange={(e) => set('area', e.target.value)} required /></Field>
            <Field label="Furnishing"><select className="input" value={String(form.furnished)} onChange={(e) => set('furnished', e.target.value === 'true')}><option value="true">Furnished</option><option value="false">Unfurnished</option></select></Field>
            <Field label="Available from"><input type="date" className="input" value={form.available} onChange={(e) => set('available', e.target.value)} required /></Field>
            <Field label="Minimum stay (months)"><input type="number" min="1" className="input" value={form.minimumStay} onChange={(e) => set('minimumStay', e.target.value)} required /></Field>
          </div>
        </FormCard>

        <FormCard title="Pricing">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Cold rent (€/month)"><input type="number" min="0" className="input" value={form.rent} onChange={(e) => set('rent', e.target.value)} required /></Field>
            <Field label="Deposit (€)"><input type="number" min="0" className="input" value={form.deposit} onChange={(e) => set('deposit', e.target.value)} required /></Field>
            <Field label="Utilities (€/month)"><input type="number" min="0" className="input" value={form.utilities} onChange={(e) => set('utilities', e.target.value)} required /></Field>
          </div>
        </FormCard>

        <FormCard title="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITY_LIST.map((a) => {
              const active = form.amenities.includes(a)
              return (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={classNames('rounded-lg border px-3 py-1.5 text-xs font-medium transition', active ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50')}>
                  {a}
                </button>
              )
            })}
          </div>
        </FormCard>

        <FormCard title="Apartment photos">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addImages(e.target.files)
              e.target.value = ''
            }}
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              addImages(e.target.files)
              e.target.value = ''
            }}
          />

          <div className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/40 p-5 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft">
                <ImagePlus className="h-6 w-6" />
              </div>

              <h3 className="mt-3 text-base font-bold text-ink-900">
                Add photos of your apartment
              </h3>

              <p className="mt-1 text-sm text-ink-500">
                Add up to 10 photos. Your first photo will be used as the cover image.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="btn-primary"
                >
                  <ImagePlus className="h-4 w-4" />
                  Choose photos
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="btn-secondary md:hidden"
                >
                  <ImagePlus className="h-4 w-4" />
                  Take a photo
                </button>
              </div>
            </div>
          </div>

          {form.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {form.images.map((src, i) => (
                <div key={`${src}-${i}`} className="group relative overflow-hidden rounded-xl border border-ink-100 bg-white">
                  <img src={src} alt={`Apartment ${i + 1}`} className="aspect-square w-full object-cover" />

                  {i === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-brand-700 px-2 py-1 text-[10px] font-semibold text-white">
                      Cover
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-sm font-bold text-white transition hover:bg-red-600"
                    aria-label={`Remove apartment photo ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormCard>

        <FormCard title="Description & conditions">
          <Field label="Description" full><textarea className="input min-h-32 resize-y" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the property, neighborhood and who it's ideal for." required /></Field>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Rental conditions (one per line)"><textarea className="input min-h-28 resize-y" value={form.rentalConditions.join('\n')} onChange={(e) => set('rentalConditions', e.target.value.split('\n').filter(Boolean))} /></Field>
            <Field label="House rules (one per line)"><textarea className="input min-h-28 resize-y" value={form.houseRules.join('\n')} onChange={(e) => set('houseRules', e.target.value.split('\n').filter(Boolean))} /></Field>
          </div>
        </FormCard>

        <div className="flex items-center justify-end gap-3">
          <Link to="/dashboard/landlord" className="btn-secondary">Cancel</Link>
          <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> {editing ? 'Save changes' : 'Publish listing'}</button>
        </div>
      </form>
    </div>
  )
}

function FormCard({ title, children }) {
  return (
    <div className="card p-5 sm:p-6">
      <h2 className="mb-4 text-base font-bold text-ink-900">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2 lg:col-span-4' : ''}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}
