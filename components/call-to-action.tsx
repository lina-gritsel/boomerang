"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowRight, ArrowUpRight, Check, ChevronDown, MapPin } from "lucide-react"
import { HighlightedText } from "./highlighted-text"
import { BOOKING_STORAGE_KEY, PROGRAMS, getLocalDate, parseSavedBooking, validateBooking, type Booking, type BookingErrors, type BookingSelection } from "@/lib/booking"

const studioAddress = "Москва, ул. Покровка, 27"
const mapQuery = encodeURIComponent(studioAddress)
const mapUrl = `https://yandex.ru/maps/213/moscow/?text=${mapQuery}`
const fieldClass = "w-full min-w-0 rounded-none border border-border bg-transparent px-4 py-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground focus:ring-1 focus:ring-foreground aria-[invalid=true]:border-red-700"

export function CallToAction({ selection }: { selection: BookingSelection | null }) {
  const [values, setValues] = useState<Booking>({ name: "", programId: "reset", date: "" })
  const [errors, setErrors] = useState<BookingErrors>({})
  const [receipt, setReceipt] = useState<Booking | null>(null)
  const [saveError, setSaveError] = useState("")
  const [today, setToday] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Browser-local dates and storage are available only after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(getLocalDate())
    try {
      const saved = parseSavedBooking(localStorage.getItem(BOOKING_STORAGE_KEY))
      if (saved) {
        setValues(saved)
        setReceipt(saved)
      }
    } catch { /* The form remains usable if reading browser storage is unavailable. */ }
  }, [])

  useEffect(() => {
    if (!selection) return
    // A selection request reopens the form while preserving the entered fields.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues((previous) => ({ ...previous, programId: selection.programId }))
    setReceipt(null)
    setErrors({})
    setSaveError("")
  }, [selection])

  useEffect(() => {
    if (receipt) confirmationRef.current?.focus({ preventScroll: true })
  }, [receipt])

  const updateField = (field: keyof Booking, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
    setSaveError("")
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const booking = { ...values, name: values.name.trim() }
    const currentDate = getLocalDate()
    setToday(currentDate)
    const nextErrors = validateBooking(booking, currentDate)
    setErrors(nextErrors)
    const firstError = (Object.keys(nextErrors) as (keyof Booking)[])[0]
    if (firstError) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus()
      return
    }
    try {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking))
      setValues(booking)
      setReceipt(booking)
      setSaveError("")
    } catch {
      setSaveError("Не удалось сохранить заявку. Разрешите сохранение данных в браузере и попробуйте ещё раз.")
    }
  }

  const savedProgram = PROGRAMS.find((program) => program.id === receipt?.programId)

  return (
    <section id="contact" aria-labelledby="booking-title" className="scroll-mt-28 py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-16">
          <p className="text-muted-foreground text-xs sm:text-sm tracking-[0.3em] uppercase mb-6">Время для себя</p>
          <h2 id="booking-title" className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.08] tracking-tight">
            Оставьте время<br /><HighlightedText>для себя</HighlightedText>
          </h2>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="min-w-0 order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden border border-border bg-secondary/50">
              <iframe
                title={`Место SPA на карте — ${studioAddress}`}
                src={`https://yandex.ru/map-widget/v1/?text=${mapQuery}&z=16`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xl font-medium">Место SPA</p>
                <p className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{studioAddress}</p>
              </div>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex shrink-0 items-center gap-1 border-b border-border pb-1 text-sm hover:border-foreground" aria-label="Открыть адрес в Яндекс Картах">
                На карте <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="min-w-0 order-1 lg:order-2">
            {receipt && savedProgram ? (
              <div ref={confirmationRef} tabIndex={-1} role="status" aria-live="polite" className="border-t border-border pt-7 outline-none">
                <Check className="mb-6 h-8 w-8" strokeWidth={1.4} />
                <h3 className="text-3xl font-medium tracking-tight mb-4">Заявка сохранена</h3>
                <p className="text-muted-foreground mb-8">{receipt.name}, вы оставили время для себя.</p>
                <dl className="mb-8 divide-y divide-border border-y border-border">
                  <div className="flex justify-between gap-4 py-4"><dt className="text-muted-foreground">Имя</dt><dd className="text-right break-words min-w-0">{receipt.name}</dd></div>
                  <div className="flex justify-between gap-4 py-4"><dt className="text-muted-foreground">Программа</dt><dd className="text-right">{savedProgram.title}</dd></div>
                  <div className="flex justify-between gap-4 py-4"><dt className="text-muted-foreground">Желаемая дата</dt><dd className="text-right">{new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${receipt.date}T12:00:00`))}</dd></div>
                  <div className="flex justify-between gap-4 py-4"><dt className="text-muted-foreground">Длительность и цена</dt><dd className="text-right">{savedProgram.duration} · {savedProgram.price}</dd></div>
                </dl>
                <button type="button" onClick={() => setReceipt(null)} className="inline-flex items-center gap-3 border-b border-foreground pb-1 text-sm hover:text-muted-foreground">Изменить заявку <ArrowRight className="h-4 w-4" /></button>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={submit}>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-9 sm:mb-10">Выберите программу и удобную дату. Остальное подождёт.</p>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="booking-name" className="mb-3 block text-sm font-medium">Ваше имя</label>
                    <input id="booking-name" name="name" value={values.name} onChange={(event) => updateField("name", event.target.value)} autoComplete="given-name" maxLength={100} required placeholder="Как к вам обращаться" className={fieldClass} aria-invalid={!!errors.name} aria-describedby={errors.name ? "booking-name-error" : undefined} />
                    {errors.name && <p id="booking-name-error" className="mt-2 text-sm text-red-800">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="booking-program" className="mb-3 block text-sm font-medium">SPA-программа</label>
                    <div className="relative">
                      <select id="booking-program" name="programId" value={values.programId} onChange={(event) => updateField("programId", event.target.value)} required className={`${fieldClass} appearance-none pr-10`} aria-invalid={!!errors.programId} aria-describedby={errors.programId ? "booking-program-error" : undefined}>
                        <option value="" disabled>Выберите программу</option>
                        {PROGRAMS.map((program) => <option key={program.id} value={program.id}>{program.title} · {program.duration} · {program.price}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" aria-hidden="true" />
                    </div>
                    {errors.programId && <p id="booking-program-error" className="mt-2 text-sm text-red-800">{errors.programId}</p>}
                  </div>
                  <div>
                    <label htmlFor="booking-date" className="mb-3 block text-sm font-medium">Желаемая дата</label>
                    <input id="booking-date" name="date" type="date" value={values.date} min={today || undefined} max="9999-12-31" onChange={(event) => updateField("date", event.target.value)} required className={`${fieldClass} [color-scheme:light]`} aria-invalid={!!errors.date} aria-describedby={errors.date ? "booking-date-error" : undefined} />
                    {errors.date && <p id="booking-date-error" className="mt-2 text-sm text-red-800">{errors.date}</p>}
                  </div>
                </div>
                {saveError && <p role="alert" className="mt-5 text-sm text-red-800">{saveError}</p>}
                <button type="submit" className="mt-6 flex w-full items-center justify-center gap-5 bg-foreground px-6 py-5 text-sm text-background transition-colors hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
                  Оставить заявку <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
