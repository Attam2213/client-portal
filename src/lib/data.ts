
export const portfolioItems = [
  {
    id: 1,
    title: "Интернет-магазин электроники",
    description: "Современный e-commerce с интеграцией 1С и онлайн-оплатой.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Next.js", "Shopify", "Tailwind"],
  },
  {
    id: 2,
    title: "Корпоративный портал",
    description: "Внутренняя система для управления задачами и персоналом.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: 3,
    title: "Лендинг для стартапа",
    description: "Высококонверсионный лендинг с анимациями.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Astro", "GSAP"],
  },
  {
    id: 4,
    title: "Сайт недвижимости",
    description: "Каталог объектов с картой и фильтрами.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Vue.js", "Firebase"],
  },
]

export const services = [
  {
    id: 1,
    title: "Разработка сайта",
    description: "Сайт под ключ: от дизайна до запуска.",
    price: "от 50 000 ₽",
    features: ["Уникальный дизайн", "Адаптивная верстка", "SEO оптимизация"],
  },
  {
    id: 2,
    title: "Поддержка и VDS",
    description: "Администрирование серверов и продление доменов.",
    price: "от 2 000 ₽/мес",
    features: ["Мониторинг 24/7", "Бекапы", "Обновление ПО"],
  },
  {
    id: 3,
    title: "Доработка функционала",
    description: "Внедрение новых фич в существующие проекты.",
    price: "от 1 500 ₽/час",
    features: ["Рефакторинг", "Оптимизация скорости", "Интеграции"],
  },
]

export const clientData = {
  balance: 1500,
  domains: [
    { id: 1, name: "myshop.ru", status: "active", expires: "2026-05-20", auto_renew: true },
    { id: 2, name: "blog.com", status: "expiring", expires: "2026-02-15", auto_renew: false },
  ],
  servers: [
    { id: 1, name: "Web Server 1", ip: "192.168.1.1", status: "running", provider: "FirstVDS", cost: "500 ₽/мес" },
    { id: 2, name: "DB Server", ip: "192.168.1.2", status: "stopped", provider: "Reg.ru", cost: "300 ₽/мес" },
  ]
}
