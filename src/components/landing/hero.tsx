import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroAccordion } from "./hero-accordion"
import { Header } from "./header"

export function Hero() {
  return (
    <>
      <Header />
      <section className="container mx-auto px-4 pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-32 lg:pb-24">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-12 lg:gap-16">
        
        {/* Content */}
        <div className="w-full text-center md:w-1/2 md:text-left">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Crie formulários
            <span className="text-primary"> incríveis</span> em minutos
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:mt-6 sm:text-lg md:text-xl lg:max-w-xl">
            Formaly é a plataforma completa para criar, gerenciar e compartilhar
            formulários online. Simples, rápido e poderoso.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center md:justify-start">
            <Button size="lg" asChild>
              <Link href="/login">
                Começar gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Ver recursos</Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 sm:gap-8 md:justify-start">
            <div>
              <p className="text-2xl font-bold sm:text-3xl">10k+</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Formulários criados</p>
            </div>
            <div className="h-10 w-px bg-border sm:h-12" />
            <div>
              <p className="text-2xl font-bold sm:text-3xl">50k+</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Respostas coletadas</p>
            </div>
          </div>
        </div>

        {/* Interactive Accordion */}
        <HeroAccordion />
      </div>
      </section>
    </>
  )
}
