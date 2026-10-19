"use client"

import { useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"
import { getHeroGeometry, HERO_IMAGE, HERO_SCROLL_DISTANCE } from "@/lib/hero-geometry"

const heroImage = "/images/spa/hero-studio.webp"

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current!
    const scene = sceneRef.current!
    const content = contentRef.current!
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0

    const update = () => {
      const { top, travel } = getHeroGeometry(scene.clientWidth, scene.clientHeight, content.offsetHeight)
      const progress = reducedMotion.matches ? 0 : Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / HERO_SCROLL_DISTANCE))
      content.style.top = `${top}px`
      content.style.transform = `translateY(${progress * travel}px)`
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(update)
    observer.observe(scene)
    observer.observe(content)
    window.addEventListener("scroll", onScroll, { passive: true })
    reducedMotion.addEventListener("change", update)
    update()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      reducedMotion.removeEventListener("change", update)
    }
  }, [])

  return (
    <section id="hero" ref={heroRef} className="relative h-[calc(100svh+640px)] motion-reduce:h-svh">
      <div ref={sceneRef} className="sticky top-0 h-svh overflow-hidden bg-[#69513b] isolate">
        <img
          src={heroImage}
          alt="Уютная зона отдыха Место SPA с деревянной перегородкой и мягким дневным светом"
          width={HERO_IMAGE.width}
          height={HERO_IMAGE.height}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div
          ref={contentRef}
          data-hero-copy
          className="absolute z-10 inset-x-0 mx-auto w-[calc(100%-40px)] sm:w-[calc(100%-64px)] max-w-[1200px] text-center will-change-transform"
          style={{ top: "20%" }}
        >
          <p className="mb-5 text-xs sm:text-sm tracking-[0.3em] uppercase text-white/90">Место SPA · Москва</p>
          <h1 className="hero-title font-medium text-white tracking-tight leading-[0.98]">
            <span className="block sm:whitespace-nowrap">Время замедлиться</span>
            <span className="block sm:whitespace-nowrap text-orange-200">и побыть собой</span>
          </h1>
        </div>

        {/* Match object-cover exactly; the copy is hidden only inside the physical partition silhouette. */}
        <svg
          data-hero-foreground
          aria-hidden="true"
          className="absolute inset-0 z-20 h-full w-full pointer-events-none"
          viewBox={`0 0 ${HERO_IMAGE.width} ${HERO_IMAGE.height}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <clipPath id="spa-partition">
              <path d="M121 514 Q121 508 134 508 H1514 Q1528 508 1528 515 V885 Q1528 903 1503 904 H147 Q121 902 121 882 Z" />
            </clipPath>
          </defs>
          <image href={heroImage} width={HERO_IMAGE.width} height={HERO_IMAGE.height} clipPath="url(#spa-partition)" />
        </svg>

        <div className="absolute bottom-6 inset-x-0 z-30 flex justify-center pointer-events-none text-white/80" aria-hidden="true">
          <ArrowDown className="h-5 w-5" />
        </div>
      </div>
    </section>
  )
}
