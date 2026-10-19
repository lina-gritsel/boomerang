export const PROGRAMS = [
  { id: "reset", title: "Перезагрузка", duration: "60 минут", price: "3 500 ₽" },
  { id: "deep-rest", title: "Глубокий отдых", duration: "90 минут", price: "5 000 ₽" },
  { id: "couples", title: "Для двоих", duration: "120 минут", price: "9 000 ₽" },
] as const

export type Booking = { name: string; programId: string; date: string }
export type BookingSelection = { programId: string; request: number }
export type BookingErrors = Partial<Record<keyof Booking, string>>
export const BOOKING_STORAGE_KEY = "boomerang:booking:v1"

export function getLocalDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

export function validateBooking(booking: Booking, today = getLocalDate()): BookingErrors {
  const errors: BookingErrors = {}
  if (!booking.name.trim()) errors.name = "Пожалуйста, укажите ваше имя."
  else if (booking.name.trim().length > 100) errors.name = "Имя должно быть не длиннее 100 символов."
  if (!PROGRAMS.some((program) => program.id === booking.programId)) errors.programId = "Выберите SPA-программу."
  if (!booking.date) errors.date = "Выберите желаемую дату."
  else {
    const parsed = new Date(`${booking.date}T12:00:00Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== booking.date) {
      errors.date = "Укажите корректную дату."
    } else if (booking.date < today) errors.date = "Эта дата уже прошла. Выберите сегодня или позже."
  }
  return errors
}

export function parseSavedBooking(raw: string | null): Booking | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw)
    if (!value || typeof value.name !== "string" || typeof value.programId !== "string" || typeof value.date !== "string") return null
    const booking = { name: value.name.trim(), programId: value.programId, date: value.date }
    // Past saved requests remain visible; only new requests must use today or a future date.
    return Object.keys(validateBooking(booking, "0000-01-01")).length ? null : booking
  } catch {
    return null
  }
}
