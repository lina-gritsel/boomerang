"use client"

import { useState } from "react"
import type { BookingSelection } from "@/lib/booking"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Philosophy } from "@/components/philosophy"
import { Projects } from "@/components/projects"
import { Expertise } from "@/components/expertise"
import { FAQ } from "@/components/faq"
import { CallToAction } from "@/components/call-to-action"
import { Footer } from "@/components/footer"

export default function Home() {
  const [selection, setSelection] = useState<BookingSelection | null>(null)
  const selectProgram = (programId: string) => setSelection((previous) => ({ programId, request: (previous?.request ?? 0) + 1 }))
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Philosophy />
      <Projects onSelectProgram={selectProgram} />
      <Expertise />
      <FAQ />
      <CallToAction selection={selection} />
      <Footer />
    </main>
  )
}
