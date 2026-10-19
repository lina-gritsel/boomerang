"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    id: 1,
    programId: "reset",
    title: "Перезагрузка",
    category: "Для себя",
    location: "60 минут",
    year: "3 500 ₽",
    image: "/images/spa/reset-studio.webp",
    alt: "Уютный кабинет с массажным столом, светлой мебелью и дневным светом",
  },
  {
    id: 2,
    programId: "deep-rest",
    title: "Глубокий отдых",
    category: "Без спешки",
    location: "90 минут",
    year: "5 000 ₽",
    image: "/images/spa/deep-rest-studio.webp",
    alt: "Массажный стол с мягким пледом в спокойном светлом кабинете",
  },
  {
    id: 3,
    programId: "couples",
    title: "Для двоих",
    category: "Вместе",
    location: "120 минут",
    year: "9 000 ₽",
    image: "/images/spa/couples-studio.webp",
    alt: "Парный SPA-кабинет с двумя массажными столами",
  },
  {
    id: 4,
    programId: "",
    title: "Отдых в подарок",
    category: "Для близких",
    location: "любая программа",
    year: "от 3 500 ₽",
    image: "/images/spa/gift-studio.webp",
    alt: "Мягкий халат, полотенца и керамическая чашка в зоне отдыха",
  },
]

export function Projects({ onSelectProgram }: { onSelectProgram: (programId: string) => void }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">SPA-программы</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Выберите свой отдых</h2>
          </div>
          <a
            href="#faq"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Как выбрать программу
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <a href="#contact" onClick={() => onSelectProgram(project.programId)} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground" aria-label={`${project.title} — выбрать программу`}>
              <div ref={(el) => { imageRefs.current[index] = el }} className="relative overflow-hidden aspect-[4/3] mb-6">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.alt}
                  loading="lazy"
                  width={1448}
                  height={1086}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredId === project.id ? "scale-105" : "scale-100"
                  }`}
                />
                <div
                  className="absolute inset-0 bg-primary origin-top"
                  style={{
                    transform: revealedImages.has(project.id) ? "scaleY(0)" : "scaleY(1)",
                    transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-medium mb-2 group-hover:underline underline-offset-4">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {project.category} · {project.location}
                  </p>
                </div>
                <span className="text-muted-foreground/60 text-sm">{project.year}</span>
              </div>
              <span className="mt-4 inline-flex items-center gap-2 border-b border-border pb-1 text-sm transition-colors group-hover:border-foreground">{project.programId ? "Выбрать программу" : "Выбрать подарок"}<ArrowUpRight className="h-4 w-4" /></span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
