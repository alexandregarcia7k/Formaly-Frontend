"use client"

import { useState } from "react"
import Image from "next/image"

const features = [
  {
    id: 1,
    title: "Crie Formulários",
    description: "Editor intuitivo",
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Compartilhe",
    description: "Links únicos",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Colete Respostas",
    description: "Tempo real",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Analise Dados",
    description: "Insights",
    imageUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop",
  },
]

interface AccordionItemProps {
  item: {
    id: number
    title: string
    description: string
    imageUrl: string
  }
  isActive: boolean
  onMouseEnter: () => void
}

function AccordionItem({ item, isActive, onMouseEnter }: AccordionItemProps) {
  return (
    <div
      className={`
        relative rounded-xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]
        ${isActive ? "w-full sm:w-[280px] md:w-[320px] lg:w-[380px]" : "w-[60px] sm:w-[70px] md:w-20"}
      `}
      onMouseEnter={onMouseEnter}
    >
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 280px, (max-width: 1024px) 320px, 380px"
        priority={isActive}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

      <div
        className={`
          absolute text-white font-semibold transition-all duration-300
          ${
            isActive
              ? "bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 rotate-0"
              : "bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 rotate-90 whitespace-nowrap"
          }
        `}
      >
        <p className={isActive ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}>
          {item.title}
        </p>
        {isActive && (
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/80">
            {item.description}
          </p>
        )}
      </div>
    </div>
  )
}

export function HeroAccordion() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="w-full md:w-1/2">
      <div className="flex items-center justify-center gap-2 overflow-x-auto p-2 sm:gap-3 sm:p-4 md:gap-4">
        {features.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            isActive={index === activeIndex}
            onMouseEnter={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
