
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Monitor, Server, Code, ArrowRight } from "lucide-react"
import { portfolioItems, services } from "@/lib/data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/db"

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <Code className="h-6 w-6" />
            <span>DevStudio</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#portfolio" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Портфолио
            </Link>
            <Link href="#services" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Услуги
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Войти</Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Личный кабинет</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default async function LandingPage() {
  let dbItems: any[] = []
  try {
    dbItems = await prisma.portfolioItem.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (e) {
    console.warn("Could not fetch portfolio items from DB, using mock data")
  }

  const displayItems = dbItems.length > 0 ? dbItems : portfolioItems

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 px-4 md:px-6">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              Разработка и поддержка <br className="hidden sm:inline" />
              вашего бизнеса в сети
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Создаю сайты, настраиваю сервера и помогаю с доменами. 
              Ваш персональный IT-отдел в одном лице.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg" className="h-11 px-8">Начать работу</Button>
              </Link>
              <Link href="#portfolio">
                <Button variant="outline" size="lg" className="h-11 px-8">Портфолио</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="container space-y-6 bg-slate-50 py-8 dark:bg-slate-900 md:py-12 lg:py-24 rounded-3xl mx-auto px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Портфолио
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Реальные проекты, которые приносят прибыль клиентам.
            </p>
          </div>
          
          <div className="mx-auto w-full max-w-4xl px-8 md:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {displayItems.map((item) => (
                  <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/2">
                    <div className="p-1">
                      <Card className="overflow-hidden bg-background h-full">
                        <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground">
                            {item.image && item.image.startsWith("/") ? (
                                // Simple check for placeholder vs real image if needed later
                                <span className="text-4xl">🖼️</span>
                            ) : (
                                <span className="text-4xl">🖼️</span>
                            )}
                        </div>
                        <CardHeader>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="container py-8 md:py-12 lg:py-24 mx-auto px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Услуги и цены
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Прозрачное ценообразование без скрытых платежей.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3 mt-8">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="text-3xl font-bold mb-4">{service.price}</div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {service.features.map(feature => (
                            <li key={feature} className="flex items-center">
                                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Заказать</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2026 DevStudio. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  )
}
