import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  const projects = [
    { id: 1, title: "Интернет-магазин", desc: "Разработка под ключ", image: "https://placehold.co/600x400/png?text=Shop" },
    { id: 2, title: "Корпоративный портал", desc: "Для крупной компании", image: "https://placehold.co/600x400/png?text=Portal" },
    { id: 3, title: "Лендинг пейдж", desc: "Высокая конверсия", image: "https://placehold.co/600x400/png?text=Landing" },
    { id: 4, title: "CRM система", desc: "Автоматизация бизнеса", image: "https://placehold.co/600x400/png?text=CRM" },
    { id: 5, title: "Мобильное приложение", desc: "React Native", image: "https://placehold.co/600x400/png?text=Mobile" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="border-b p-4 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="font-bold text-2xl tracking-tighter text-primary">Wexa<span className="text-blue-600">.su</span></div>
        <nav className="flex gap-4 items-center">
          <Link to="/login"><Button variant="ghost">Вход</Button></Link>
          <Link to="/register"><Button className="bg-blue-600 hover:bg-blue-700">Регистрация</Button></Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-gradient-to-b from-white to-gray-50">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900">
            Разработка <span className="text-blue-600">современных</span> веб-решений
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Мы создаем сайты, сервисы и приложения, которые помогают вашему бизнесу расти. Качественно. Быстро. Надежно.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register"><Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">Начать работу</Button></Link>
            <a href="#portfolio"><Button size="lg" variant="outline" className="text-lg px-8">Смотреть работы</Button></a>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Наши работы</h2>
            
            <div className="flex justify-center">
              <Carousel className="w-full max-w-4xl" opts={{ align: "start", loop: true }}>
                <CarouselContent className="-ml-4">
                  {projects.map((project) => (
                    <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                          <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.desc}</p>
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
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="font-bold text-xl mb-2">Скорость</h3>
                <p className="text-muted-foreground">Запуск проектов в кратчайшие сроки без потери качества</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="font-bold text-xl mb-2">Качество</h3>
                <p className="text-muted-foreground">Чистый код, современный стек и внимание к деталям</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="font-bold text-xl mb-2">Поддержка</h3>
                <p className="text-muted-foreground">Мы не бросаем проекты после сдачи, а развиваем их</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-2xl text-white">Wexa.su</span>
            <p className="text-sm mt-2">© 2026 Все права защищены</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">О нас</a>
            <a href="#" className="hover:text-white transition-colors">Услуги</a>
            <a href="#" className="hover:text-white transition-colors">Контакты</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
