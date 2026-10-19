import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-xl font-medium tracking-tight whitespace-nowrap">Место SPA</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Место для тишины, заботы и отдыха от будней. Выберите свою SPA-программу
              и подарите себе время без спешки.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium mb-4">Студия</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#projects" className="hover:text-foreground transition-colors">
                  Программы
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-foreground transition-colors">
                  О студии
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-foreground transition-colors">
                  Наш подход
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-foreground transition-colors">
                  Отдых
                </Link>
              </li>
            </ul>
          </div>

          {/* Отдых */}
          <div>
            <h4 className="text-sm font-medium mb-4">Информация</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  Москва
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors">
                  Вопросы и ответы
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-foreground transition-colors">
                  Выбрать программу
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 Место SPA.</p>
        </div>
      </div>
    </footer>
  )
}
