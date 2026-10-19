"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Какую программу выбрать?",
    answer:
      "«Перезагрузка» — короткая пауза на 60 минут за 3 500 ₽. «Глубокий отдых» — 90 минут без спешки за 5 000 ₽. «Для двоих» — 120 минут вместе за 9 000 ₽. Ориентируйтесь на то, сколько времени хотите посвятить отдыху.",
  },
  {
    question: "Сколько длится отдых?",
    answer:
      "Продолжительность зависит от программы: 60, 90 или 120 минут. Для короткой паузы подойдёт «Перезагрузка», для неспешного отдыха — «Глубокий отдых». Если хотите разделить это время с близким человеком, выбирайте программу «Для двоих».",
  },
  {
    question: "Можно прийти вдвоём?",
    answer:
      "Да, для совместного отдыха есть программа «Для двоих». Она длится 120 минут и стоит 9 000 ₽ за двоих. Это повод провести время вместе, отложить повседневные дела и разделить спокойный день с тем, кто вам дорог.",
  },
  {
    question: "Можно выбрать отдых в подарок?",
    answer:
      "Любую из трёх программ можно выбрать для близкого человека. Час отдыха подойдёт для небольшой паузы, полтора — для неспешного вечера. А программа «Для двоих» станет поводом разделить впечатления и провести время вместе.",
  },
  {
    question: "С чего начать?",
    answer:
      "Подумайте, какого отдыха хочется именно сейчас: короткой паузы, долгого вечера без спешки или времени вдвоём. Затем сравните длительность и стоимость программ. Начать можно с «Перезагрузки» — это час, посвящённый только себе.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Полезно знать</p>
          <h2 className="text-5xl md:text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            Частые вопросы
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                className="w-full py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <Plus
                  className={`w-6 h-6 text-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                aria-hidden={openIndex !== index}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
