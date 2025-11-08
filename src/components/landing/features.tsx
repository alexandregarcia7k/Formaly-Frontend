'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FileText, Share2, BarChart3, Download } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function Features() {
    type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4'
    const [activeItem, setActiveItem] = useState<ImageKey>('item-1')

    const images = {
        'item-1': {
            image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop',
            alt: 'Editor de formulários',
        },
        'item-2': {
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
            alt: 'Compartilhamento de formulários',
        },
        'item-3': {
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
            alt: 'Análise de respostas',
        },
        'item-4': {
            image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop',
            alt: 'Exportação de dados',
        },
    }

    return (
        <section id="features" className="py-16 md:py-24 lg:py-32">
            <div className="container mx-auto max-w-6xl space-y-12 px-4 md:space-y-16 lg:space-y-20">
                <div className="relative z-10 mx-auto max-w-3xl space-y-4 text-center">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Recursos poderosos para seus formulários
                    </h2>
                    <p className="text-lg text-muted-foreground sm:text-xl">
                        Tudo que você precisa para criar, compartilhar e analisar formulários de forma profissional. 
                        Simples de usar, mas com recursos avançados quando você precisar.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                    <Accordion
                        type="single"
                        value={activeItem}
                        onValueChange={(value) => setActiveItem(value as ImageKey)}
                        className="w-full space-y-2">
                        <AccordionItem value="item-1" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-base font-semibold">Editor Intuitivo</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-2 text-muted-foreground">
                                Crie formulários profissionais com nosso editor drag-and-drop. 
                                Adicione campos de texto, seleção, data, upload de arquivos e muito mais. 
                                Personalize validações e configure opções avançadas sem escrever código.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Share2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-base font-semibold">Compartilhamento Fácil</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-2 text-muted-foreground">
                                Cada formulário recebe um link único e público. Compartilhe via email, redes sociais 
                                ou incorpore em seu site. Seus respondentes não precisam criar conta para preencher.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-base font-semibold">Análise em Tempo Real</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-2 text-muted-foreground">
                                Visualize todas as respostas em tempo real. Filtre, busque e analise os dados coletados 
                                com gráficos e estatísticas automáticas. Identifique padrões e tome decisões baseadas em dados.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4" className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Download className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="text-base font-semibold">Exportação Versátil</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-2 text-muted-foreground">
                                Exporte seus dados em múltiplos formatos: CSV para Excel, JSON para desenvolvedores, 
                                ou PDF para relatórios. Integre facilmente com outras ferramentas e sistemas.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border bg-muted/30 p-4">
                        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border bg-background shadow-lg">
                            <div
                                key={activeItem}
                                className="h-full w-full transition-opacity duration-300"
                                style={{ opacity: 1 }}>
                                <Image
                                    src={images[activeItem].image}
                                    className="h-full w-full object-cover"
                                    alt={images[activeItem].alt}
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
