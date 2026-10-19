import assert from "node:assert/strict"
import { test } from "node:test"
import { PROGRAMS, getLocalDate, parseSavedBooking, validateBooking } from "../lib/booking.ts"

const today = "2026-10-20"
const valid = { name: "Анна", programId: "reset", date: today }

test("each actual program accepts today and future dates", () => {
  for (const program of PROGRAMS) {
    assert.deepEqual(validateBooking({ ...valid, programId: program.id }, today), {})
    assert.deepEqual(validateBooking({ ...valid, programId: program.id, date: "2027-01-01" }, today), {})
  }
})

test("required fields, unknown programs and past dates return field errors", () => {
  assert.deepEqual(Object.keys(validateBooking({ name: "  ", programId: "", date: "" }, today)), ["name", "programId", "date"])
  assert.ok(validateBooking({ ...valid, programId: "gift" }, today).programId)
  assert.ok(validateBooking({ ...valid, date: "2026-10-19" }, today).date)
  assert.ok(validateBooking({ ...valid, name: "а".repeat(101) }, today).name)
})

test("impossible dates and malformed values are rejected, leap dates work", () => {
  for (const date of ["2027-02-29", "2026-02-30", "2026-13-01", "not-a-date", "2026-1-1", "2026-10-20T00:00:00"]) {
    assert.ok(validateBooking({ ...valid, date }, today).date, date)
  }
  assert.deepEqual(validateBooking({ ...valid, date: "2028-02-29" }, today), {})
})

test("local date uses the browser's calendar day rather than UTC", () => {
  const localMidnight = new Date(2026, 9, 20, 0, 1)
  assert.equal(getLocalDate(localMidnight), today)
})

test("saved requests round-trip and remain readable after their desired date", () => {
  assert.deepEqual(parseSavedBooking(JSON.stringify(valid)), valid)
  const older = { ...valid, name: " Анна ", date: "2025-01-01" }
  assert.deepEqual(parseSavedBooking(JSON.stringify(older)), { ...older, name: "Анна" })
})

test("corrupted storage never restores an invalid request", () => {
  for (const raw of [null, "", "{bad json", "null", "[]", "42", JSON.stringify({ ...valid, name: null }), JSON.stringify({ ...valid, date: "2026-02-30" }), JSON.stringify({ ...valid, programId: "unknown" }), JSON.stringify({ ...valid, name: "  " })]) {
    assert.equal(parseSavedBooking(raw), null)
  }
})
