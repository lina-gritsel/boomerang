"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-300",
        scrolled || mobileMenuOpen
          ? "bg-primary/95 backdrop-blur-md top-3 left-3 right-3 rounded-2xl"
          : "bg-transparent top-0 left-0 right-0",
      )}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 group" onClick={scrollToTop}>
          <span className="text-white text-xl font-medium tracking-tight whitespace-nowrap">Место SPA</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-6 xl:gap-10 text-sm tracking-wide whitespace-nowrap">
          {[
            { label: "Главная", href: "#hero" },
            { label: "О студии", href: "#about" },
            { label: "Программы", href: "#projects" },
            { label: "Наш подход", href: "#services" },
            { label: "Вопросы", href: "#faq" },
          ].map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="hover:text-[rgb(251,146,60)] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-[rgb(251,146,60)] after:transition-all after:duration-300 text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="#projects"
          className={cn(
            "hidden lg:inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm px-5 py-2.5 transition-all duration-300",
            scrolled
              ? "bg-white text-foreground border border-foreground/20 hover:bg-foreground hover:text-white"
              : "bg-white text-foreground border border-foreground/20 hover:bg-foreground hover:text-white",
          )}
        >
          Выбрать отдых
        </Link>

        <button
          className="lg:hidden shrink-0 z-50 p-2 -mr-2 transition-colors duration-300 text-white"
          aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          )}
        </button>
      </nav>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out max-h-[calc(100svh-100px)] overflow-y-auto",
          mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div id="mobile-navigation" inert={!mobileMenuOpen} className="mx-auto px-5 sm:px-6">
          <ul className="flex flex-col gap-4 pt-4 mb-6">
            {[
              { label: "Главная", href: "#hero" },
              { label: "О студии", href: "#about" },
              { label: "Программы", href: "#projects" },
              { label: "Наш подход", href: "#services" },
              { label: "Вопросы", href: "#faq" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-[rgb(251,146,60)] transition-colors duration-300 text-white text-3xl sm:text-4xl font-light block"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="#projects"
            className="inline-flex items-center justify-center gap-2 text-sm px-5 py-2.5 bg-white text-foreground border border-foreground/20 hover:bg-foreground hover:text-white transition-all duration-300 mb-4"
            onClick={closeMobileMenu}
          >
            Выбрать отдых
          </Link>
        </div>
      </div>
    </header>
  )
}
